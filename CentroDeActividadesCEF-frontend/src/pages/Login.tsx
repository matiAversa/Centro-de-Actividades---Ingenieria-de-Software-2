import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import { useAuth } from "../context/useAuth";
import "../styles/login.css";

function Login() {
	const navigate = useNavigate();

	const { login } = useAuth();

	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");

	const [error, setError] = useState("");

	const handleLogin = async () => {
		const user = await login(email, password);

		if (!user) {
			setError("Credenciales incorrectas");
			return;
		}

		if (user.role === "ADMIN" || user.role === "RECEPCIONISTA") {
			navigate("/dashboard");
			return;
		}

		navigate("/home");
	};

	const handleSignin = () => {
		navigate("/register");
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
					<h2>Iniciar Sesión</h2>

					<div className="input-group">
						<label>Email</label>

						<input
							type="email"
							placeholder="ejemplo@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="input-group">
						<label>Contraseña</label>

						<input
							type="password"
							placeholder="********"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					{error && (
						<p
							style={{
								color: "#D01F25",
								marginBottom: "12px",
							}}
						>
							{error}
						</p>
					)}

					<button className="login-btn" onClick={handleLogin}>
						Ingresar
					</button>
					<br />
					<br />
					<button className="signin-btn" onClick={handleSignin}>
						Registrarse
					</button>
				</div>
			</div>
		</div>
	);
}

export default Login;
