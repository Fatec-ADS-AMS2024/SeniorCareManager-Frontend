import { createRoutes } from '@/utils/routesUtils';
import PositionRegistration from './pages/PositionRegistration';

export const positionRoutes = createRoutes({
  POSITION: {
    path: '/position',
    displayName: 'Cargo',
    element: null,
  },
  POSITION_REGISTRATION: {
    path: '/position/registration',
    displayName: 'Cadastro de Cargos',
    element: <PositionRegistration />,
  },
});
