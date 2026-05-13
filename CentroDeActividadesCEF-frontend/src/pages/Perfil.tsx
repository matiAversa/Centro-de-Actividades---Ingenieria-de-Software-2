import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import { useAuth } from "../context/useAuth";
import "../styles/perfil.css";

function Perfil() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user, navigate]);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	if (user?.role === "ADMIN") {
		return (
			<UserLayout>
				<div className="dashboard-content perfil-page">
					<div className="perfil-hero">
						<div className="perfil-identity">
							<div className="perfil-avatar">
								{user?.email?.charAt(0).toUpperCase() ?? "U"}
							</div>

							<div>
								<p className="perfil-kicker">Administrador</p>
								<h2>Perfil de administrador</h2>
								<p className="perfil-subtitle">
									Herramientas y accesos rápidos de administración.
								</p>
							</div>
						</div>

						<span className="perfil-badge">Administrador</span>
					</div>

					<div className="perfil-grid">
						<section className="perfil-card perfil-card-primary">
							<h3>Datos de administrador</h3>

							<dl className="perfil-details">
								<div>
									<dt>Correo</dt>
									<dd>{user?.email ?? "No disponible"}</dd>
								</div>

								<div>
									<dt>Rol</dt>
									<dd>Administrador</dd>
								</div>
							</dl>
						</section>

						<section className="perfil-card">
							<h3>Acciones rápidas</h3>

							<div className="perfil-actions">
								<button
									type="button"
									className="perfil-action-button perfil-action-button-secondary"
									onClick={() => navigate("/dashboard")}
								>
									Ir al panel
								</button>

								<button
									type="button"
									className="perfil-action-button"
									onClick={() => navigate("/socios")}
								>
									Gestionar socios
								</button>

								<button
									type="button"
									className="perfil-action-button"
									onClick={handleLogout}
								>
									Cerrar sesión
								</button>
							</div>
						</section>
					</div>
				</div>
			</UserLayout>
		);
	}

	return (
		<UserLayout>
			<div className="dashboard-content perfil-page">
				<div className="perfil-hero">
					<div className="perfil-identity">
						<div className="perfil-avatar">
							{user?.email?.charAt(0).toUpperCase() ?? "U"}
						</div>

						<div>
							<p className="perfil-kicker">Cuenta activa</p>
							<h2>Mi Perfil</h2>
							<p className="perfil-subtitle">
								Revisá la información de acceso asociada a tu cuenta.
							</p>
						</div>
					</div>

					<span className="perfil-badge">
						{(user as any)?.role === "ADMIN" ? "Administrador" : "Socio"}
					</span>
				</div>

				<div className="perfil-grid">
					<section className="perfil-card perfil-card-primary">
						<h3>Datos de acceso</h3>

						<dl className="perfil-details">
							<div>
								<dt>Correo electrónico</dt>
								<dd>{user?.email ?? "No disponible"}</dd>
							</div>

							<div>
								<dt>Rol</dt>
								<dd>
									{(user as any)?.role === "ADMIN" ? "Administrador" : "Socio"}
								</dd>
							</div>

							<div>
								<dt>Permisos</dt>
								<dd>
									{(user as any)?.role === "ADMIN"
										? "Acceso completo al panel de gestión"
										: "Acceso a reservas, pagos y consultas personales"}
								</dd>
							</div>
						</dl>
					</section>

					<section className="perfil-card">
						<h3>Atajos</h3>

						<p className="perfil-helper-text">
							Usá estos accesos rápidos para seguir navegando sin volver al
							menú.
						</p>

						<div className="perfil-actions">
							<button
								type="button"
								className="perfil-action-button perfil-action-button-secondary"
								onClick={() => navigate("/home")}
							>
								Ir al inicio
							</button>

							<button
								type="button"
								className="perfil-action-button"
								onClick={handleLogout}
							>
								Cerrar sesión
							</button>
						</div>
					</section>
				</div>
			</div>
		</UserLayout>
	);
}

export default Perfil;
