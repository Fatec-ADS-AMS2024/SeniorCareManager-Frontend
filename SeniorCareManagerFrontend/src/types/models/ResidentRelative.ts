export default interface ResidentRelative {
  id: number;
  residentId: number;
  relationship: string;
  name: string;
  citizenship?: string;
  mobileNumber?: string;
  homePhoneNumber?: string;
  email?: string;
  street?: string;
  number?: string;
  addressComplement?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  issuingBody?: string;
  phoneNumber?: string;
}
