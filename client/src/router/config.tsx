import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import About from "../pages/about/page";
import Career from "../pages/career/page";
import Contact from "../pages/contact/page";
import AdminLoginPage from "../pages/admin-login/page";
import DashboardPage from "../pages/dashboard/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/career",
    element: <Career />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/admin-login",
    element: <AdminLoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;