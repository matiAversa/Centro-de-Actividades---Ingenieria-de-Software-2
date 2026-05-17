const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export type DashboardResumen = {
	sociosActivos: number;
	actividades: number;
	inscripciones: number;
	actividadesCompletas: number;
};

export const obtenerDashboardResumen = async (): Promise<DashboardResumen> => {
	const response = await fetch(`${API_BASE_URL}/api/dashboard/resumen`);

	if (!response.ok) {
		const bodyText = await response.text().catch(() => "");
		throw new Error(bodyText || "Error al obtener resumen del dashboard");
	}

	return response.json();
};
