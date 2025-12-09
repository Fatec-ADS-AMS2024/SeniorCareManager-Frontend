import { createRoutes } from '@/utils/routesUtils';
import AllergyOverview from './pages/AllergyOverview';

export const allergyRoutes = createRoutes({
  ALLERGY: {
    path: '/allergy',
    displayName: 'Alergias',
    element: <AllergyOverview />,
  },
});
