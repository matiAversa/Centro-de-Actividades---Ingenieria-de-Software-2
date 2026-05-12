import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../styles/login.css";
import "../styles/Register.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type UserDataType = {
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    genero: "HOMBRE" | "MUJER" | ""; // ajustá si tu backend maneja otros valores
    fechaNacimiento: string; // "YYYY-MM-DD"
    correo: string;
    password: string;
    confirmPassword: string;
};

function Register() {
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        RegistrarUsuario;
        navigate("/VerficacionDeCodigo");
    };

    async function RegistrarUsuario() {
        const res = await fetch(`${API_BASE_URL}/User/validacion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(UserDataType),
        });
    }

    const goToLogin = () => {
        navigate("/");
    };

    return (
        <div className="login-container register-page">
            <div className="login-left">
                <img src={logo} alt="CEF" className="login-logo" />
                <h1>Centro de Actividades</h1>
                <p>Sistema de Gestión Integral</p>
            </div>

            <div className="login-right">
                <div className="login-card">
                    <h2>Registrarse</h2>

                    <form onSubmit={handleRegister} className="register-form">
                        <div className="register-grid">
                            <div className="input-group">
                                <label>Nombre</label>
                                <input type="text" placeholder="Tu nombre" required />
                            </div>

                            <div className="input-group">
                                <label>Apellido</label>
                                <input type="text" placeholder="Tu apellido" required />
                            </div>

                            <div className="input-group">
                                <label>DNI</label>
                                <input type="text" placeholder="12345678" required />
                            </div>

                            <div className="input-group">
                                <label>Teléfono</label>
                                <input type="tel" placeholder="11 1234 5678" required />
                            </div>

                            <div className="input-group">
                                <label>Género</label>
                                <select required defaultValue="">
                                    <option value="" disabled>
                                        Seleccionar...
                                    </option>
                                    <option value="HOMBRE">Hombre</option>
                                    <option value="MUJER">Mujer</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Fecha de nacimiento</label>
                                <input type="date" required />
                            </div>

                            <div className="input-group">
                                <label>Email</label>
                                <input type="email" placeholder="ejemplo@email.com" required />
                            </div>

                            <div className="input-group">
                                <label>Contraseña</label>
                                <input type="password" placeholder="********" required />
                            </div>

                            <div className="input-group register-full">
                                <label>Confirmar contraseña</label>
                                <input type="password" placeholder="********" required />
                            </div>
                        </div>

                        <div className="register-actions">
                            <button className="login-btn" type="submit" onClick={handleRegister}>
                                Crear cuenta
                            </button>

                            <button className="login-btn" type="button" onClick={goToLogin}>
                                Ya tengo cuenta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;