import { LoginPage } from "@/features/auth";
import { HealthInsurancePlanRegistration } from "@/features/healthInsurancePlan";
import { PositionRegistration } from "@/features/position";
import { ReligionRegistration } from "@/features/religion";
import AccessibilityPage from "@/pages/AccessibilityPage";
import GeneralAdministrator from "@/pages/GeneralAdministrator";
import LandingPage from "@/pages/LandingPage";
import RegisterPage from "@/pages/Registrations";
import { createRoutes } from "@/utils/routesUtils";

const appRoutes = createRoutes({
  ACCESSIBILITY: {
    path: '/accessibility',
    displayName: 'Acessibilidade',
    element: <AccessibilityPage />,
  },
  LANDING: {
    displayName: 'Página Inicial',
    element: <LandingPage />,
    index: true,
  },
  LOGIN: {
    path: '/login',
    displayName: 'Login',
    element: <LoginPage />,
  },
  GENERALADM: {
    path: '/generalAdministrator',
    displayName: 'Visão Geral',
    element: <GeneralAdministrator />,
  },
  REGISTRATIONS: {
    path: '/registrations',
    displayName: 'Cadastros',
    element: <RegisterPage />,
  },
  RELIGIONREGISTRATION: {
    path: '/registrations/religionregistration',
    displayName: 'Cadastro de Religião',
    element: <ReligionRegistration />,
  },
  HEALTHINSURANCEPLANREGISTRATION: {
    path: '/registrations/healthinsuranceplanregistration',
    displayName: 'Cadastro de Plano de Saúde',
    element: <HealthInsurancePlanRegistration />,
  },
  POSITIONREGISTRATION: {
    path: '/registrations/positionregistration',
    displayName: 'Cadastro de Cargos',
    element: <PositionRegistration />,
  },
});

// É a união de todas as definições de rotas da aplicação
export const routes = {
  ...appRoutes,
} as const;
