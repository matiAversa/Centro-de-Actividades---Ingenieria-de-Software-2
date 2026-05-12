import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Navbar.css";

function Navbar() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout =
    () => {
      logout();

      navigate(
        "/login"
      );
    };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1>
          Centro de
          Actividades
        </h1>

        <p>
          Sistema de
          Gestión
        </p>
      </div>

      <div className="navbar-right">
        <div className="user-avatar">
          {user?.email
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div className="user-info">
          <h3>
            {user?.role ===
            "ADMIN"
              ? "Administrador"
              : user?.email}
          </h3>

          <p>
            {user?.role ===
            "ADMIN"
              ? "Panel de control"
              : "Portal socio"}
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={
            handleLogout
          }
        >
          Salir
        </button>
      </div>
    </header>
  );
}

export default Navbar;