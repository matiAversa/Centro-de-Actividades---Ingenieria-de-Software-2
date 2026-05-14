import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

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
  precio: number;
}

interface LocationState {
  clase?: Clase;
}

// Reemplazá con tu Public Key (la que empieza con APP_USR-...)
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' });

function PagarClase() {
  const location = useLocation();
  const { clase } = (location.state || {}) as LocationState;
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generarPreferencia = async () => {
      if (!clase) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/pagos/crear-preferencia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: `Inscripción a ${clase.actividad.nombre}`,
            precio: clase.precio,
          }),
        });

        if (response.ok) {
          const id = await response.text();
          setPreferenceId(id);
        } else {
          console.error("Error al obtener la preferencia");
        }
      } catch (error) {
        console.error("Error de red:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generarPreferencia();
  }, [clase]);

  return (
    <UserLayout>
      <div className="dashboard-content">
        <h2>Pagar clase</h2>
        <p>
          Tu inscripción está pendiente de pago. Desde acá podés continuar con
          la gestión de tu clase.
        </p>

        {clase && (
          <div style={{ marginTop: "12px", marginBottom: "12px" }}>
            <p><strong>Clase:</strong> {clase.actividad.nombre}</p>
            <p><strong>Profesor:</strong> {clase.profesor}</p>
            <p><strong>Precio:</strong> ${clase.precio}</p>
          </div>
        )}

        {!clase && (
          <p style={{ color: "red" }}>
            No se recibió información de la clase. Volvé a inscribirte desde el listado.
          </p>
        )}

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          {isLoading ? (
            <p>Cargando opciones de pago...</p>
          ) : preferenceId ? (
            /* Este es el botón oficial de Mercado Pago */
            <Wallet initialization={{ preferenceId }} />
          ) : (
            <p style={{ color: 'red' }}>No se pudo cargar el botón de pago. Reintentá más tarde.</p>
          )}
        </div>

        <Link to="/mis-inscripciones" className="btn-volver">
          Volver a mis inscripciones
        </Link>
      </div>
    </UserLayout>
  );
}

export default PagarClase;