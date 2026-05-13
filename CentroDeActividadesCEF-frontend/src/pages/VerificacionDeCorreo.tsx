import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../styles/login.css";

function VerficacionDeCodigo() {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleVerify = () => {
        const normalized = code.trim();

        if (normalized.length !== 6) {
            setError("El código debe tener 6 caracteres");
            return;
        }

        // TODO: acá llamarías a tu backend para verificar el código
        // ejemplo: await api.verifyEmail({ code: normalized })

        setError("");
        navigate("/home"); // o a donde corresponda después de verificar
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
                                // Permite solo letras/números y lo deja en mayúsculas
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

                    <button className="login-btn" onClick={handleVerify}>
                        Verificar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerficacionDeCodigo;