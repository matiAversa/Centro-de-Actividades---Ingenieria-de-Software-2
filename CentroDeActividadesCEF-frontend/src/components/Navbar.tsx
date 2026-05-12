import "../styles/Navbar.css";

function Navbar() {
	return (
		<header className="navbar">
			<div>
				<h1>Centro de Actividades</h1>
				<span>Sistema de Gestión</span>
			</div>

			<div className="user-box">
				<div className="avatar">A</div>

				<div>
					<h4>Administrador</h4>
					<p>Panel de control</p>
					<button
						className="logout-btn"
						onClick={() => (window.location.href = "/")}
					>
						Cerrar sesión
					</button>
				</div>
			</div>
		</header>
	);
}

export default Navbar;
