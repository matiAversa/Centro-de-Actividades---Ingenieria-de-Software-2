import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import Spinner from "../components/Spinner";
import "../styles/clases.css";
import { useAuth } from "../context/useAuth";

interface Actividad {
	id: number;
	nombre: string;
}

interface Clase {
	id: number;
	fecha: string;
	horaInicio: string;
	horaFin: string;
	profesor: string;
	cupoMaximo: number;
	cuposDisponibles: number;
	estado: string;
	actividad: Actividad;
	precio: number;
}

interface Socio {
	id: number;
}

interface Inscripcion {
	id: number;
	socio: Socio;
	clase: Clase;
	fechaInscripcion: string;
}

function Clases() {
	const [clases, setClases] = useState<Clase[]>([]);
	const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
	const [loading, setLoading] = useState(true);
	const [inscribiendoMensualId, setInscribiendoMensualId] = useState<
		number | null
	>(null);

	const [busqueda, setBusqueda] = useState("");
	const [actividadFiltro, setActividadFiltro] = useState("TODAS");
	const [estadoFiltro, setEstadoFiltro] = useState("TODAS");

	const { user } = useAuth();
	const navigate = useNavigate();
	const usuarioId = user?.usuarioId;

	useEffect(() => {
		// eslint-disable-next-line react-hooks/immutability
		void cargarDatos();
	}, []);

	const cargarDatos = async () => {
		try {
			setLoading(true);

			const [clasesResponse, inscripcionesResponse] = await Promise.all([
				fetch("http://localhost:8080/api/clases/proximas"),
				fetch("http://localhost:8080/api/inscripciones"),
			]);

			if (!clasesResponse.ok) {
				throw new Error("Error al obtener clases");
			}

			if (!inscripcionesResponse.ok) {
				throw new Error("Error al obtener inscripciones");
			}

			const clasesData: Clase[] = await clasesResponse.json();
			const inscripcionesData: Inscripcion[] =
				await inscripcionesResponse.json();

			setClases(clasesData);
			setInscripciones(inscripcionesData);
		} catch (error) {
			console.error(error);
			alert("No se pudieron cargar las clases");
		} finally {
			setLoading(false);
		}
	};

	const estaInscripto = (claseId: number) => {
		return inscripciones.some(
			(inscripcion) =>
				inscripcion.socio.id === usuarioId && inscripcion.clase?.id === claseId,
		);
	};

	const tieneHorarioOcupado = (clase: Clase) => {
		return inscripciones.some(
			(inscripcion) =>
				inscripcion.socio.id === usuarioId &&
				inscripcion.clase?.fecha === clase.fecha &&
				inscripcion.clase?.horaInicio === clase.horaInicio &&
				inscripcion.clase?.id !== clase.id,
		);
	};

	const puedeInscribirse = (clase: Clase) => {
		return (
			clase.cuposDisponibles > 0 &&
			!estaInscripto(clase.id) &&
			!tieneHorarioOcupado(clase)
		);
	};

	const obtenerEstadoClase = (clase: Clase) => {
		if (estaInscripto(clase.id)) return "INSCRIPTO";
		if (tieneHorarioOcupado(clase)) return "HORARIO_OCUPADO";
		if (clase.cuposDisponibles === 0) return "COMPLETO";
		return "DISPONIBLE";
	};

	const obtenerTextoEstado = (clase: Clase) => {
		const estado = obtenerEstadoClase(clase);

		switch (estado) {
			case "INSCRIPTO":
				return "Inscripto";
			case "HORARIO_OCUPADO":
				return "Horario ocupado";
			case "COMPLETO":
				return "Completo";
			default:
				return "Disponible";
		}
	};

	const obtenerTextoBoton = (clase: Clase) => {
		if (estaInscripto(clase.id)) return "Ya estás inscripto";
		if (tieneHorarioOcupado(clase)) return "Horario ocupado";
		if (clase.cuposDisponibles === 0) return "Sin cupos";
		return "Inscribirme";
	};

	const obtenerInicioMes = (fecha: string) => {
		const date = new Date(`${fecha}T00:00:00`);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;

		return `${year}-${String(month).padStart(2, "0")}-01`;
	};

	const obtenerFinMes = (fecha: string) => {
		const date = new Date(`${fecha}T00:00:00`);
		const year = date.getFullYear();
		const month = date.getMonth();

		const finMes = new Date(year, month + 1, 0);

		return `${finMes.getFullYear()}-${String(finMes.getMonth() + 1).padStart(
			2,
			"0",
		)}-${String(finMes.getDate()).padStart(2, "0")}`;
	};

	const inscribirse = (clase: Clase) => {
		navigate("/pagarclase", { state: { clase, tipo: "dia" } });
	};

	const inscribirseAlMes = (clase: Clase) => {
		const confirmar = window.confirm(
			`¿Querés inscribirte al mes completo de ${clase.actividad?.nombre}?`,
		);

		if (!confirmar) return;

		navigate("/pagarclase", { state: { clase, tipo: "mes" } });
	};

	const formatearFecha = (fecha: string) => {
		const date = new Date(`${fecha}T00:00:00`);

		return date.toLocaleDateString("es-AR", {
			weekday: "long",
			day: "2-digit",
			month: "long",
		});
	};

	const actividadesDisponibles = Array.from(
		new Map(
			clases.map((clase) => [
				clase.actividad.id,
				{
					id: clase.actividad.id,
					nombre: clase.actividad.nombre,
				},
			]),
		).values(),
	);

	const clasesFiltradas = clases.filter((clase) => {
		const textoBusqueda = busqueda.toLowerCase();
		const estadoClase = obtenerEstadoClase(clase);

		const coincideBusqueda =
			clase.actividad?.nombre.toLowerCase().includes(textoBusqueda) ||
			clase.profesor.toLowerCase().includes(textoBusqueda);

		const coincideActividad =
			actividadFiltro === "TODAS" ||
			String(clase.actividad.id) === actividadFiltro;

		const coincideEstado =
			estadoFiltro === "TODAS" || estadoClase === estadoFiltro;

		return coincideBusqueda && coincideActividad && coincideEstado;
	});

	const clasesAgrupadas = clasesFiltradas.reduce<Record<string, Clase[]>>(
		(grupos, clase) => {
			if (!grupos[clase.fecha]) {
				grupos[clase.fecha] = [];
			}

			grupos[clase.fecha].push(clase);
			return grupos;
		},
		{},
	);

	const fechasOrdenadas = Object.keys(clasesAgrupadas).sort();

	if (!usuarioId) {
		return (
			<UserLayout>
				<p>Error al obtener el usuario.</p>
			</UserLayout>
		);
	}

	return (
		<UserLayout>
			<div className="dashboard-content">
				<div className="clases-page-header">
					<div>
						<p className="section-label">Clases disponibles</p>
						<h2>Elegí tu próxima clase</h2>
						<p className="section-description">
							Consultá horarios, cupos disponibles e inscribite a una clase
							individual o al mes completo.
						</p>
					</div>
				</div>

				<div className="clases-filters">
					<input
						type="text"
						placeholder="Buscar por actividad o profesor..."
						value={busqueda}
						onChange={(e) => setBusqueda(e.target.value)}
					/>

					<select
						value={actividadFiltro}
						onChange={(e) => setActividadFiltro(e.target.value)}
					>
						<option value="TODAS">Todas las actividades</option>

						{actividadesDisponibles.map((actividad) => (
							<option key={actividad.id} value={actividad.id}>
								{actividad.nombre}
							</option>
						))}
					</select>

					<select
						value={estadoFiltro}
						onChange={(e) => setEstadoFiltro(e.target.value)}
					>
						<option value="TODAS">Todos los estados</option>
						<option value="DISPONIBLE">Disponibles</option>
						<option value="INSCRIPTO">Mis inscripciones</option>
						<option value="COMPLETO">Completas</option>
						<option value="HORARIO_OCUPADO">Horario ocupado</option>
					</select>
				</div>

				{loading ? (
					<Spinner message="Cargando clases..." />
				) : fechasOrdenadas.length === 0 ? (
					<div className="empty-state">
						<h3>No hay clases para mostrar</h3>
						<p>Probá cambiar los filtros o revisar más tarde.</p>
					</div>
				) : (
					<div className="calendario-clases">
						{fechasOrdenadas.map((fecha) => (
							<section key={fecha} className="dia-clases">
								<div className="dia-clases-header">
									<h3>{formatearFecha(fecha)}</h3>
									<span>{clasesAgrupadas[fecha].length} clases</span>
								</div>

								<div className="clases-grid">
									{clasesAgrupadas[fecha]
										.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
										.map((clase) => {
											const porcentajeOcupado =
												clase.cupoMaximo > 0
													? ((clase.cupoMaximo - clase.cuposDisponibles) /
															clase.cupoMaximo) *
														100
													: 0;

											return (
												<div key={clase.id} className="clase-card">
													<div className="clase-card-header">
														<div>
															<h4>{clase.actividad?.nombre}</h4>
															<p>{clase.profesor}</p>
														</div>

														<span
															className={`clase-status ${obtenerEstadoClase(
																clase,
															).toLowerCase()}`}
														>
															{obtenerTextoEstado(clase)}
														</span>
													</div>

													<div className="clase-info-grid">
														<div>
															<span>Horario</span>
															<strong>
																{clase.horaInicio.slice(0, 5)} -{" "}
																{clase.horaFin.slice(0, 5)}
															</strong>
														</div>

														<div>
															<span>Cupos</span>
															<strong>
																{clase.cuposDisponibles}/{clase.cupoMaximo}
															</strong>
														</div>
													</div>

													<div className="cupos-box">
														<div className="cupos-bar">
															<div
																className="cupos-progress"
																style={{ width: `${porcentajeOcupado}%` }}
															/>
														</div>

														<p>
															{clase.cuposDisponibles > 0
																? `${clase.cuposDisponibles} cupos disponibles`
																: "Sin cupos disponibles"}
														</p>
													</div>

													{tieneHorarioOcupado(clase) &&
														!estaInscripto(clase.id) && (
															<p className="warning-text">
																Ya tenés una clase en ese horario.
															</p>
														)}

													<div className="class-actions">
														<button
															className="primary-class-btn"
															disabled={!puedeInscribirse(clase)}
															onClick={() => inscribirse(clase)}
														>
															{obtenerTextoBoton(clase)}
														</button>

														<button
															className="secondary-class-btn"
															disabled={
																inscribiendoMensualId === clase.id ||
																estaInscripto(clase.id)
															}
															onClick={() => inscribirseAlMes(clase)}
														>
															{inscribiendoMensualId === clase.id
																? "Inscribiendo mes..."
																: "Inscribirme al mes"}
														</button>
													</div>
												</div>
											);
										})}
								</div>
							</section>
						))}
					</div>
				)}
			</div>
		</UserLayout>
	);
}

export default Clases;
