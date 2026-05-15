import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../styles/dashboard.css";
import "../styles/calendarioAdmin.css";
import Spinner from "../components/Spinner";

interface Actividad {
	id: number;
	nombre: string;
	activo?: boolean;
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
}

function CalendarioAdmin() {
	const [actividades, setActividades] = useState<Actividad[]>([]);
	const [clases, setClases] = useState<Clase[]>([]);

	const [actividadId, setActividadId] = useState("");
	const [fechaInicio, setFechaInicio] = useState("");
	const [fechaFin, setFechaFin] = useState("");
	const [diaSemana, setDiaSemana] = useState("MONDAY");
	const [horaInicio, setHoraInicio] = useState("");
	const [horaFin, setHoraFin] = useState("");
	const [profesor, setProfesor] = useState("");
	const [cupoMaximo, setCupoMaximo] = useState("");

	const [busqueda, setBusqueda] = useState("");
	const [actividadFiltro, setActividadFiltro] = useState("TODAS");

	const [loading, setLoading] = useState(true);
	const [guardando, setGuardando] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/immutability
		void cargarDatos();
	}, []);

	const cargarDatos = async () => {
		try {
			setLoading(true);

			const [actividadesRes, clasesRes] = await Promise.all([
				fetch("http://localhost:8080/api/actividades"),
				fetch("http://localhost:8080/api/clases"),
			]);

			if (!actividadesRes.ok || !clasesRes.ok) {
				throw new Error("Error al cargar datos");
			}

			const actividadesData: Actividad[] = await actividadesRes.json();
			const clasesData: Clase[] = await clasesRes.json();

			setActividades(actividadesData);
			setClases(clasesData);
		} catch (error) {
			console.error(error);
			alert("No se pudo cargar el calendario");
		} finally {
			setLoading(false);
		}
	};

	const limpiarFormulario = () => {
		setFechaInicio("");
		setFechaFin("");
		setHoraInicio("");
		setHoraFin("");
		setProfesor("");
		setCupoMaximo("");
	};

	const crearClasesRecurrentes = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!actividadId ||
			!fechaInicio ||
			!fechaFin ||
			!diaSemana ||
			!horaInicio ||
			!horaFin ||
			!profesor ||
			!cupoMaximo
		) {
			alert("Completá todos los campos");
			return;
		}

		try {
			setGuardando(true);

			const response = await fetch(
				"http://localhost:8080/api/clases/recurrentes",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						actividadId: Number(actividadId),
						fechaInicio,
						fechaFin,
						diaSemana,
						horaInicio: `${horaInicio}:00`,
						horaFin: `${horaFin}:00`,
						profesor: profesor.trim(),
						cupoMaximo: Number(cupoMaximo),
					}),
				},
			);

			if (!response.ok) {
				const mensaje = await response.text();
				throw new Error(mensaje || "No se pudieron crear las clases");
			}

			alert("Clases creadas correctamente");
			limpiarFormulario();
			await cargarDatos();
		} catch (error) {
			console.error(error);

			if (error instanceof Error) {
				alert(error.message);
			} else {
				alert("Error al crear clases recurrentes");
			}
		} finally {
			setGuardando(false);
		}
	};

	const eliminarClase = async (id: number) => {
		const confirmar = window.confirm("¿Seguro que querés eliminar esta clase?");

		if (!confirmar) return;

		try {
			const response = await fetch(`http://localhost:8080/api/clases/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("No se pudo eliminar la clase");
			}

			setClases((prev) => prev.filter((clase) => clase.id !== id));
		} catch (error) {
			console.error(error);
			alert("Error al eliminar la clase");
		}
	};

	const formatearFecha = (fecha: string) => {
		const date = new Date(`${fecha}T00:00:00`);

		return date.toLocaleDateString("es-AR", {
			weekday: "long",
			day: "2-digit",
			month: "long",
		});
	};

	const clasesFiltradas = clases.filter((clase) => {
		const texto = busqueda.toLowerCase();

		const coincideBusqueda =
			clase.actividad?.nombre.toLowerCase().includes(texto) ||
			clase.profesor.toLowerCase().includes(texto) ||
			clase.fecha.includes(texto);

		const coincideActividad =
			actividadFiltro === "TODAS" ||
			String(clase.actividad?.id) === actividadFiltro;

		return coincideBusqueda && coincideActividad;
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

	const totalClases = clases.length;
	const totalCupos = clases.reduce(
		(total, clase) => total + clase.cupoMaximo,
		0,
	);
	const cuposDisponibles = clases.reduce(
		(total, clase) => total + clase.cuposDisponibles,
		0,
	);

	if (loading) {
		return (
			<Layout>
				<div className="dashboard-content">
					<Spinner message="Cargando clases..." />
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="dashboard-content">
				<div className="admin-calendar-hero">
					<div>
						<p className="admin-calendar-label">Panel administrador</p>
						<h2>Gestión de calendario</h2>
						<p>
							Creá clases recurrentes, revisá cupos y administrá la agenda del
							CEF desde una vista más clara.
						</p>
					</div>
				</div>

				<div className="admin-calendar-summary">
					<div>
						<span>Total clases</span>
						<strong>{totalClases}</strong>
					</div>

					<div>
						<span>Cupos totales</span>
						<strong>{totalCupos}</strong>
					</div>

					<div>
						<span>Cupos disponibles</span>
						<strong>{cuposDisponibles}</strong>
					</div>
				</div>

				<div className="calendar-admin-card">
					<h3>Crear clases recurrentes</h3>

					<form onSubmit={crearClasesRecurrentes}>
						<div className="form-grid">
							<div className="form-field">
								<label>Actividad</label>
								<select
									value={actividadId}
									onChange={(e) => setActividadId(e.target.value)}
								>
									<option value="">Seleccionar actividad</option>

									{actividades
										.filter((actividad) => actividad.activo !== false)
										.map((actividad) => (
											<option key={actividad.id} value={actividad.id}>
												{actividad.nombre}
											</option>
										))}
								</select>
							</div>

							<div className="form-field">
								<label>Desde</label>
								<input
									type="date"
									value={fechaInicio}
									onChange={(e) => setFechaInicio(e.target.value)}
								/>
							</div>

							<div className="form-field">
								<label>Hasta</label>
								<input
									type="date"
									value={fechaFin}
									onChange={(e) => setFechaFin(e.target.value)}
								/>
							</div>

							<div className="form-field">
								<label>Día de la semana</label>
								<select
									value={diaSemana}
									onChange={(e) => setDiaSemana(e.target.value)}
								>
									<option value="MONDAY">Lunes</option>
									<option value="TUESDAY">Martes</option>
									<option value="WEDNESDAY">Miércoles</option>
									<option value="THURSDAY">Jueves</option>
									<option value="FRIDAY">Viernes</option>
									<option value="SATURDAY">Sábado</option>
									<option value="SUNDAY">Domingo</option>
								</select>
							</div>

							<div className="form-field">
								<label>Hora inicio</label>
								<input
									type="time"
									value={horaInicio}
									onChange={(e) => setHoraInicio(e.target.value)}
								/>
							</div>

							<div className="form-field">
								<label>Hora fin</label>
								<input
									type="time"
									value={horaFin}
									onChange={(e) => setHoraFin(e.target.value)}
								/>
							</div>

							<div className="form-field">
								<label>Profesor</label>
								<input
									type="text"
									placeholder="Ej: Manu"
									value={profesor}
									onChange={(e) => setProfesor(e.target.value)}
								/>
							</div>

							<div className="form-field">
								<label>Cupo máximo</label>
								<input
									type="number"
									placeholder="Ej: 20"
									value={cupoMaximo}
									onChange={(e) => setCupoMaximo(e.target.value)}
								/>
							</div>
						</div>

						<div className="calendar-actions">
							<button
								className="primary-btn"
								type="submit"
								disabled={guardando}
							>
								{guardando ? "Creando..." : "Crear clases"}
							</button>
						</div>
					</form>
				</div>

				<div className="admin-calendar-toolbar">
					<div>
						<h3>Clases cargadas</h3>
						<p>Vista agrupada por fecha y ordenada por horario.</p>
					</div>

					<div className="admin-calendar-filters">
						<input
							type="text"
							placeholder="Buscar actividad, profesor o fecha..."
							value={busqueda}
							onChange={(e) => setBusqueda(e.target.value)}
						/>

						<select
							value={actividadFiltro}
							onChange={(e) => setActividadFiltro(e.target.value)}
						>
							<option value="TODAS">Todas las actividades</option>

							{actividades.map((actividad) => (
								<option key={actividad.id} value={actividad.id}>
									{actividad.nombre}
								</option>
							))}
						</select>
					</div>
				</div>

				{loading ? (
					<Spinner message="Cargando clases..." />
				) : fechasOrdenadas.length === 0 ? (
					<div className="calendar-empty">No hay clases para mostrar.</div>
				) : (
					<div className="admin-calendar-list">
						{fechasOrdenadas.map((fecha) => (
							<section key={fecha} className="admin-day-section">
								<div className="admin-day-header">
									<h3>{formatearFecha(fecha)}</h3>
									<span>{clasesAgrupadas[fecha].length} clases</span>
								</div>

								<div className="admin-class-grid">
									{clasesAgrupadas[fecha]
										.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
										.map((clase) => {
											const ocupados =
												clase.cupoMaximo - clase.cuposDisponibles;

											return (
												<article key={clase.id} className="admin-class-card">
													<div className="admin-class-card-header">
														<div>
															<h4>{clase.actividad?.nombre}</h4>
															<p>{clase.profesor}</p>
														</div>

														<span className="admin-class-status">
															{clase.estado}
														</span>
													</div>

													<div className="admin-class-info">
														<div>
															<span>Horario</span>
															<strong>
																{clase.horaInicio?.slice(0, 5)} -{" "}
																{clase.horaFin?.slice(0, 5)}
															</strong>
														</div>

														<div>
															<span>Cupos</span>
															<strong>
																{clase.cuposDisponibles}/{clase.cupoMaximo}
															</strong>
														</div>
													</div>

													<div className="admin-cupos-detail">
														<p>
															{ocupados} inscriptos · {clase.cuposDisponibles}{" "}
															libres
														</p>
													</div>

													<button
														className="admin-delete-class-btn"
														onClick={() => eliminarClase(clase.id)}
													>
														Eliminar clase
													</button>
												</article>
											);
										})}
								</div>
							</section>
						))}
					</div>
				)}
			</div>
		</Layout>
	);
}

export default CalendarioAdmin;
