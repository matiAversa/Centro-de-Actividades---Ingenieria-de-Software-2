import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/useAuth";
import "../styles/misInscripciones.css";

interface Actividad {
	id?: number;
	nombre?: string;
}

interface Clase {
	id?: number;
	fecha?: string;
	horaInicio?: string;
	horaFin?: string;
	profesor?: string;
	cupoMaximo?: number;
	cuposDisponibles?: number;
	estado?: string;
	actividad?: Actividad | null;
}

interface Inscripcion {
	id: number;
	clase?: Clase | null;
	fechaInscripcion?: string;
	estadoPago?: string;
}

type Vista = "CALENDARIO" | "LISTA";
type FiltroPago = "TODAS" | "PENDIENTE_PAGO" | "PAGADA" | "CANCELADA";

function MisInscripciones() {
	const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
	const [loading, setLoading] = useState(true);
	const [fechaActual, setFechaActual] = useState(new Date());
	const [vista, setVista] = useState<Vista>("CALENDARIO");
	const [filtroPago, setFiltroPago] = useState<FiltroPago>("TODAS");

	const { user } = useAuth();
	const socioId = user?.socioId;

	useEffect(() => {
		const obtenerInscripciones = async () => {
			try {
				const response = await fetch(
					`http://localhost:8080/api/inscripciones/socio/${socioId}`,
				);

				if (!response.ok) {
					throw new Error("Error al obtener inscripciones");
				}

				const data: Inscripcion[] = await response.json();
				setInscripciones(data);
			} catch (error) {
				console.error(error);
				alert("No se pudieron cargar tus inscripciones");
			} finally {
				setLoading(false);
			}
		};

		if (socioId) {
			void obtenerInscripciones();
		} else {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setLoading(false);
		}
	}, [socioId]);

	const cancelarInscripcion = async (id: number) => {
		const confirmar = window.confirm(
			"¿Seguro que querés cancelar esta inscripción?",
		);

		if (!confirmar) return;

		try {
			const response = await fetch(
				`http://localhost:8080/api/inscripciones/${id}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				throw new Error("No se pudo cancelar la inscripción");
			}

			setInscripciones((prev) =>
				prev.filter((inscripcion) => inscripcion.id !== id),
			);

			alert("Inscripción cancelada correctamente");
		} catch (error) {
			console.error(error);
			alert("Error al cancelar la inscripción");
		}
	};

	const tieneClaseValida = (inscripcion: Inscripcion) => {
		return Boolean(
			inscripcion.clase &&
			inscripcion.clase.fecha &&
			inscripcion.clase.horaInicio,
		);
	};

	const obtenerEstadoPago = (estadoPago?: string) => {
		return estadoPago || "PENDIENTE_PAGO";
	};

	const obtenerTextoEstadoPago = (estadoPago?: string) => {
		switch (obtenerEstadoPago(estadoPago)) {
			case "PAGADA":
				return "Pagada";
			case "CANCELADA":
				return "Cancelada";
			default:
				return "Pendiente";
		}
	};

	const obtenerClaseEstadoPago = (estadoPago?: string) => {
		switch (obtenerEstadoPago(estadoPago)) {
			case "PAGADA":
				return "estado-pago pagada";
			case "CANCELADA":
				return "estado-pago cancelada";
			default:
				return "estado-pago pendiente";
		}
	};

	const cambiarMes = (cantidad: number) => {
		setFechaActual(
			new Date(fechaActual.getFullYear(), fechaActual.getMonth() + cantidad, 1),
		);
	};

	const obtenerDiasDelCalendario = () => {
		const anio = fechaActual.getFullYear();
		const mes = fechaActual.getMonth();

		const primerDiaMes = new Date(anio, mes, 1);
		const ultimoDiaMes = new Date(anio, mes + 1, 0);

		const diasPrevios = primerDiaMes.getDay();
		const totalDiasMes = ultimoDiaMes.getDate();

		const dias: Array<Date | null> = [];

		for (let i = 0; i < diasPrevios; i++) {
			dias.push(null);
		}

		for (let dia = 1; dia <= totalDiasMes; dia++) {
			dias.push(new Date(anio, mes, dia));
		}

		return dias;
	};

	const formatearFechaInput = (fecha: Date) => {
		const year = fecha.getFullYear();
		const month = String(fecha.getMonth() + 1).padStart(2, "0");
		const day = String(fecha.getDate()).padStart(2, "0");

		return `${year}-${month}-${day}`;
	};

	const formatearFechaTexto = (fecha?: string) => {
		if (!fecha) return "Sin fecha";

		const date = new Date(`${fecha}T00:00:00`);

		return date.toLocaleDateString("es-AR", {
			weekday: "long",
			day: "2-digit",
			month: "long",
		});
	};

	const formatearHorario = (clase?: Clase | null) => {
		if (!clase?.horaInicio || !clase?.horaFin) return "Sin horario";

		return `${clase.horaInicio.slice(0, 5)} - ${clase.horaFin.slice(0, 5)}`;
	};

	const obtenerNombreActividad = (clase?: Clase | null) => {
		return clase?.actividad?.nombre || "Actividad sin nombre";
	};

	const obtenerProfesor = (clase?: Clase | null) => {
		return clase?.profesor || "Profesor no asignado";
	};

	const inscripcionesValidas = inscripciones.filter(tieneClaseValida);

	const inscripcionesFiltradas = inscripcionesValidas.filter((inscripcion) => {
		if (filtroPago === "TODAS") return true;

		return obtenerEstadoPago(inscripcion.estadoPago) === filtroPago;
	});

	const inscripcionesOrdenadas = [...inscripcionesFiltradas].sort((a, b) => {
		const fechaA = new Date(
			`${a.clase?.fecha || ""}T${a.clase?.horaInicio || "00:00:00"}`,
		);

		const fechaB = new Date(
			`${b.clase?.fecha || ""}T${b.clase?.horaInicio || "00:00:00"}`,
		);

		return fechaA.getTime() - fechaB.getTime();
	});

	const obtenerInscripcionesPorDia = (fecha: Date) => {
		const fechaFormateada = formatearFechaInput(fecha);

		return inscripcionesOrdenadas.filter(
			(inscripcion) => inscripcion.clase?.fecha === fechaFormateada,
		);
	};

	const nombreMes = fechaActual.toLocaleDateString("es-AR", {
		month: "long",
		year: "numeric",
	});

	const pendientesPago = inscripcionesValidas.filter(
		(inscripcion) =>
			obtenerEstadoPago(inscripcion.estadoPago) === "PENDIENTE_PAGO",
	).length;

	const pagadas = inscripcionesValidas.filter(
		(inscripcion) => obtenerEstadoPago(inscripcion.estadoPago) === "PAGADA",
	).length;

	const clasesDelMes = inscripcionesValidas.filter((inscripcion) => {
		if (!inscripcion.clase?.fecha) return false;

		const fechaClase = new Date(`${inscripcion.clase.fecha}T00:00:00`);

		return (
			fechaClase.getFullYear() === fechaActual.getFullYear() &&
			fechaClase.getMonth() === fechaActual.getMonth()
		);
	}).length;

	const proximaInscripcion = [...inscripcionesValidas].sort((a, b) => {
		const fechaA = new Date(
			`${a.clase?.fecha || ""}T${a.clase?.horaInicio || "00:00:00"}`,
		);

		const fechaB = new Date(
			`${b.clase?.fecha || ""}T${b.clase?.horaInicio || "00:00:00"}`,
		);

		return fechaA.getTime() - fechaB.getTime();
	})[0];

	if (!socioId) {
		return (
			<UserLayout>
				<p>Error al obtener el usuario.</p>
			</UserLayout>
		);
	}

	return (
		<UserLayout>
			<div className="dashboard-content">
				<div className="mis-inscripciones-hero">
					<div>
						<p className="mis-inscripciones-label">Área del socio</p>
						<h2>Mis inscripciones</h2>
						<p>
							Consultá tus clases, revisá el estado de pago y administrá tus
							reservas desde una vista simple.
						</p>
					</div>

					<Link to="/clases" className="mis-inscripciones-hero-btn">
						Buscar clases
					</Link>
				</div>

				{loading ? (
					<Spinner message="Cargando calendario..." />
				) : inscripcionesValidas.length === 0 ? (
					<div className="mis-inscripciones-empty">
						<h3>No tenés clases inscriptas</h3>
						<p>Cuando te inscribas a una clase, va a aparecer acá.</p>
						<Link to="/clases">Ver clases disponibles</Link>
					</div>
				) : (
					<>
						<div className="mis-inscripciones-summary">
							<div>
								<span>Total inscripciones</span>
								<strong>{inscripcionesValidas.length}</strong>
							</div>

							<div>
								<span>Este mes</span>
								<strong>{clasesDelMes}</strong>
							</div>

							<div>
								<span>Pendientes de pago</span>
								<strong>{pendientesPago}</strong>
							</div>

							<div>
								<span>Pagadas</span>
								<strong>{pagadas}</strong>
							</div>
						</div>

						{proximaInscripcion && (
							<section className="proxima-inscripcion-card">
								<div>
									<span
										className={obtenerClaseEstadoPago(
											proximaInscripcion.estadoPago,
										)}
									>
										{obtenerTextoEstadoPago(proximaInscripcion.estadoPago)}
									</span>

									<h3>{obtenerNombreActividad(proximaInscripcion.clase)}</h3>

									<p>
										{formatearFechaTexto(proximaInscripcion.clase?.fecha)} ·{" "}
										{formatearHorario(proximaInscripcion.clase)}
									</p>

									<p>Profesor: {obtenerProfesor(proximaInscripcion.clase)}</p>
								</div>
							</section>
						)}

						<div className="mis-inscripciones-toolbar">
							<div className="vista-toggle">
								<button
									className={vista === "CALENDARIO" ? "active" : ""}
									onClick={() => setVista("CALENDARIO")}
								>
									Calendario
								</button>

								<button
									className={vista === "LISTA" ? "active" : ""}
									onClick={() => setVista("LISTA")}
								>
									Lista
								</button>
							</div>

							<select
								value={filtroPago}
								onChange={(e) => setFiltroPago(e.target.value as FiltroPago)}
							>
								<option value="TODAS">Todos los pagos</option>
								<option value="PENDIENTE_PAGO">Pendientes</option>
								<option value="PAGADA">Pagadas</option>
								<option value="CANCELADA">Canceladas</option>
							</select>
						</div>

						{vista === "CALENDARIO" ? (
							<>
								<div className="calendar-header">
									<h3>Calendario mensual</h3>

									<div className="calendar-actions">
										<button onClick={() => cambiarMes(-1)}>Anterior</button>
										<strong>{nombreMes}</strong>
										<button onClick={() => cambiarMes(1)}>Siguiente</button>
									</div>
								</div>

								<div className="monthly-calendar">
									<div className="calendar-weekdays">
										<div>Dom</div>
										<div>Lun</div>
										<div>Mar</div>
										<div>Mié</div>
										<div>Jue</div>
										<div>Vie</div>
										<div>Sáb</div>
									</div>

									<div className="calendar-grid">
										{obtenerDiasDelCalendario().map((dia, index) => {
											if (!dia) {
												return (
													<div key={index} className="calendar-day empty" />
												);
											}

											const clasesDelDia = obtenerInscripcionesPorDia(dia);

											return (
												<div key={index} className="calendar-day">
													<span className="calendar-day-number">
														{dia.getDate()}
													</span>

													<div className="calendar-classes">
														{clasesDelDia.map((inscripcion) => (
															<div
																key={inscripcion.id}
																className="calendar-class-card"
															>
																<strong>
																	{obtenerNombreActividad(inscripcion.clase)}
																</strong>

																<p>{formatearHorario(inscripcion.clase)}</p>
																<p>{obtenerProfesor(inscripcion.clase)}</p>

																<span
																	className={obtenerClaseEstadoPago(
																		inscripcion.estadoPago,
																	)}
																>
																	{obtenerTextoEstadoPago(
																		inscripcion.estadoPago,
																	)}
																</span>

																<button
																	className="delete-btn small"
																	onClick={() =>
																		cancelarInscripcion(inscripcion.id)
																	}
																>
																	Cancelar
																</button>
															</div>
														))}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</>
						) : (
							<div className="mis-inscripciones-list">
								{inscripcionesOrdenadas.length === 0 ? (
									<div className="mis-inscripciones-empty small">
										<p>No hay inscripciones con ese filtro.</p>
									</div>
								) : (
									inscripcionesOrdenadas.map((inscripcion) => (
										<article
											key={inscripcion.id}
											className="mis-inscripcion-row"
										>
											<div>
												<h3>{obtenerNombreActividad(inscripcion.clase)}</h3>
												<p>{obtenerProfesor(inscripcion.clase)}</p>
											</div>

											<div>
												<span>Fecha</span>
												<strong>
													{formatearFechaTexto(inscripcion.clase?.fecha)}
												</strong>
											</div>

											<div>
												<span>Horario</span>
												<strong>{formatearHorario(inscripcion.clase)}</strong>
											</div>

											<div>
												<span
													className={obtenerClaseEstadoPago(
														inscripcion.estadoPago,
													)}
												>
													{obtenerTextoEstadoPago(inscripcion.estadoPago)}
												</span>
											</div>

											<button
												className="delete-btn"
												onClick={() => cancelarInscripcion(inscripcion.id)}
											>
												Cancelar
											</button>
										</article>
									))
								)}
							</div>
						)}
					</>
				)}
			</div>
		</UserLayout>
	);
}

export default MisInscripciones;
