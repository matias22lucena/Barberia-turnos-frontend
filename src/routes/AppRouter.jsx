import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import ReservaPage from "../pages/ReservaPage.jsx";

import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import AdminTurnosPage from "../pages/AdminTurnosPage.jsx";
import AdminServiciosPage from "../pages/AdminServiciosPage.jsx";
import AdminHorariosPage from "../pages/AdminHorariosPage.jsx";
import AdminPromocionesPage from "../pages/AdminPromocionesPage.jsx";
import AdminCarruselPage from "../pages/AdminCarruselPage.jsx";

import AdminRoute from "../components/admin/AdminRoute.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage />
          }
        />

        <Route
          path="/reservar"
          element={
            <ReservaPage />
          }
        />

        <Route
          path="/admin/login"
          element={
            <AdminLoginPage />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/turnos"
          element={
            <AdminRoute>
              <AdminTurnosPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/servicios"
          element={
            <AdminRoute>
              <AdminServiciosPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/horarios"
          element={
            <AdminRoute>
              <AdminHorariosPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/promociones"
          element={
            <AdminRoute>
              <AdminPromocionesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/carrusel"
          element={
            <AdminRoute>
              <AdminCarruselPage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;