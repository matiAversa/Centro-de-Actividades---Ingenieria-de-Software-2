const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export type Pago = {
  id?: number;
  mpPaymentId?: number | string;
  monto?: number;
  moneda?: string;
  fechaPago?: string;
  estado?: string;
  metodo?: string;
  clase?: {
    id?: number;
    actividad?: {
      nombre?: string;
    } | null;
  } | null;
};

export const obtenerPagosPorSocio = async (
  socioId: number
): Promise<Pago[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/pagos/socio/${socioId}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener pagos");
  }

  return response.json();
};