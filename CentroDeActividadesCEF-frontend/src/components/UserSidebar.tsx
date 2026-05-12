import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../styles/Sidebar.css";

function UserSidebar() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "active"
      : "";

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img
          src={logo}
          alt="CEF"
          className="logo-image"
        />
      </div>

      <nav className="menu">
        <Link
          className={isActive(
            "/home"
          )}
          to="/home"
        >
          Inicio
        </Link>

        <Link
          className={isActive(
            "/clases"
          )}
          to="/clases"
        >
          Actividades
        </Link>

        <Link
          className={isActive(
            "/mis-reservas"
          )}
          to="/mis-reservas"
        >
          Mis Reservas
        </Link>

        <Link
          className={isActive(
            "/mis-pagos"
          )}
          to="/mis-pagos"
        >
          Mis Pagos
        </Link>

        <Link
          className={isActive(
            "/perfil"
          )}
          to="/perfil"
        >
          Mi Perfil
        </Link>
      </nav>
    </aside>
  );
}

export default UserSidebar;