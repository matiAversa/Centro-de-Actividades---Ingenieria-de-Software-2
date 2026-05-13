import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import Spinner from "../components/Spinner";
import "../styles/dashboard.css";

import { obtenerSocios } from "../services/socioService";
import { obtenerActividades } from "../services/actividadService";
import { obtenerInscripciones } from "../services/inscripcionService";

function Dashboard() {
	const [sociosActivos, setSociosActivos] = useState(0);
	const [actividades, setActividades] = useState(0);
	const [inscripciones, setInscripciones] = useState(0);
	const [actividadesCompletas, setActividadesCompletas] = useState(0);

	const cargarResumen = async () => {
		setLoading(true);
		try {
			const [sociosData, actividadesData, inscripcionesData] =
				await Promise.all([
					obtenerSocios(),
					obtenerActividades(),
					obtenerInscripciones(),
				]);

			setSociosActivos(
				sociosData.filter((socio) => socio.estado === "Activo").length,
			);

			setActividades(actividadesData.length);
			setInscripciones(inscripcionesData.length);

			setActividadesCompletas(
				actividadesData.filter((actividad) => actividad.cupos <= 0).length,
			);
		} catch (error) {
			console.error("Error cargando resumen:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		cargarResumen();
	}, []);

	const [loading, setLoading] = useState(true);

	return (
		<Layout>
			<div className="dashboard-content">
				<h2>Resumen General</h2>

				{loading ? (
					<Spinner message="Cargando resumen..." />
				) : (
					<div className="cards-grid">
						<DashboardCard
							title="Socios Activos"
							value={String(sociosActivos)}
						/>

						<DashboardCard title="Actividades" value={String(actividades)} />

						<DashboardCard
							title="Inscripciones"
							value={String(inscripciones)}
						/>

						<DashboardCard
							title="Actividades Completas"
							value={String(actividadesCompletas)}
						/>
					</div>
				)}
			</div>
		</Layout>
	);
}

export default Dashboard;
