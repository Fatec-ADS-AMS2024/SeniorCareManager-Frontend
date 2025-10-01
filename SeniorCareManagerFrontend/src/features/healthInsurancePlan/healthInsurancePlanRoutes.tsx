import { createRoutes } from '@/utils/routesUtils';
import HealthInsurancePlanRegistration from './pages/HealthInsurancePlanRegistration';

export const healthInsurancePlanRoutes = createRoutes({
  HEALTH_INSURANCE_PLAN_REGISTRATION: {
    path: '/registrations/health_insurance_plan_registration',
    displayName: 'Cadastro de Plano de Saúde',
    element: <HealthInsurancePlanRegistration />,
  },
});
