import { createRoutes } from '@/utils/routesUtils';
import ResidentOverview from './pages/ResidentOverview';

export const residentRoutes = createRoutes({
  RESIDENT: {
    path: '/resident',
    displayName: 'Residentes',
    element: <ResidentOverview />,
  },
});
