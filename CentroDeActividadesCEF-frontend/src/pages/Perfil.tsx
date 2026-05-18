import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import EditPerfilModal from "../components/EditPerfilModal";
import { useAuth } from "../context/useAuth";
import "../styles/perfil.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface Usuario {
	id: number;
	nombre: string;
	apellido: string;
	dni: string;
	fechaNacimiento: string;
	genero: string;
	telefono: string;
	correo: string;
	rol: string;
}

const isAdminLikeRole = (role?: string) =>
	role === "ADMINISTRADOR" || role === "RECEPCIONISTA" || role === "ADMIN";

const getRoleLabel = (role?: string) => {
	switch (role) {
		case "ADMINISTRADOR":
		case "ADMIN":
			return "Administrador";
		case "RECEPCIONISTA":
			return "Recepcionista";
		default:
			return "Usuario";
	}
};

function Perfil() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const [usuario, setUsuario] = useState<Usuario | null>(null);
	const [loading, setLoading] = useState(true);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const usuarioId = user?.usuarioId;

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		if (!usuarioId) {
			setLoading(false);
			return;
		}

		const obtenerPerfil = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/User/${usuarioId}`);

				if (!response.ok) {
					throw new Error("No se pudo obtener el perfil");
				}

				const data: Usuario = await response.json();
				setUsuario(data);
			} catch (error) {
				console.error(error);
				setUsuario(null);
			} finally {
				setLoading(false);
			}
		};

		void obtenerPerfil();
	}, [user, usuarioId, navigate]);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const guardarPerfil = async (formData: any) => {
		if (!usuarioId) return;
		try {
			const payload = {
				id: usuario?.id,
				nombre: formData.nombre,
				apellido: formData.apellido,
				dni: formData.dni,
				fechaNacimiento: formData.fechaNacimiento,
				genero: formData.genero,
				telefono: formData.telefono,
				correo: formData.correo,
				rol: usuario?.rol,
			};

			const resp = await fetch(`${API_BASE_URL}/User/${usuarioId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!resp.ok) {
				const text = await resp.text();
				throw new Error(text || "Error al guardar perfil");
			}

			const updated: Usuario = await resp.json();
			setUsuario(updated);
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error guardando perfil:", error);
			alert(
				"No se pudo guardar el perfil. Revisá los datos e intentá nuevamente.",
			);
		}
	};

	const roleLabel = getRoleLabel(user?.role);
	const isAdminLike = isAdminLikeRole(user?.role);
	const nombreCompleto =
		[usuario?.nombre, usuario?.apellido].filter(Boolean).join(" ") ||
		user?.email ||
		"Usuario";

	if (!user) {
		return null;
	}

	return (
		<UserLayout>
			<div className="dashboard-content perfil-page">
				<div className="perfil-hero">
					<div className="perfil-identity">
						<div className="perfil-avatar">
							{nombreCompleto.charAt(0).toUpperCase()}
						</div>

						<div>
							<p className="perfil-kicker">
								{isAdminLike ? roleLabel : "Cuenta activa"}
							</p>
							<h2 className="mi-perfil-blanco">
								{isAdminLike
									? `Perfil de ${roleLabel.toLowerCase()}`
									: "Mi perfil"}
							</h2>
							<p className="perfil-subtitle">
								{isAdminLike
									? "Herramientas y accesos rápidos de administración."
									: "Revisá tu información personal asociada al gimnasio."}
							</p>
						</div>
					</div>

					<span className="perfil-badge">{roleLabel}</span>
				</div>

				{loading ? (
					<p>Cargando perfil...</p>
				) : isAdminLike ? (
					<div className="perfil-grid">
						<section className="perfil-card perfil-card-primary">
							<h3>Datos de usuario</h3>

							<dl className="perfil-details">
								<div>
									<dt>Nombre completo</dt>
									<dd>{nombreCompleto}</dd>
								</div>

								<div>
									<dt>Correo</dt>
									<dd>{usuario?.correo || user.email}</dd>
								</div>

								<div>
									<dt>DNI</dt>
									<dd>{usuario?.dni || "Sin cargar"}</dd>
								</div>

								<div>
									<dt>Rol</dt>
									<dd>{roleLabel}</dd>
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
									Gestionar usuarios
								</button>
								<button
									type="button"
									className="perfil-action-button"
									onClick={() => setIsModalOpen(true)}
								>
									Editar perfil
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
						<EditPerfilModal
							isOpen={isModalOpen}
							onClose={() => setIsModalOpen(false)}
							usuario={usuario}
							onSave={guardarPerfil}
						/>
					</div>
				) : usuario ? (
					<div className="perfil-grid">
						<section className="perfil-card perfil-card-primary">
							<>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								></div>
								<dl className="perfil-details">
									<div>
										<h3>Datos personales</h3>
										<dt>Nombre</dt>
										<dd>{usuario.nombre}</dd>
									</div>

									<div>
										<dt>Apellido</dt>
										<dd>{usuario.apellido || "Sin cargar"}</dd>
									</div>

									<div>
										<dt>Correo electrónico</dt>
										<dd>{usuario.correo}</dd>
									</div>
									<div>
										<dt>Fecha de nacimiento</dt>
										<dd>{usuario.fechaNacimiento || "Sin cargar"}</dd>
									</div>
									<div>
										<dt>Género</dt>
										<dd>{usuario.genero || "Sin cargar"}</dd>
									</div>


								</dl>
								<EditPerfilModal
									isOpen={isModalOpen}
									onClose={() => setIsModalOpen(false)}
									usuario={usuario}
									onSave={guardarPerfil}
								/>
							</>
						</section>

						<section className="perfil-card">
							<h3>Atajos</h3>

							<p className="perfil-helper-text">
								Usá estos accesos rápidos para seguir navegando.
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
									onClick={() => navigate("/clases")}
								>
									Ver clases
								</button>
								<button
									type="button"
									className="perfil-action-button"
									onClick={() => setIsModalOpen(true)}
								>
									Editar perfil
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
				) : (
					<p>No se encontró información del usuario.</p>
				)}
			</div>
		</UserLayout>
	);
}

export default Perfil;
