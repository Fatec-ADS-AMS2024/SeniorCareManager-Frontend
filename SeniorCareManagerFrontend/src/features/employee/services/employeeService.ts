import Employee from '@/types/models/Employee';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<Employee>('Employee');

const EmployeeService = {
  ...genericMethods,
}

export default EmployeeService;
