const API_URL = "http://localhost:8080/api/actividades";

export type Actividad = {
  id?: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
};

export const obtenerActividades = async (): Promise<Actividad[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener actividades");
  }

  return response.json();
};

export const crearActividad = async (
  actividad: Omit<Actividad, "id">
): Promise<Actividad> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(actividad),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error backend crear actividad:", errorText);
    throw new Error("Error al crear actividad");
  }

  return response.json();
};

export const actualizarActividad = async (
  id: number,
  actividad: Actividad
): Promise<Actividad> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(actividad),
  });

  if (!response.ok) {
  const errorText = await response.text();
  console.error("Error backend actualizar actividad:", errorText);
  throw new Error("Error al actualizar actividad");
}

  return response.json();
};

export const eliminarActividadApi = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar actividad");
  }
};