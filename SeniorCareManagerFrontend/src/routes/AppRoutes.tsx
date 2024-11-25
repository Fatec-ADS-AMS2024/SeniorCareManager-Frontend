import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { routes } from "./routes";
import Layout from "../components/Layout";
import AcessibilityPage from "../pages/AcessibilityPage";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import GeneralAdministrator from "../pages/GeneralAdministrator";
import Registrations from "../pages/Registrations";
import ReligionRegistration from "../pages/Registrations/ReligionRegistration";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<Layout />} errorElement={<GlobalErrorBoundary />}>
      <Route path={routes.ACCESSIBILITY} element={<AcessibilityPage />} />

      <Route path={routes.LANDING} element={<LandingPage />} />
      <Route path={routes.LOGIN} element={<LoginPage />} />
      <Route path={routes.GENERALADM} element={<GeneralAdministrator />} />
      <Route path={routes.REGISTRATIONS} element={<Registrations />} />
      <Route path={routes.RELIGIONREGISTRATION} element={<ReligionRegistration />} />

    </Route>
  )
);

/**
 * Componente exibido ao dar erro nas rotas
 */
function GlobalErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <main className="min-h-screen w-screen p-4">
      <h1 className="text-2xl text-danger">
        Erro ao tentar acessar a página!
      </h1>
    </main>
  );
}

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
