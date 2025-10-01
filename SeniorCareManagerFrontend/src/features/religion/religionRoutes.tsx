import { createRoutes } from '@/utils/routesUtils';
import ReligionRegistration from './pages/ReligionRegistration';

export const religionRoutes = createRoutes({
  RELIGION_REGISTRATION: {
    path: '/registrations/religion_registration',
    displayName: 'Cadastro de Religião',
    element: <ReligionRegistration />,
  },
});
