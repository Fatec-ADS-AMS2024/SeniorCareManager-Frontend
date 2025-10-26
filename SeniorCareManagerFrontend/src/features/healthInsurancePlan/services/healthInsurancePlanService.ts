import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<HealthInsurancePlan>(
  'HealthInsurancePlan'
);

const HealthInsurancePlanService = {
  ...genericMethods,
};

export default HealthInsurancePlanService;
