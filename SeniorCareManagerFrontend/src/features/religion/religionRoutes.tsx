import { createRoutes } from '@/utils/routesUtils';
import ReligionOverview from './pages/ReligionOverview';

export const religionRoutes = createRoutes({
  RELIGION: {
    path: '/religion',
    displayName: 'Religiões',
    element: <ReligionOverview />,
  },
});
