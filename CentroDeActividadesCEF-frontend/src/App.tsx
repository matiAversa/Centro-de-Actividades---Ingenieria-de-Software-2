import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

				<Route path="/login" element={<Login />} />

				<Route path="/Register" element={<Register />} />

				<Route path="/VerficacionDeCodigo" element={<VerficacionDeCodigo />} />

				{/* ADMIN */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute allowedRole="ADMINISTRADOR">
							<Dashboard />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/socios"
					element={
						<ProtectedRoute allowedRole="ADMINISTRADOR">
							<Socios />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/actividades"
					element={
						<ProtectedRoute allowedRole="ADMINISTRADOR">
							<Actividades />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/calendario"
					element={
						<ProtectedRoute allowedRole="ADMINISTRADOR">
							<CalendarioAdmin />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/inscripciones"
					element={
						<ProtectedRoute allowedRole="ADMINISTRADOR">
							<Inscripciones />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/reservas"
					element={
						<ProtectedRoute allowedRole="ADMINISTRADOR">
							<Reservas />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/pagos"
					element={
						<ProtectedRoute allowedRole="ADMINISTRADOR">
							<Pagos />
						</ProtectedRoute>
					}
				/>

				{/* USER */}
				<Route
					path="/home"
					element={
						<ProtectedRoute allowedRole="USUARIO">
							<Home />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/clases"
					element={
						<ProtectedRoute allowedRole="USUARIO">
							<Clases />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/mis-inscripciones"
					element={
						<ProtectedRoute allowedRole="USUARIO">
							<MisInscripciones />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/mis-pagos"
					element={
						<ProtectedRoute allowedRole="USUARIO">
							<MisPagos />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/pagarclase"
					element={
						<ProtectedRoute allowedRole="USUARIO">
							<PagarClase />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/success"
					element={
						<ProtectedRoute allowedRole="USUARIO">
							<Success />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/perfil"
					element={
						<ProtectedRoute allowedRole="ANY">
							<Perfil />
						</ProtectedRoute>
					}
				/>

				{/* FALLBACK */}
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
