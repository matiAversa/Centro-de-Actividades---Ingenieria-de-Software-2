const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const CREAR_RECEPCIONISTA_PATHS = [
	"/api/User/CrearRecepcionista",
	"/User/CrearRecepcionista",
	"/user/CrearRecepcionista",
];

export type RecepcionistaForm = {
	nombre: string;
	apellido: string;
	dni: string;
	telefono: string;
	correo: string;
	contrasena: string;
	genero: string;
	fechaNacimiento: string;
	rol: string;
};

export type UsuarioSocio = {
	id: number;
	nombre: string;
	apellido: string;
	dni: string;
	fechaNacimiento: string;
	genero: string;
	telefono: string;
	correo: string;
	rol: string;
};

export const obtenerSocios = async (): Promise<UsuarioSocio[]> => {
	const response = await fetch(`${API_BASE_URL}/User/socios`);

	if (!response.ok) {
		throw new Error("Error al obtener socios");
	}

	return response.json();
};

export const crearRecepcionista = async (recepcionista: RecepcionistaForm) => {
	let lastErrorBody = "";

	for (const path of CREAR_RECEPCIONISTA_PATHS) {
		const response = await fetch(`${API_BASE_URL}${path}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(recepcionista),
		});

		if (response.ok) {
			return response.json();
		}

		lastErrorBody = await response.text().catch(() => "");

		// Si no se encontro la ruta, probamos la siguiente variante.
		if (response.status !== 404) {
			break;
		}
	}

	throw new Error(lastErrorBody || "Error al crear recepcionista");
};
