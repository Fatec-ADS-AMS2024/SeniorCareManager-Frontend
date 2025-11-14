import { StatusEmployee } from '../enums/StatusEmployee';

export default interface Employee {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  hireDate: string;
  state: string;
  city: string;
  street: string;
  cep: string;
  number: string;
  neighborhood: string;
  statusEmployee: StatusEmployee;
  positionId: number;
}