import { createRoutes } from '@/utils/routesUtils';
import CompanyOverview from './pages/CompanyOverview';

export const companyRoutes = createRoutes({
  COMPANY: {
    path: '/company',
    displayName: 'Empresas',
    element: <CompanyOverview />,
  },
});
