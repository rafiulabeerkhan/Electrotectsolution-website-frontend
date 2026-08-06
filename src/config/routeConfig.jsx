import { Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";

export const publicRoutes = [
  {
    path: "/",
    element: () => <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: Login,
  },
];

import Overview from "../pages/dashboard/Overview";
import Products from "../pages/dashboard/Products";
import Users from "../pages/dashboard/Users";
import Clients from "../pages/dashboard/Clients";
import Documents from "../pages/dashboard/Documents";
import CreateDocument from "../pages/dashboard/CreateDocument";

const Empty = () => <div></div>;

export const protectedRoutes = [
  { path: "/dashboard/overview", element: Overview },
  { path: "/dashboard/product", element: Products },
  { path: "/dashboard/users", element: Users },
  { path: "/dashboard/clients", element: Clients },
  { path: "/dashboard/documents/:type", element: Documents },
  { path: "/dashboard/documents/:type/create", element: CreateDocument },
  { path: "/dashboard/documents/:type/edit/:id", element: CreateDocument },
];

export const errorRoutes = [
];