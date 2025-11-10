import { createRoutes } from '@/utils/routesUtils';
import ReligionOverview from './pages/UserOverview';

export const religionRoutes = createRoutes({
  RELIGION: {
    path: '/religion',
    displayName: 'Religiões',
    element: <ReligionOverview />,
  },
});
