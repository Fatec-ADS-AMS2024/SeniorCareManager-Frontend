import { MaritalStatus } from '../enums/MaritalStatus';
import { Ethnicity } from '../enums/Ethnicity';
import { Sex } from '../enums/Sex'; 

export default interface Resident {
  id: number;
  registeredName: string;
  socialName: string;
  dateOfBirth: Date;
  age: string;
  cpf: string;
  rg: string;
  issuingBody: string;
  issuingState: string;
  pisPasep: string;
  sex: Sex;
  maritalStatus: MaritalStatus;
  ethnicity: Ethnicity;
  fatherName: string;
  motherName: string;
  spouseName: string;
  nationalHealthCardNumber: string;
  privateHealthCardNumber: string;
  mobileNumber: string;
  homePhoneNumber: string;
  height: number;
  weight: number;
}
