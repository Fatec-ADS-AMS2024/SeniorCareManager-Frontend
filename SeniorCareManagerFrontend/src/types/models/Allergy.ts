import { AllergyType } from '../enums/AllergyType';

export default interface Allergy {
  id: number;
  name: string;
  type: AllergyType;
}
