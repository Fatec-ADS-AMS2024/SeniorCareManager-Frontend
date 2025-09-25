import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';
import GenericService from './genericService';

export default class HealthInsurancePlanService extends GenericService<HealthInsurancePlan> {
  constructor() {
    super('HealthInsurancePlan');
  }
}
