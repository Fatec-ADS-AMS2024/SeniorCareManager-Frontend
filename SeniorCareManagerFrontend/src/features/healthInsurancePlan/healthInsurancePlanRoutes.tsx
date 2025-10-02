import { createRoutes } from '@/utils/routesUtils';
import HealthInsurancePlanRegistration from './pages/HealthInsurancePlanRegistration';

export const healthInsurancePlanRoutes = createRoutes({
  HEALTH_INSURANCE_PLAN: {
    path: '/health_insurance_plan',
    displayName: 'Plano de Saúde',
    element: null,
  },
  HEALTH_INSURANCE_PLAN_REGISTRATION: {
    path: '/health_insurance_plan/registration',
    displayName: 'Cadastro de Plano de Saúde',
    element: <HealthInsurancePlanRegistration />,
  },
});
