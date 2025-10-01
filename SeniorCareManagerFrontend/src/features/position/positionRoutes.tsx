import { createRoutes } from '@/utils/routesUtils';
import PositionRegistration from './pages/PositionRegistration';

export const positionRoutes = createRoutes({
  POSITION_REGISTRATION: {
    path: '/registrations/position_registration',
    displayName: 'Cadastro de Cargos',
    element: <PositionRegistration />,
  },
});
