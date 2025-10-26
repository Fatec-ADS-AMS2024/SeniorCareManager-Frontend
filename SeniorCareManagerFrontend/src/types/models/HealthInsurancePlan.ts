import { HealthInsurancePlanType } from '../enums/HealthInsurancePlanType';

export default interface HealthInsurancePlan {
  id: number;
  name: string;
  type: HealthInsurancePlanType;
  abbreviation: string;
}
