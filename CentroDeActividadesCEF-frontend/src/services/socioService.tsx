const API_URL = "http://localhost:8080/User";

export type Socio = {
	id: number;
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: string; // formato DD/MM/AAAA
    genero: string;
    telefono: string;
    correo: string;
    rol: string;
	estado: string;
};

export const obtenerSocios = async (): Promise<Socio[]> => {
	const response = await fetch(API_URL + "/socios");

	if (!response.ok) {
		throw new Error("Error al obtener socios");
	}

	return response.json();
};

export const crearSocio = async (socio: Omit<Socio, "id">): Promise<Socio> => {
	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(socio),
	});

	if (!response.ok) {
		throw new Error("Error al crear socio");
	}

	return response.json();
};

export const actualizarSocio = async (
	id: number,
	socio: Socio,
): Promise<Socio> => {
	const response = await fetch(`${API_URL}/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(socio),
	});

	if (!response.ok) {
		throw new Error("Error al actualizar socio");
	}

	return response.json();
};

export const eliminarSocioApi = async (id: number): Promise<void> => {
	const response = await fetch(`${API_URL}/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		let bodyText: string | undefined;
		try {
			bodyText = await response.text();
		} catch (_e) {
			bodyText = undefined;
		}

		const message = bodyText
			? `Error al eliminar socio: ${bodyText}`
			: `Error al eliminar socio: status ${response.status}`;
		throw new Error(message);
	}
};
