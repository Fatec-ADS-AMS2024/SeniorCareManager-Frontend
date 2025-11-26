import { createRoutes } from '@/utils/routesUtils';
import EmployeeOverview from './pages/EmployeeOverview';
import EmployeeForm from './pages/EmployeeForm';

export const employeeRoutes = createRoutes({
  EMPLOYEE: {
    path: '/employee',
    displayName: 'Funcionários',
    element: <EmployeeOverview />,
  },
  EMPLOYEE_REGISTRATION: {
    path: '/employee/registration',
    displayName: 'Cadastrar Funcionário',
    element: <EmployeeForm />,
  },
  EMPLOYEE_EDIT: {
    path: '/employee/edit/:id',
    displayName: 'Editar Funcionário',
    element: <EmployeeForm />,
  },
});
