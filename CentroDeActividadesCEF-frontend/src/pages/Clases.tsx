import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import "../styles/clases.css";
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

interface Socio {
  id: number;
}

interface Inscripcion {
  id: number;
  socio: Socio;
  clase: Clase;
  fechaInscripcion: string;
}

function Clases() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [inscribiendoId, setInscribiendoId] = useState<number | null>(null);
  const [inscribiendoMensualId, setInscribiendoMensualId] =
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

      const [clasesResponse, inscripcionesResponse] = await Promise.all([
        fetch("http://localhost:8080/api/clases/proximas"),
        fetch("http://localhost:8080/api/inscripciones"),
      ]);

      if (!clasesResponse.ok) {
        throw new Error("Error al obtener clases");
      }

      if (!inscripcionesResponse.ok) {
        throw new Error("Error al obtener inscripciones");
      }

      const clasesData: Clase[] = await clasesResponse.json();
      const inscripcionesData: Inscripcion[] =
        await inscripcionesResponse.json();

      setClases(clasesData);
      setInscripciones(inscripcionesData);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar las clases");
    } finally {
      setLoading(false);
    }
  };

  const estaInscripto = (claseId: number) => {
    return inscripciones.some(
      (inscripcion) =>
        inscripcion.socio.id === socioId &&
        inscripcion.clase?.id === claseId
    );
  };

  const tieneHorarioOcupado = (clase: Clase) => {
    return inscripciones.some(
      (inscripcion) =>
        inscripcion.socio.id === socioId &&
        inscripcion.clase?.fecha === clase.fecha &&
        inscripcion.clase?.horaInicio === clase.horaInicio &&
        inscripcion.clase?.id !== clase.id
    );
  };

  const puedeInscribirse = (clase: Clase) => {
    return (
      clase.cuposDisponibles > 0 &&
      !estaInscripto(clase.id) &&
      !tieneHorarioOcupado(clase) &&
      inscribiendoId !== clase.id
    );
  };

  const obtenerTextoBoton = (clase: Clase) => {
    if (inscribiendoId === clase.id) return "Inscribiendo...";
    if (estaInscripto(clase.id)) return "Inscripto ✓";
    if (tieneHorarioOcupado(clase)) return "Horario ocupado";
    if (clase.cuposDisponibles === 0) return "Completo";

    return "Inscribirme";
  };

  const obtenerInicioMes = (fecha: string) => {
    const date = new Date(`${fecha}T00:00:00`);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return `${year}-${String(month).padStart(2, "0")}-01`;
  };

  const obtenerFinMes = (fecha: string) => {
    const date = new Date(`${fecha}T00:00:00`);
    const year = date.getFullYear();
    const month = date.getMonth();

    const finMes = new Date(year, month + 1, 0);

    return `${finMes.getFullYear()}-${String(
      finMes.getMonth() + 1
    ).padStart(2, "0")}-${String(finMes.getDate()).padStart(2, "0")}`;
  };

  const inscribirse = async (claseId: number) => {
    try {
      setInscribiendoId(claseId);

      const response = await fetch(
        `http://localhost:8080/api/inscripciones?socioId=${socioId}&claseId=${claseId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(mensaje || "No se pudo realizar la inscripción");
      }

      alert("Inscripción realizada correctamente");
      cargarDatos();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error al inscribirse");
      }
    } finally {
      setInscribiendoId(null);
    }
  };

  const inscribirseAlMes = async (clase: Clase) => {
    const confirmar = window.confirm(
      `¿Querés inscribirte al mes completo de ${clase.actividad?.nombre}?`
    );

    if (!confirmar) return;

    try {
      setInscribiendoMensualId(clase.id);

      const response = await fetch(
        "http://localhost:8080/api/inscripciones/mensual",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            socioId,
            actividadId: clase.actividad.id,
            fechaInicio: obtenerInicioMes(clase.fecha),
            fechaFin: obtenerFinMes(clase.fecha),
          }),
        }
      );

      if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(mensaje || "No se pudo realizar la inscripción mensual");
      }

      alert("Inscripción mensual realizada correctamente");
      cargarDatos();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Error al inscribirse al mes");
      }
    } finally {
      setInscribiendoMensualId(null);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(`${fecha}T00:00:00`);

    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const clasesAgrupadas = clases.reduce<Record<string, Clase[]>>(
    (grupos, clase) => {
      if (!grupos[clase.fecha]) {
        grupos[clase.fecha] = [];
      }

      grupos[clase.fecha].push(clase);
      return grupos;
    },
    {}
  );

  const fechasOrdenadas = Object.keys(clasesAgrupadas).sort();

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
        <h2>Calendario de clases</h2>

        {loading ? (
          <p>Cargando clases...</p>
        ) : fechasOrdenadas.length === 0 ? (
          <p>No hay clases disponibles.</p>
        ) : (
          <div className="calendario-clases">
            {fechasOrdenadas.map((fecha) => (
              <section key={fecha} className="dia-clases">
                <h3>{formatearFecha(fecha)}</h3>

                <div className="clases-grid">
                  {clasesAgrupadas[fecha]
                    .sort((a, b) =>
                      a.horaInicio.localeCompare(b.horaInicio)
                    )
                    .map((clase) => (
                      <div key={clase.id} className="clase-card">
                        <h4>{clase.actividad?.nombre}</h4>

                        <p>
                          <strong>Profesor:</strong> {clase.profesor}
                        </p>

                        <p>
                          <strong>Horario:</strong>{" "}
                          {clase.horaInicio.slice(0, 5)} -{" "}
                          {clase.horaFin.slice(0, 5)}
                        </p>

                        <p>
                          <strong>Cupos:</strong> {clase.cuposDisponibles}/
                          {clase.cupoMaximo}
                        </p>

                        {tieneHorarioOcupado(clase) &&
                          !estaInscripto(clase.id) && (
                            <p className="warning-text">
                              Ya tenés una clase en ese horario.
                            </p>
                          )}

                        <div className="class-actions">
                          <button
                            disabled={!puedeInscribirse(clase)}
                            onClick={() => inscribirse(clase.id)}
                          >
                            {obtenerTextoBoton(clase)}
                          </button>

                          <button
                            className="secondary-btn"
                            disabled={
                              inscribiendoMensualId === clase.id ||
                              estaInscripto(clase.id)
                            }
                            onClick={() => inscribirseAlMes(clase)}
                          >
                            {inscribiendoMensualId === clase.id
                              ? "Inscribiendo mes..."
                              : "Inscribirme al mes"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Clases;