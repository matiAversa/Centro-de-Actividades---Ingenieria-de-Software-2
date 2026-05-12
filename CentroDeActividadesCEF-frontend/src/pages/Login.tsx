import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  const handleSignin = () => {
    navigate("/register")
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src={logo}
          alt="CEF"
          className="login-logo"
        />

        <h1>Centro de Actividades</h1>
        <p>
          Sistema de Gestión Integral
        </p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="ejemplo@email.com"
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
            />
          </div>

          <button
            className="login-btn"
            onClick={handleLogin}
          >
            Ingresar
          </button>
          <br />
          <br />
          <button
            className="signin-btn"
            onClick={handleSignin}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;