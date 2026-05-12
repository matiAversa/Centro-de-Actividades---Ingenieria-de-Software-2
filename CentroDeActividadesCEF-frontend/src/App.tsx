import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Socios from "./pages/Socios";
import Actividades from "./pages/Actividades";
import Reservas from "./pages/Reservas";
import Pagos from "./pages/Pagos";
import Register from "./pages/Register";
import VerficacionDeCodigo from "./pages/VerificacionDeCorreo";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/socios" element={<Socios />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/VerficacionDeCodigo" element={<VerficacionDeCodigo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;