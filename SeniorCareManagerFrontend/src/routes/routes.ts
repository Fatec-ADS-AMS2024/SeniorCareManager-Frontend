import { createRoutes } from "@/utils/routesUtils";

const appRoutes = createRoutes({
  ACCESSIBILITY: {
    path: '/accessibility',
    displayName: 'Acessibilidade',
    element: null,
  },
  LANDING: {
    path: '/',
    displayName: 'Página Inicial',
    element: null,
    index: true,
  },
  LOGIN: {
    path: '/login',
    displayName: 'Login',
    element: null,
  },
  GENERALADM: {
    path: '/generalAdministrator',
    displayName: 'Visão Geral',
    element: null,
  },
  REGISTRATIONS: {
    path: '/registrations',
    displayName: 'Cadastros',
    element: null,
  },
  RELIGIONREGISTRATION: {
    path: '/registrations/religionregistration',
    displayName: 'Cadastro de Religião',
    element: null,
  },
  HEALTHINSURANCEPLANREGISTRATION: {
    path: '/registrations/healthinsuranceplanregistration',
    displayName: 'Cadastro de Plano de Saúde',
    element: null,
  },
  POSITIONREGISTRATION: {
    path: '/registrations/positionregistration',
    displayName: 'Cadastro de Cargos',
    element: null,
  },
});

export const routes = {
  ...appRoutes,
} as const;
