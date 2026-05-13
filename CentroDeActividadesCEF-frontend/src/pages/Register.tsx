import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../styles/login.css";
import "../styles/Register.css";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type RegisterForm = {
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    genero: "HOMBRE" | "MUJER" | ""; // ajustá si tu backend maneja otros valores
    fechaNacimiento: string; // "YYYY-MM-DD"
    correo: string;
    contrasena: string;
    confirmPassword: string;
};

type ValidacionResponse = {
    correo: string;
    codigo: string;
};

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterForm>({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        genero: "",
        fechaNacimiento: "",
        correo: "",
        contrasena: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const goToLogin = () => {
        navigate("/");
    };


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // validación front mínima
        if (form.contrasena !== form.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        const userData = {
            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            dni: form.dni.trim(),
            telefono: form.telefono.trim(),
            genero: form.genero,
            fechaNacimiento: form.fechaNacimiento, // viene del input date
            correo: form.correo.trim().toLowerCase(),
            contrasena: form.contrasena,
        };
        console.log(userData)

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/User/EnvioDeCodigo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            const text = await res.text();
            console.log(text);
            if (res.ok) {
                try {
                    localStorage.setItem("mailActual", text);
                    navigate("/VerficacionDeCodigo")
                    return { ok: true };
                } catch {
                    return { ok: true, data: { correo: userData.correo, codigo: "" } };
                }
            }

            return { ok: false, status: res.status, message: text || "Error" };
        } finally {
            setLoading(false);
        }
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
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    required
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Apellido</label>
                                <input
                                    type="text"
                                    placeholder="Tu apellido"
                                    required
                                    value={form.apellido}
                                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>DNI</label>
                                <input
                                    type="text"
                                    placeholder="12345678"
                                    required
                                    value={form.dni}
                                    onChange={(e) => setForm({ ...form, dni: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Teléfono</label>
                                <input
                                    type="tel"
                                    placeholder="11 1234 5678"
                                    required
                                    value={form.telefono}
                                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Género</label>
                                <select
                                    required
                                    value={form.genero}
                                    onChange={(e) =>
                                        setForm({ ...form, genero: e.target.value as RegisterForm["genero"] })
                                    }
                                >
                                    <option value="" disabled>
                                        Seleccionar...
                                    </option>
                                    <option value="1">Hombre</option>
                                    <option value="2">Mujer</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Fecha de nacimiento</label>
                                <input
                                    type="date"
                                    required
                                    value={form.fechaNacimiento}
                                    onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="ejemplo@email.com"
                                    required
                                    value={form.correo}
                                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    required
                                    value={form.contrasena}
                                    onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                                />
                            </div>

                            <div className="input-group register-full">
                                <label>Confirmar contraseña</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    required
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <p style={{ color: "#D01F25", marginBottom: "12px" }}>{error}</p>
                        )}

                        <div className="register-actions">
                            <button className="login-btn" type="submit" disabled={loading}>
                                {loading ? "Creando..." : "Crear cuenta"}
                            </button>

                            <button className="login-btn" type="button" onClick={goToLogin} disabled={loading}>
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