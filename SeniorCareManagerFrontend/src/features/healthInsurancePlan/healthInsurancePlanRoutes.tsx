import { createRoutes } from '@/utils/routesUtils';
import HealthInsurancePlanOverview from './pages/HealthInsurancePlanOverview';

export const healthInsurancePlanRoutes = createRoutes({
  HEALTH_INSURANCE_PLAN: {
    path: '/health_insurance_plan',
    displayName: 'Planos de Saúde',
    element: <HealthInsurancePlanOverview />,
  },
});
