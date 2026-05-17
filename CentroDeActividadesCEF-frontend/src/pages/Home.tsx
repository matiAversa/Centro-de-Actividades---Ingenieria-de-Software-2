import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import Spinner from "../components/Spinner";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../context/useAuth";
import "../styles/dashboard.css";

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
}

interface Inscripcion {
	id: number;
	clase: Clase;
	fechaInscripcion: string;
	estadoPago?: string;
}

function Home() {
	const { user } = useAuth();
	const usuarioId = user?.usuarioId;

	const [clases, setClases] = useState<Clase[]>([]);
	const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!usuarioId) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setLoading(false);
			return;
		}

		const cargarDatos = async () => {
			try {
				setLoading(true);

				const [clasesRes, inscripcionesRes] = await Promise.all([
					fetch("http://localhost:8080/api/clases/proximas"),
					fetch(`http://localhost:8080/api/inscripciones/user/${usuarioId}`),
				]);

				if (!clasesRes.ok) {
					throw new Error("Error al cargar clases");
				}

				if (!inscripcionesRes.ok) {
					throw new Error("Error al cargar inscripciones");
				}

				const clasesData: Clase[] = await clasesRes.json();
				const inscripcionesData: Inscripcion[] = await inscripcionesRes.json();

				setClases(clasesData);
				setInscripciones(inscripcionesData);
			} catch (error) {
				console.error("Error al cargar el home del socio:", error);
			} finally {
				setLoading(false);
			}
		};

		void cargarDatos();
	}, [usuarioId]);

	const obtenerFechaClase = (clase: Clase) => {
		return new Date(`${clase.fecha}T${clase.horaInicio}`);
	};

	const inscripcionesOrdenadas = [...inscripciones]
		.filter((inscripcion) => inscripcion.clase?.fecha)
		.sort(
			(a, b) =>
				obtenerFechaClase(a.clase).getTime() -
				obtenerFechaClase(b.clase).getTime(),
		);

	const proximaInscripcion = inscripcionesOrdenadas[0];

	const pagosPendientes = inscripciones.filter(
		(inscripcion) =>
			!inscripcion.estadoPago || inscripcion.estadoPago === "PENDIENTE_PAGO",
	).length;

	const formatearFecha = (fecha: string) => {
		const date = new Date(`${fecha}T00:00:00`);

		return date.toLocaleDateString("es-AR", {
			weekday: "long",
			day: "2-digit",
			month: "long",
		});
	};

	const formatearHorario = (clase: Clase) => {
		return `${clase.horaInicio.slice(0, 5)} - ${clase.horaFin.slice(0, 5)}`;
	};

	const proximaClase =
		proximaInscripcion?.clase?.actividad?.nombre || "Sin clases";

	if (!usuarioId) {
		return (
			<UserLayout>
				<div className="dashboard-content">
					<p>No se encontró el usuario logueado.</p>
				</div>
			</UserLayout>
		);
	}

	return (
		<UserLayout>
			<div className="dashboard-content">
				<div className="home-hero">
					<div>
						<p className="home-label">Panel del usuario</p>
						<h2>Bienvenido al CEF</h2>
						<p>
							Consultá tus próximas clases, revisá tus inscripciones y seguí tu
							actividad desde un solo lugar.
						</p>
					</div>

					<Link to="/clases" className="home-hero-btn">
						Ver clases disponibles
					</Link>
				</div>

				{loading ? (
					<Spinner message="Cargando resumen..." />
				) : (
					<>
						<div className="cards-grid">
							<DashboardCard
								title="Clases disponibles"
								value={String(clases.length)}
							/>

							<DashboardCard
								title="Mis reservas"
								value={String(inscripciones.length)}
							/>

							<DashboardCard
								title="Pagos pendientes"
								value={String(pagosPendientes)}
							/>

							<DashboardCard title="Próxima clase" value={proximaClase} />
						</div>

						<div className="home-main-grid">
							<section className="next-class-card">
								<div className="home-section-header">
									<h3>Próxima clase</h3>
									<Link to="/mis-inscripciones">Ver calendario</Link>
								</div>

								{proximaInscripcion ? (
									<div className="next-class-content">
										<span className="next-class-badge">
											{proximaInscripcion.estadoPago === "PAGADA"
												? "Pagada"
												: "Pendiente de pago"}
										</span>

										<h4>{proximaInscripcion.clase.actividad.nombre}</h4>

										<p>
											{formatearFecha(proximaInscripcion.clase.fecha)} ·{" "}
											{formatearHorario(proximaInscripcion.clase)}
										</p>

										<p>Profesor: {proximaInscripcion.clase.profesor}</p>
									</div>
								) : (
									<div className="home-empty-box">
										<p>Todavía no tenés clases inscriptas.</p>
										<Link to="/clases">Inscribirme a una clase</Link>
									</div>
								)}
							</section>

							<section className="quick-actions-card">
								<h3>Accesos rápidos</h3>

								<div className="quick-actions-grid">
									<Link to="/clases">Buscar clases</Link>
									<Link to="/mis-inscripciones">Mi calendario</Link>
									<Link to="/perfil">Mi perfil</Link>
								</div>
							</section>
						</div>

						<section className="home-list-card">
							<div className="home-section-header">
								<h3>Mis próximas inscripciones</h3>
								<Link to="/mis-inscripciones">Ver todas</Link>
							</div>

							{inscripcionesOrdenadas.length === 0 ? (
								<p>No tenés inscripciones activas.</p>
							) : (
								<div className="home-class-list">
									{inscripcionesOrdenadas.slice(0, 4).map((inscripcion) => (
										<div key={inscripcion.id} className="home-class-row">
											<div>
												<strong>{inscripcion.clase.actividad.nombre}</strong>
												<span>{inscripcion.clase.profesor}</span>
											</div>

											<div>
												<strong>
													{formatearFecha(inscripcion.clase.fecha)}
												</strong>
												<span>{formatearHorario(inscripcion.clase)}</span>
											</div>
										</div>
									))}
								</div>
							)}
						</section>
					</>
				)}
			</div>
		</UserLayout>
	);
}

export default Home;
