import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import { routes } from './routes';
import { AppLayout } from '@/features/layouts';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path=''
      element={<AppLayout />}
      errorElement={<GlobalErrorBoundary />}
    >
      <Route {...routes.ACCESSIBILITY} />

      <Route {...routes.LANDING} />
      <Route {...routes.LOGIN} />
      <Route {...routes.GENERALADM} />
      <Route {...routes.REGISTRATIONS} />
      <Route {...routes.RELIGIONREGISTRATION} />
      <Route {...routes.HEALTHINSURANCEPLANREGISTRATION} />
      <Route {...routes.POSITIONREGISTRATION} />
    </Route>
  )
);

/**
 * Componente exibido ao dar erro nas rotas
 */
function GlobalErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <main className='min-h-screen w-screen p-4'>
      <h1 className='text-2xl text-danger'>Erro ao tentar acessar a página!</h1>
    </main>
  );
}

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
