import { authRoutes } from '@/features/auth';
import { healthInsurancePlanRoutes } from '@/features/healthInsurancePlan';
import { positionRoutes } from '@/features/position';
import { religionRoutes } from '@/features/religion';
import { employeeRoutes } from '@/features/employee';
import AccessibilityPage from '@/pages/AccessibilityPage';
import AdminOverview from '@/pages/Admin/AdminOverview';
import LandingPage from '@/pages/LandingPage';
import Registrations from '@/pages/Registrations';
import { createRoutes } from '@/utils/routesUtils';

const appRoutes = createRoutes({
  ACCESSIBILITY: {
    path: '/accessibility',
    displayName: 'Acessibilidade',
    element: <AccessibilityPage />,
  },
  LANDING: {
    displayName: 'Página Inicial',
    element: <LandingPage />,
    index: true,
    path: '',
  },
  ADMIN_OVERVIEW: {
    path: '/admin',
    displayName: 'Visão Geral',
    element: <AdminOverview />,
  },
  REGISTRATIONS: {
    path: '/registrations',
    displayName: 'Cadastros',
    element: <Registrations />,
  },
});

// É a união de todas as definições de rotas da aplicação
export const routes = {
  ...appRoutes,
  ...authRoutes,
  ...healthInsurancePlanRoutes,
  ...positionRoutes,
  ...religionRoutes,
  ...employeeRoutes,
} as const;
