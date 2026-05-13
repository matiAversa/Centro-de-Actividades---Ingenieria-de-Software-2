import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../styles/login.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

function VerficacionDeCodigo() {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setError("");

        const normalized = code.trim().toUpperCase();
        if (normalized.length !== 6) {
            setError("El código debe tener 6 caracteres");
            return;
        }

        const correo = localStorage.getItem("mailActual");
        if (!correo) {
            setError("No se encontró el email. Volvé a registrarte.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/User/ValidarCodigo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correo,          // <- debe coincidir con MailConCodigo
                    codigo: normalized,
                }),
            });

            if (res.ok) {
                // mailActual queda en localStorage como pediste
                navigate("/Dashboard");
                return;
            }

            // 400 o 500: el backend manda un string con el error
            const text = await res.text();
            setError(text || "Error al verificar el código");
        } catch {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src={logo} alt="CEF" className="login-logo" />
                <h1>Centro de Actividades</h1>
                <p>Sistema de Gestión Integral</p>
            </div>

            <div className="login-right">
                <div className="login-card">
                    <h2>Verificar correo</h2>

                    <div className="input-group">
                        <label>Código de verificación</label>
                        <input
                            type="text"
                            inputMode="text"
                            placeholder="ABC123"
                            value={code}
                            maxLength={6}
                            onChange={(e) => {
                                const v = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                                setCode(v);
                            }}
                            style={{
                                textAlign: "center",
                                letterSpacing: "0.35em",
                                fontWeight: 700,
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: "#D01F25", marginBottom: "12px" }}>{error}</p>
                    )}

                    <button className="login-btn" onClick={handleVerify} disabled={loading}>
                        {loading ? "Verificando..." : "Verificar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerficacionDeCodigo;