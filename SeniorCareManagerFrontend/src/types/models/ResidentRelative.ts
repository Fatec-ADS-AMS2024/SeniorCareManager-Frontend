import { Relationship } from '../enums/Relationship';

export default interface ResidentRelative {
  id: number;
  residentId: number;
  relationship: Relationship;
  name: string;
  cpf: string;
  rg: string;
  issuingState: string;
  citizenship: string;
  mobileNumber: string;
  homePhoneNumber?: string;
  email?: string;
  street: string;
  number: string;
  district: string;
  addressComplement?: string;
  city: string;
  state: string;
  postalCode: string;
  issuingBody?: string;
}

