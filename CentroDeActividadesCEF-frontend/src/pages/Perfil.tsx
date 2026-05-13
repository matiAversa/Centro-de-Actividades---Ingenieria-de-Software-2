import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import { useAuth } from "../context/useAuth";
import "../styles/perfil.css";

function Perfil() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const avatarInitial = user?.email?.charAt(0).toUpperCase() ?? "U";
	const roleLabel = user?.role === "ADMIN" ? "Administrador" : "Socio";
	const roleDescription =
		user?.role === "ADMIN"
			? "Acceso completo al panel de gestión"
			: "Acceso a reservas, pagos y consultas personales";

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<UserLayout>
			<div className="dashboard-content perfil-page">
				<div className="perfil-hero">
					<div className="perfil-identity">
						<div className="perfil-avatar">{avatarInitial}</div>

						<div>
							<p className="perfil-kicker">Cuenta activa</p>
							<h2>Mi Perfil</h2>
							<p className="perfil-subtitle">
								Revisá la información de acceso asociada a tu cuenta.
							</p>
						</div>
					</div>

					<span className="perfil-badge">{roleLabel}</span>
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
								<dd>{roleLabel}</dd>
							</div>

							<div>
								<dt>Permisos</dt>
								<dd>{roleDescription}</dd>
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
								onClick={() => navigate("/dashboard")}
							>
								Ir al dashboard
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
