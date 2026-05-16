import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Navbar.css";

const isAdminLikeRole = (role?: string) =>
	role === "ADMIN" || role === "RECEPCIONISTA";

function Navbar() {
	const navigate = useNavigate();

	const { user, logout } = useAuth();

	const avatarInitial = user?.email?.charAt(0).toUpperCase() ?? "U";

	const handleLogout = () => {
		logout();

		navigate("/login");
	};

	const handleGoToProfile = () => {
		navigate("/perfil");
	};

	const roleLabel =
		user?.role === "ADMIN"
			? "Admin"
			: user?.role === "RECEPCIONISTA"
				? "Recep."
				: "Socio";

	const userTitle = isAdminLikeRole(user?.role)
		? user?.role === "RECEPCIONISTA"
			? "Recepcionista"
			: "Administrador"
		: user?.email;

	const userSubtitle = isAdminLikeRole(user?.role)
		? "Panel de control"
		: "Portal socio";

	return (
		<header className="navbar">
			<div className="navbar-brand">
				<p className="navbar-kicker">Portal de gestión</p>

				<div>
					<h1>Centro de Actividades</h1>

					<p>Sistema de gestión deportiva</p>
				</div>
			</div>

			<div className="navbar-right">
				<div className="user-avatar">{avatarInitial}</div>

				<div className="user-info">
					<h3>{userTitle}</h3>

					<p>{userSubtitle}</p>
				</div>

				<div className="navbar-actions">
					<span className="user-role-pill">{roleLabel}</span>

					<button
						className="profile-btn"
						type="button"
						onClick={handleGoToProfile}
					>
						<span className="profile-btn-label">Mi perfil</span>
					</button>

					<button className="logout-btn" type="button" onClick={handleLogout}>
						Cerrar sesión
					</button>
				</div>
			</div>
		</header>
	);
}

export default Navbar;
