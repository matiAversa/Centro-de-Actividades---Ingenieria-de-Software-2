import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AddSocioModal from "../components/AddSocioModal";
import AddRecepcionistaModal from "../components/AddRecepcionistaModal";
import Spinner from "../components/Spinner";
import "../styles/socios.css";

import { obtenerSocios, type UsuarioSocio } from "../services/usuarioService";
import {
	crearRecepcionista,
	type RecepcionistaForm,
} from "../services/usuarioService";

function Socios() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRecepcionistaModalOpen, setIsRecepcionistaModalOpen] =
		useState(false);
	const [socioSeleccionado, setSocioSeleccionado] =
		useState<UsuarioSocio | null>(null);
	const [search, setSearch] = useState("");
	const [socios, setSocios] = useState<UsuarioSocio[]>([]);
	const [message, setMessage] = useState<string>("");
	const [messageType, setMessageType] = useState<"success" | "error" | "">("");

	const cargarSocios = async () => {
		setLoading(true);
		try {
			const data = await obtenerSocios();
			setSocios(data);
		} catch (error) {
			console.error("Error cargando socios:", error);
			setMessage("No se pudieron cargar los socios.");
			setMessageType("error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void (async () => {
			try {
				await cargarSocios();
			} catch (e) {
				// handled in cargarSocios
			}
		})();

		return undefined;
	}, []);

	const [loading, setLoading] = useState(false);

	const guardarSocio = async (socio: UsuarioSocio) => {
		// For now, just close the modal (edit not implemented for usuarios)
		setSocioSeleccionado(null);
		setIsModalOpen(false);
	};

	const guardarRecepcionista = async (recepcionista: RecepcionistaForm) => {
		try {
			await crearRecepcionista(recepcionista);
			setIsRecepcionistaModalOpen(false);
			setMessage("Recepcionista creado correctamente.");
			setMessageType("success");
		} catch (error) {
			console.error("Error guardando recepcionista:", error);
			setMessage("No se pudo crear el recepcionista.");
			setMessageType("error");
		}
	};

	const sociosFiltrados = socios.filter(
		(socio) =>
			socio.nombre.toLowerCase().includes(search.toLowerCase()) ||
			socio.correo.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<Layout>
			<div className="socios-container">
				<div className="socios-header">
					<h2>Gestión de Socios</h2>

					<div className="socios-header-actions">
						<button
							className="add-recepcionista-btn"
							onClick={() => {
								setIsRecepcionistaModalOpen(true);
							}}
						>
							+ Agregar recepcionista
						</button>

						<button
							className="add-socio-btn"
							onClick={() => {
								setSocioSeleccionado(null);
								setIsModalOpen(true);
							}}
						>
							+ Agregar socio
						</button>
					</div>
				</div>

				{message && (
					<div className={`message-box ${messageType}`}>{message}</div>
				)}

				<input
					className="search-input"
					type="text"
					placeholder="Buscar socio..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				{loading ? (
					<Spinner message="Cargando socios..." />
				) : (
					<table className="socios-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Nombre</th>
								<th>Email</th>
								<th>Estado</th>
								<th>Acciones</th>
							</tr>
						</thead>

						<tbody>
							{sociosFiltrados.map((socio) => (
								<tr key={socio.id}>
									<td>{socio.id}</td>
									<td>{socio.nombre}</td>
									<td>{socio.correo}</td>
									<td>{socio.cuota}</td>
									<td>
										<span
											className={
												socio.estado === "Activo"
													? "status active"
													: "status inactive"
											}
										>
											{socio.estado}
										</span>
									</td>

									<td>
										<div className="actions">
											<button
												className="edit-btn"
												onClick={() => {
													setSocioSeleccionado(socio);
													setIsModalOpen(true);
												}}
											>
												✏️
											</button>

											{/* <button
												
												className="delete-btn"
												onClick={() => eliminarSocio(socio.id)}
											>
												🗑️
											</button> */}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				<AddSocioModal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						setSocioSeleccionado(null);
					}}
					onSaveSocio={(socio: unknown) => guardarSocio(socio as Socio)}
					socioToEdit={socioSeleccionado}
				/>

				<AddRecepcionistaModal
					isOpen={isRecepcionistaModalOpen}
					onClose={() => setIsRecepcionistaModalOpen(false)}
					onSaveRecepcionista={guardarRecepcionista}
				/>
			</div>
		</Layout>
	);
}

export default Socios;
