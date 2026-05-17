import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import Spinner from "../components/Spinner";
import "../styles/dashboard.css";

import { obtenerDashboardResumen } from "../services/dashboardService";

function Dashboard() {
	const [sociosActivos, setSociosActivos] = useState(0);
	const [actividades, setActividades] = useState(0);
	const [inscripciones, setInscripciones] = useState(0);
	const [actividadesCompletas, setActividadesCompletas] = useState(0);

	const cargarResumen = async () => {
		setLoading(true);
		try {
			const resumen = await obtenerDashboardResumen();

			setSociosActivos(resumen.sociosActivos);
			setActividades(resumen.actividades);
			setInscripciones(resumen.inscripciones);
			setActividadesCompletas(resumen.actividadesCompletas);
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
