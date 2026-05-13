import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import { useAuth } from "../context/useAuth";

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
}

interface Inscripcion {
  id: number;
  clase: Clase;
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
          `http://localhost:8080/api/inscripciones/socio/${socioId}`
        );

        if (!response.ok) {
          throw new Error(
            "Error al obtener inscripciones"
          );
        }

        const data: Inscripcion[] =
          await response.json();

        setInscripciones(data);
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
                <th>Día</th>
                <th>Horario</th>
                <th>Inscripción</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {inscripciones.map(
                (inscripcion) => {
                  const clase =
                    inscripcion.clase;

                  return (
                    <tr key={inscripcion.id}>
                      <td>
                        {
                          clase?.actividad
                            ?.nombre
                        }
                      </td>

                      <td>
                        {clase?.profesor}
                      </td>

                      <td>
                        {clase?.fecha}
                      </td>

                      <td>
                        {clase?.horaInicio?.slice(
                          0,
                          5
                        )}{" "}
                        -{" "}
                        {clase?.horaFin?.slice(
                          0,
                          5
                        )}
                      </td>

                      <td>
                        {inscripcion.fechaInscripcion ||
                          "Sin fecha"}
                      </td>

                      <td>
                        {clase?.estado ||
                          "Activa"}
                      </td>

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
                  );
                }
              )}
            </tbody>
          </table>
        )}
      </div>
    </UserLayout>
  );
}

export default MisInscripciones;