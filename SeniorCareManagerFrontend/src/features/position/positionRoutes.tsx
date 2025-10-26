import { createRoutes } from '@/utils/routesUtils';
import PositionOverview from './pages/PositionOverview';

export const positionRoutes = createRoutes({
  POSITION: {
    path: '/position',
    displayName: 'Cargos',
    element: <PositionOverview />,
  },
});
