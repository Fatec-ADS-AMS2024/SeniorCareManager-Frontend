import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import { routes } from './routes';
import { AppLayout } from '@/features/layouts';
import HeaderFooterLayout from '@/features/layouts/HeaderFooterLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route
        path=''
        element={<AppLayout />}
        errorElement={<GlobalErrorBoundary />}
      >
        <Route {...routes.ADMIN_OVERVIEW} />
        <Route {...routes.REGISTRATIONS} />
        <Route {...routes.RELIGION} />
        <Route {...routes.HEALTH_INSURANCE_PLAN} />
        <Route {...routes.POSITION} />
      </Route>
      <Route
        path=''
        element={<HeaderFooterLayout />}
        errorElement={<GlobalErrorBoundary />}
      >
        <Route {...routes.LOGIN} />
        <Route {...routes.ACCESSIBILITY} />
        <Route {...routes.LANDING} />
      </Route>
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
