import type { Socio } from "./socioService";
import type { Actividad } from "./actividadService";

const API_URL = "http://localhost:8080/api/inscripciones";

export type Inscripcion = {
  id?: number;
  socio: Socio;
  actividad: Actividad;
  fechaInscripcion: string;
};

export const obtenerInscripciones = async (): Promise<Inscripcion[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener inscripciones");
  }

  return response.json();
};

export const crearInscripcion = async (
  socioId: number,
  actividadId: number
): Promise<Inscripcion> => {
  const response = await fetch(
    `${API_URL}?socioId=${socioId}&actividadId=${actividadId}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const mensaje = await response.text();
    throw new Error(mensaje || "Error al crear inscripción");
  }

  return response.json();
};

export const eliminarInscripcionApi = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar inscripción");
  }
};