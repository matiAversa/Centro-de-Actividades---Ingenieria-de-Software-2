import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Socios from "./pages/Socios";
import Actividades from "./pages/Actividades";
import CalendarioAdmin from "./pages/CalendarioAdmin";
import Inscripciones from "./pages/Inscripciones";
import Reservas from "./pages/Reservas";
import Pagos from "./pages/Pagos";
import Register from "./pages/Register";
import VerficacionDeCodigo from "./pages/VerificacionDeCorreo";

/* USER */
import Home from "./pages/Home";
import Clases from "./pages/Clases";
import MisInscripciones from "./pages/MisInscripciones";
import MisPagos from "./pages/MisPagos";
import PagarClase from "./pages/PagarClase";
import Success from "./pages/Success.tsx";
import Perfil from "./pages/Perfil";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/Register"
          element={<Register />}
        />

        <Route
          path="/VerficacionDeCodigo"
          element={<VerficacionDeCodigo />}
        />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/socios"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Socios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/actividades"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Actividades />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendario"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <CalendarioAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inscripciones"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Inscripciones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservas"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Reservas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagos"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Pagos />
            </ProtectedRoute>
          }
        />

        {/* USER */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="SOCIO">
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clases"
          element={
            <ProtectedRoute allowedRole="SOCIO">
              <Clases />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-inscripciones"
          element={
            <ProtectedRoute allowedRole="SOCIO">
              <MisInscripciones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-pagos"
          element={
            <ProtectedRoute allowedRole="SOCIO">
              <MisPagos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagarclase"
          element={
            <ProtectedRoute allowedRole="SOCIO">
              <PagarClase />
            </ProtectedRoute>
          }
        />

        <Route
          path="/success"
          element={
            <ProtectedRoute allowedRole="SOCIO">
              <Success />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute allowedRole="SOCIO">
              <Perfil />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;