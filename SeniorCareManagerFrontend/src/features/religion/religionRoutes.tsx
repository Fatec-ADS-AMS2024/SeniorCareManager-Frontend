import { createRoutes } from '@/utils/routesUtils';
import ReligionRegistration from './pages/ReligionRegistration';

export const religionRoutes = createRoutes({
  RELIGION_REGISTRATION: {
    path: '/religion/registration',
    displayName: 'Cadastro de Religião',
    element: <ReligionRegistration />,
  },
});
