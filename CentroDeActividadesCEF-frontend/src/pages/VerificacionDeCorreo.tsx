import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../styles/login.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const RESEND_COOLDOWN_SECONDS = 10;

function VerficacionDeCodigo() {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // cooldown + contador
    const [resendDisabled, setResendDisabled] = useState(true);
    const [resendSecondsLeft, setResendSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
    const resendIntervalRef = useRef<number | null>(null);

    const clearResendInterval = () => {
        if (resendIntervalRef.current) {
            window.clearInterval(resendIntervalRef.current);
            resendIntervalRef.current = null;
        }
    };

    const startResendCooldown = () => {
        clearResendInterval();

        setResendDisabled(true);
        setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);

        resendIntervalRef.current = window.setInterval(() => {
            setResendSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearResendInterval();
                    setResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        // al cargar la pantalla: 10s deshabilitado
        startResendCooldown();
        return () => clearResendInterval();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                body: JSON.stringify({ correo, codigo: normalized }),
            });

            if (res.ok) {
                navigate("/Dashboard");
                return;
            }

            const text = await res.text();
            setError(text || "Error al verificar el código");
        } catch {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setError("");

        const correo = localStorage.getItem("mailActual");
        if (!correo) {
            setError("No se encontró el email. Volvé a registrarte.");
            return;
        }
        console.log("aaeokfeof")
        console.log(correo)
        startResendCooldown();

        try {
            const res = await fetch(`${API_BASE_URL}/User/ReenviarCodigo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo }),
            });
            const text = await res.text();
            if (!res.ok) setError(text || "No se pudo reenviar el código");
        } catch {
            setError("Error de conexión con el servidor");
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

                    {error && <p style={{ color: "#D01F25", marginBottom: "12px" }}>{error}</p>}

                    <button className="login-btn" onClick={handleVerify} disabled={loading}>
                        {loading ? "Verificando..." : "Verificar"}
                    </button>

                    <button
                        className="login-btn"
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendDisabled}
                        style={
                            resendDisabled
                                ? { backgroundColor: "#9CA3AF", cursor: "not-allowed", marginTop: 10 }
                                : { marginTop: 10 }
                        }
                    >
                        {resendDisabled
                            ? `Reenviar código (${resendSecondsLeft}s)`
                            : "Reenviar código"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerficacionDeCodigo;