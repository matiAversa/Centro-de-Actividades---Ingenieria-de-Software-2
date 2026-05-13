import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import { useAuth } from "../context/useAuth";

interface Actividad {
  id: number;
  nombre: string;
  profesor: string;
  horario: string;
}

interface Socio {
  id: number;
  nombre: string;
}

interface Inscripcion {
  id: number;
  socio: Socio;
  actividad: Actividad;
  fechaInscripcion?: string;
}

function MisInscripciones() {
  const [inscripciones, setInscripciones] =
    useState<Inscripcion[]>([]);

  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const socioId = user?.socioId;

  useEffect(() => {
    const obtenerInscripciones = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/inscripciones"
        );

        if (!response.ok) {
          throw new Error(
            "Error al obtener inscripciones"
          );
        }

        const data: Inscripcion[] =
          await response.json();

        const inscripcionesDelSocio =
          data.filter(
            (inscripcion) =>
              inscripcion.socio.id === socioId
          );

        setInscripciones(
          inscripcionesDelSocio
        );
      } catch (error) {
        console.error(error);
        alert(
          "No se pudieron cargar tus inscripciones"
        );
      } finally {
        setLoading(false);
      }
    };

    if (socioId) {
      obtenerInscripciones();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [socioId]);


  const cancelarInscripcion = async (
    id: number
  ) => {
    const confirmar = window.confirm(
      "¿Seguro que querés cancelar esta inscripción?"
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/inscripciones/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo cancelar la inscripción"
        );
      }

      setInscripciones((prev) =>
        prev.filter(
          (inscripcion) =>
            inscripcion.id !== id
        )
      );

      alert(
        "Inscripción cancelada correctamente"
      );
    } catch (error) {
      console.error(error);
      alert(
        "Error al cancelar la inscripción"
      );
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
        <h2>Mis Inscripciones</h2>

        {loading ? (
          <p>Cargando inscripciones...</p>
        ) : inscripciones.length === 0 ? (
          <div>
            <p>No tenés inscripciones activas.</p>

            <Link to="/clases">
              Ver clases disponibles
            </Link>
          </div>
        ) : (
          <table className="socios-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Profesor</th>
                <th>Horario</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {inscripciones.map(
                (inscripcion) => (
                  <tr key={inscripcion.id}>
                    <td>
                      {
                        inscripcion.actividad
                          .nombre
                      }
                    </td>

                    <td>
                      {
                        inscripcion.actividad
                          .profesor
                      }
                    </td>

                    <td>
                      {
                        inscripcion.actividad
                          .horario
                      }
                    </td>

                    <td>
                      {inscripcion.fechaInscripcion ||
                        "Sin fecha"}
                    </td>

                    <td>Activa</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          cancelarInscripcion(
                            inscripcion.id
                          )
                        }
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </UserLayout>
  );
}

export default MisInscripciones;