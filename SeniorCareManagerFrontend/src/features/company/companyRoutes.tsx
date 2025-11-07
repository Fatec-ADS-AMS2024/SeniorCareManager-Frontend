import { createRoutes } from '@/utils/routesUtils';
import HealthInsurancePlanOverview from './pages/CompanyOverview';

export const companyRoutes = createRoutes({
  COMPANY: {
    path: '/company',
    displayName: 'Empresas',
    element: <HealthInsurancePlanOverview />,
  },
});
