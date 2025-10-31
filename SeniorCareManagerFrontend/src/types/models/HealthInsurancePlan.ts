import { HealthPlanType } from '../enums/HealthPlanType';

export default interface HealthInsurancePlan {
  id: number;
  name: string;
  type: HealthPlanType;
  abbreviation: string;
}
