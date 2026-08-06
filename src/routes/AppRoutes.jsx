import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import Layout from "../layout/Main";
import {
  publicRoutes,
  protectedRoutes,
  errorRoutes,
} from "../config/routeConfig";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authUser } = useAuthStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  const { isLoggedIn, authUser } = useAuthStore();

  return (
    <Router>
      <Routes>
        {publicRoutes.map(({ path, element: Element }) => (
          <Route
            key={path}
            path={path}
            element={
              isLoggedIn && (path === "/" || path === "/login" || path === "/register") ? (
                <Navigate to={`/dashboard/overview`} replace />
              ) : (
                <Element />
              )
            }
          />
        ))}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {protectedRoutes.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>

        {errorRoutes.map(({ path, element: Element }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRoutes;