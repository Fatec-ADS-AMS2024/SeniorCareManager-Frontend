import { createRoutes } from '@/utils/routesUtils';
import ResidentOverview from './pages/ResidentOverview';
import ResidentForm from './pages/ResidentForm';

export const residentRoutes = createRoutes({
  RESIDENT: {
    path: '/resident',
    displayName: 'Residentes',
    element: <ResidentOverview />,
  },
  RESIDENT_REGISTRATION: {
    path: '/resident/registration',
    displayName: 'Cadastro Residente',
    element: <ResidentForm />,
  },
  RESIDENT_EDIT: {
    path: '/resident/edit/:id',
    displayName: 'Editar Residente',
    element: <ResidentForm />,
  },
});
