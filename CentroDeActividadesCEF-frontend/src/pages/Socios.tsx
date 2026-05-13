import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AddSocioModal from "../components/AddSocioModal";
import Spinner from "../components/Spinner";
import "../styles/socios.css";

import {
	obtenerSocios,
	crearSocio,
	actualizarSocio,
	eliminarSocioApi,
	type Socio,
} from "../services/socioService";

function Socios() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(
		null,
	);
	const [search, setSearch] = useState("");
	const [socios, setSocios] = useState<Socio[]>([]);

	const cargarSocios = async () => {
		setLoading(true);
		try {
			const data = await obtenerSocios();
			setSocios(data);
		} catch (error) {
			console.error("Error cargando socios:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let mounted = true;

		void (async () => {
			try {
				await cargarSocios();
			} catch (e) {
				// handled in cargarSocios
			}
		})();

		return () => {
			mounted = false;
		};
	}, []);

	const [loading, setLoading] = useState(false);

	const guardarSocio = async (socio: Socio) => {
		try {
			if (socio.id) {
				await actualizarSocio(socio.id, socio);
			} else {
				await crearSocio({
					nombre: socio.nombre,
					email: socio.email,
					telefono: socio.telefono,
					fechaNacimiento: socio.fechaNacimiento,
					cuota: "Pendiente",
					estado: "Activo",
				});
			}

			await cargarSocios();
			setSocioSeleccionado(null);
			setIsModalOpen(false);
		} catch (error) {
			console.error("Error guardando socio:", error);
		}
	};

	const eliminarSocio = async (id?: number) => {
		if (!id) return;

		const confirmar = window.confirm("¿Eliminar socio?");

		if (!confirmar) return;

		try {
			await eliminarSocioApi(id);
			await cargarSocios();
		} catch (error) {
			console.error("Error eliminando socio:", error);
		}
	};

	const sociosFiltrados = socios.filter(
		(socio) =>
			socio.nombre.toLowerCase().includes(search.toLowerCase()) ||
			socio.email.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<Layout>
			<div className="socios-container">
				<div className="socios-header">
					<h2>Gestión de Socios</h2>

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
								<th>Cuota</th>
								<th>Estado</th>
								<th>Acciones</th>
							</tr>
						</thead>

						<tbody>
							{sociosFiltrados.map((socio) => (
								<tr key={socio.id}>
									<td>{socio.id}</td>
									<td>{socio.nombre}</td>
									<td>{socio.email}</td>
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

											<button
												className="delete-btn"
												onClick={() => eliminarSocio(socio.id)}
											>
												🗑️
											</button>
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
			</div>
		</Layout>
	);
}

export default Socios;
