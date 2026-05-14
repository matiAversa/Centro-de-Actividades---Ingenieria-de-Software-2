import type { Socio } from "./socioService";

const API_URL = "http://localhost:8080/api/inscripciones";

export type ActividadInscripcion = {
  id?: number;
  nombre?: string;
};

export type ClaseInscripcion = {
  id?: number;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  profesor?: string;
  cupoMaximo?: number;
  cuposDisponibles?: number;
  estado?: string;
  actividad?: ActividadInscripcion | null;
};

export type Inscripcion = {
  id?: number;
  socio?: Socio | null;
  clase?: ClaseInscripcion | null;
  fechaInscripcion?: string;
  estadoPago?: string;
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
  claseId: number
): Promise<Inscripcion> => {
  const response = await fetch(
    `${API_URL}?socioId=${socioId}&claseId=${claseId}`,
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