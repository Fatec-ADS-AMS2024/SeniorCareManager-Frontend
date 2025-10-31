import { createRoutes } from '@/utils/routesUtils';
import ResidentOverview from './pages/ResidentOverview';
import ResidentForm from './pages/ResidentForm';

export const residentRoutes = createRoutes({
  RESIDENT: {
    path: '/resident',
    displayName: 'Residentes',
    element: <ResidentOverview />,
  },
   RESIDENT_FORM: {
    path: '/residentForm',
    displayName: 'FormularioResidente',
    element: <ResidentForm />,
  },
});
