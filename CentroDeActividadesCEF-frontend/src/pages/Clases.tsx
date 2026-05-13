import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import "../styles/clases.css";
import { useAuth } from "../context/useAuth";

interface Actividad {
  id: number;
  nombre: string;
  profesor: string;
  horario: string;
  cupos: number;
}

interface Socio {
  id: number;
  nombre: string;
}

interface Inscripcion {
  id: number;
  socio: Socio;
  actividad: Actividad;
  fechaInscripcion: string;
}

function Clases() {
  const [actividades, setActividades] =
    useState<Actividad[]>([]);

  const [inscripciones, setInscripciones] =
    useState<Inscripcion[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [inscribiendoId, setInscribiendoId] =
    useState<number | null>(null);

  const { user } = useAuth();
  const socioId = user?.socioId;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [
        actividadesResponse,
        inscripcionesResponse,
      ] = await Promise.all([
        fetch(
          "http://localhost:8080/api/actividades"
        ),
        fetch(
          "http://localhost:8080/api/inscripciones"
        ),
      ]);

      if (!actividadesResponse.ok) {
        throw new Error(
          "Error al obtener actividades"
        );
      }

      if (!inscripcionesResponse.ok) {
        throw new Error(
          "Error al obtener inscripciones"
        );
      }

      const actividadesData: Actividad[] =
        await actividadesResponse.json();

      const inscripcionesData: Inscripcion[] =
        await inscripcionesResponse.json();

      setActividades(actividadesData);
      setInscripciones(inscripcionesData);
    } catch (error) {
      console.error(error);
      alert(
        "No se pudieron cargar las clases disponibles"
      );
    } finally {
      setLoading(false);
    }
  };

  const estaInscripto = (
    actividadId: number
  ) => {
    return inscripciones.some(
      (inscripcion) =>
        inscripcion.socio.id === socioId &&
        inscripcion.actividad.id ===
          actividadId
    );
  };

  const tieneHorarioOcupado = (
    actividad: Actividad
  ) => {
    return inscripciones.some(
      (inscripcion) =>
        inscripcion.socio.id === socioId &&
        inscripcion.actividad.horario.toLowerCase() ===
          actividad.horario.toLowerCase() &&
        inscripcion.actividad.id !==
          actividad.id
    );
  };

  const obtenerTextoBoton = (
    actividad: Actividad
  ) => {
    if (inscribiendoId === actividad.id) {
      return "Inscribiendo...";
    }

    if (estaInscripto(actividad.id)) {
      return "Ya inscripto";
    }

    if (tieneHorarioOcupado(actividad)) {
      return "Horario ocupado";
    }

    if (actividad.cupos === 0) {
      return "Completo";
    }

    return "Inscribirme";
  };

  const puedeInscribirse = (
    actividad: Actividad
  ) => {
    return (
      actividad.cupos > 0 &&
      !estaInscripto(actividad.id) &&
      !tieneHorarioOcupado(actividad) &&
      inscribiendoId !== actividad.id
    );
  };

  const inscribirse = async (
    actividadId: number
  ) => {
    try {
      setInscribiendoId(actividadId);

      const response = await fetch(
        `http://localhost:8080/api/inscripciones?socioId=${socioId}&actividadId=${actividadId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const mensaje =
          await response.text();

        throw new Error(
          mensaje ||
            "No se pudo realizar la inscripción"
        );
      }

      alert(
        "Inscripción realizada correctamente"
      );

      cargarDatos();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(
          "Error al inscribirse"
        );
      }
    } finally {
      setInscribiendoId(null);
    }
  };

    if (!socioId) {
      return (
        <UserLayout>
          <p>Error al obtener el usuario.</p>
        </UserLayout>
      );
    }

  return (
    <UserLayout>
      <div className="dashboard-content">
        <h2>Clases disponibles</h2>

        {loading ? (
          <p>Cargando clases...</p>
        ) : (
          <div className="clases-grid">
            {actividades.map((actividad) => (
              <div
                key={actividad.id}
                className="clase-card"
              >
                <h3>{actividad.nombre}</h3>

                <p>
                  <strong>Profesor:</strong>{" "}
                  {actividad.profesor}
                </p>

                <p>
                  <strong>Horario:</strong>{" "}
                  {actividad.horario}
                </p>

                <p>
                  <strong>Cupos:</strong>{" "}
                  {actividad.cupos}
                </p>

                {tieneHorarioOcupado(
                  actividad
                ) &&
                  !estaInscripto(
                    actividad.id
                  ) && (
                    <p className="warning-text">
                      Ya tenés una clase en este
                      horario.
                    </p>
                  )}

                <button
                  disabled={
                    !puedeInscribirse(
                      actividad
                    )
                  }
                  onClick={() =>
                    inscribirse(
                      actividad.id
                    )
                  }
                >
                  {obtenerTextoBoton(
                    actividad
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Clases;