import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../styles/Sidebar.css";

function Sidebar() {
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
          alt="CEF Logo"
          className="logo-image"
        />
      </div>

      <nav className="menu">
        <Link
          className={isActive(
            "/dashboard"
          )}
          to="/dashboard"
        >
          Dashboard
        </Link>

        <Link
          className={isActive(
            "/socios"
          )}
          to="/socios"
        >
          Socios
        </Link>

        <Link
          className={isActive(
            "/actividades"
          )}
          to="/actividades"
        >
          Actividades
        </Link>

        <Link
          className={isActive(
            "/calendario"
          )}
          to="/calendario"
        >
          Calendario
        </Link>

        <Link
          className={isActive(
            "/inscripciones"
          )}
          to="/inscripciones"
        >
          Inscripciones
        </Link>

        <Link
          className={isActive(
            "/reservas"
          )}
          to="/reservas"
        >
          Reservas
        </Link>

        <Link
          className={isActive(
            "/pagos"
          )}
          to="/pagos"
        >
          Pagos
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;