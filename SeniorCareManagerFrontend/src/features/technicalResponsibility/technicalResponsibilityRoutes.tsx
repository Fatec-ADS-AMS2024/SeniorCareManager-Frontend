import { createRoutes } from '@/utils/routesUtils';
import TechnicalResponsibilityOverview from './pages/TechnicalResponsibilityOverview';
import TechnicalResponsibilityForm from './pages/TechnicalResponsibilityForm';

export const technicalResponsibilityRoutes = createRoutes({
  TECHNICAL_RESPONSIBILITY: {
    path: '/technical_responsibility',
    displayName: 'Responsáveis técnicos',
    element: <TechnicalResponsibilityOverview />,
  },
  TECHNICAL_RESPONSIBILITY_REGISTRATION: {
    path: '/technical_responsibility/registration',
    displayName: 'Cadastrar Funcionário',
    element: <TechnicalResponsibilityForm />,
  },
  TECHNICAL_RESPONSIBILITY_EDIT: {
    path: '/technical_responsibility/edit/:id',
    displayName: 'Editar Funcionário',
    element: <TechnicalResponsibilityForm />,
  },
});
