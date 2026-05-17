import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import { useAuth } from "../context/useAuth";
import "../styles/perfil.css";

interface Socio {
	id: number;
	nombre: string;
	correo: string;
	telefono: string;
	fechaNacimiento: string;
	estado: string;
}

function Perfil() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const [socio, setSocio] = useState<Socio | null>(null);
	const [loading, setLoading] = useState(true);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [savingProfile, setSavingProfile] = useState(false);
	const [editForm, setEditForm] = useState({
		nombre: "",
		email: "",
		telefono: "",
		fechaNacimiento: "",
	});

	const socioId = user?.socioId;

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		if (user.role === "ADMIN") {
			setLoading(false);
			return;
		}

		const obtenerPerfil = async () => {
			try {
				const response = await fetch(
					`http://localhost:8080/User/${socioId}`,
				);

				if (!response.ok) {
					throw new Error("No se pudo obtener el perfil");
				}

				const data: Socio = await response.json();
				setSocio(data);
			} catch (error) {
				console.error(error);
				alert("Error al cargar el perfil");
			} finally {
				setLoading(false);
			}
		};

		if (socioId) {
			obtenerPerfil();
		} else {
			setLoading(false);
		}
	}, [user, socioId, navigate]);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const abrirModalEdicion = () => {
		if (!socio) return;

		setEditForm({
			nombre: socio.nombre || "",
			email: socio.correo || "",
			telefono: socio.telefono || "",
			fechaNacimiento: socio.fechaNacimiento || "",
		});
		setEditModalOpen(true);
	};

	const cerrarModalEdicion = () => {
		if (savingProfile) return;
		setEditModalOpen(false);
	};

	const actualizarCampo = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditForm((prev) => ({ ...prev, [name]: value }));
	};

	const guardarPerfil = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!socioId || !socio) return;

		if (!editForm.nombre.trim() || !editForm.email.trim()) {
			alert("Nombre y correo son obligatorios");
			return;
		}

		try {
			setSavingProfile(true);

			const response = await fetch(
				`http://localhost:8080/user/${socioId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: socio.id,
						nombre: editForm.nombre.trim(),
						correo: editForm.email.trim(),
						telefono: editForm.telefono.trim(),
						fechaNacimiento: editForm.fechaNacimiento,
						estado: socio.estado,
					}),
				},
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "No se pudo actualizar el perfil");
			}

			const data: Socio = await response.json();
			setSocio(data);
			setEditModalOpen(false);
			alert("Perfil actualizado correctamente");
		} catch (error) {
			console.error(error);
			alert(
				error instanceof Error ? error.message : "Error al actualizar perfil",
			);
		} finally {
			setSavingProfile(false);
		}
	};

	if (user?.role === "ADMIN") {
		return (
			<UserLayout>
				<div className="dashboard-content perfil-page">
					<div className="perfil-hero">
						<div className="perfil-identity">
							<div className="perfil-avatar">
								{user.email.charAt(0).toUpperCase()}
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
									<dd>{user.email}</dd>
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

	if (!socioId) {
		return (
			<UserLayout>
				<div className="dashboard-content">
					<p>Error al obtener el usuario.</p>
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
							{socio?.nombre?.charAt(0).toUpperCase() ??
								user?.email?.charAt(0).toUpperCase() ??
								"U"}
						</div>

						<div>
							<p className="perfil-kicker">Cuenta activa</p>
							<h2 className="mi-perfil-blanco">Mi Perfil</h2>
							<p className="perfil-subtitle">
								Revisá tu información personal asociada al gimnasio.
							</p>
						</div>
					</div>

					<span className="perfil-badge">Socio</span>
				</div>

				{loading ? (
					<p>Cargando perfil...</p>
				) : !socio ? (
					<p>No se encontró información del socio.</p>
				) : (
					<div className="perfil-grid">
						<section className="perfil-card perfil-card-primary">
							<h3>Datos personales</h3>

							<dl className="perfil-details">
								<div>
									<dt>Nombre</dt>
									<dd>{socio.nombre}</dd>
								</div>

								<div>
									<dt>Correo electrónico</dt>
									<dd>{socio.correo}</dd>
								</div>

								<div>
									<dt>Teléfono</dt>
									<dd>{socio.telefono || "Sin cargar"}</dd>
								</div>

								<div>
									<dt>Fecha de nacimiento</dt>
									<dd>{socio.fechaNacimiento || "Sin cargar"}</dd>
								</div>
							</dl>
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
									onClick={abrirModalEdicion}
								>
									Editar perfil
								</button>

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
									onClick={handleLogout}
								>
									Cerrar sesión
								</button>
							</div>
						</section>
					</div>
				)}

				{editModalOpen && socio && (
					<div className="perfil-modal-overlay">
						<div className="perfil-modal-card">
							<div className="perfil-modal-header">
								<h3>Editar perfil</h3>
								<button
									type="button"
									className="perfil-modal-close"
									onClick={cerrarModalEdicion}
									aria-label="Cerrar modal"
								>
									✕
								</button>
							</div>

							<form className="perfil-modal-form" onSubmit={guardarPerfil}>
								<div className="perfil-modal-field">
									<label htmlFor="perfil-nombre">Nombre</label>
									<input
										id="perfil-nombre"
										name="nombre"
										type="text"
										value={editForm.nombre}
										onChange={actualizarCampo}
										required
									/>
								</div>

								<div className="perfil-modal-field">
									<label htmlFor="perfil-email">Correo</label>
									<input
										id="perfil-email"
										name="email"
										type="email"
										value={editForm.email}
										onChange={actualizarCampo}
										required
									/>
								</div>

								<div className="perfil-modal-field">
									<label htmlFor="perfil-telefono">Teléfono</label>
									<input
										id="perfil-telefono"
										name="telefono"
										type="text"
										value={editForm.telefono}
										onChange={actualizarCampo}
									/>
								</div>

								<div className="perfil-modal-field">
									<label htmlFor="perfil-fecha">Fecha de nacimiento</label>
									<input
										id="perfil-fecha"
										name="fechaNacimiento"
										type="date"
										value={editForm.fechaNacimiento}
										onChange={actualizarCampo}
									/>
								</div>

								<div className="perfil-modal-actions">
									<button
										type="button"
										className="perfil-modal-btn perfil-modal-btn-secondary"
										onClick={cerrarModalEdicion}
										disabled={savingProfile}
									>
										Cancelar
									</button>
									<button
										type="submit"
										className="perfil-modal-btn perfil-modal-btn-primary"
										disabled={savingProfile}
									>
										{savingProfile ? "Guardando..." : "Guardar cambios"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</UserLayout>
	);
}

export default Perfil;
