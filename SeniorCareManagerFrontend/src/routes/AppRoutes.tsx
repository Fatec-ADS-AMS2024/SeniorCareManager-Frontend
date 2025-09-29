import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import { routes } from './routes';
import { AppLayout } from '@/features/layouts';
import AcessibilityPage from '@/pages/AcessibilityPage';

import LandingPage from '@/pages/LandingPage';
import { LoginPage } from '@/features/auth';
import GeneralAdministrator from '@/pages/GeneralAdministrator';
import Registrations from '@/pages/Registrations';
import { ReligionRegistration } from '@/features/religion';
import { HealthInsurancePlanRegistration } from '@/features/healthInsurancePlan';
import { PositionRegistration } from '@/features/position';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path=''
      element={<AppLayout />}
      errorElement={<GlobalErrorBoundary />}
    >
      <Route path={routes.ACCESSIBILITY.path} element={<AcessibilityPage />} />

      <Route path={routes.LANDING.path} element={<LandingPage />} />
      <Route path={routes.LOGIN.path} element={<LoginPage />} />
      <Route path={routes.GENERALADM.path} element={<GeneralAdministrator />} />
      <Route path={routes.REGISTRATIONS.path} element={<Registrations />} />
      <Route
        path={routes.RELIGIONREGISTRATION.path}
        element={<ReligionRegistration />}
      />
      <Route
        path={routes.HEALTHINSURANCEPLANREGISTRATION.path}
        element={<HealthInsurancePlanRegistration />}
      />
      <Route
        path={routes.POSITIONREGISTRATION.path}
        element={<PositionRegistration />}
      />
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
