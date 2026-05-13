import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../styles/dashboard.css";

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

function CalendarioAdmin() {
  const [actividades, setActividades] =
    useState<Actividad[]>([]);

  const [clases, setClases] = useState<Clase[]>([]);

  const [actividadId, setActividadId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [diaSemana, setDiaSemana] = useState("MONDAY");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [profesor, setProfesor] = useState("");
  const [cupoMaximo, setCupoMaximo] = useState("");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [actividadesRes, clasesRes] =
        await Promise.all([
          fetch("http://localhost:8080/api/actividades"),
          fetch("http://localhost:8080/api/clases"),
        ]);

      const actividadesData =
        await actividadesRes.json();

      const clasesData =
        await clasesRes.json();

      setActividades(actividadesData);
      setClases(clasesData);
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar el calendario");
    } finally {
      setLoading(false);
    }
  };

  const crearClasesRecurrentes = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !actividadId ||
      !fechaInicio ||
      !fechaFin ||
      !diaSemana ||
      !horaInicio ||
      !horaFin ||
      !profesor ||
      !cupoMaximo
    ) {
      alert("Completá todos los campos");
      return;
    }

    try {
      setGuardando(true);

      const response = await fetch(
        "http://localhost:8080/api/clases/recurrentes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actividadId: Number(actividadId),
            fechaInicio,
            fechaFin,
            diaSemana,
            horaInicio: `${horaInicio}:00`,
            horaFin: `${horaFin}:00`,
            profesor,
            cupoMaximo: Number(cupoMaximo),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "No se pudieron crear las clases"
        );
      }

      alert(
        "Clases creadas correctamente"
      );

      setFechaInicio("");
      setFechaFin("");
      setHoraInicio("");
      setHoraFin("");
      setProfesor("");
      setCupoMaximo("");

      cargarDatos();
    } catch (error) {
      console.error(error);
      alert("Error al crear clases recurrentes");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarClase = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta clase?"
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/clases/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo eliminar la clase"
        );
      }

      setClases((prev) =>
        prev.filter((clase) => clase.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la clase");
    }
  };

  return (
    <Layout>
      <div className="dashboard-content">
        <h2>Gestión de calendario</h2>

        <div className="calendar-admin-card">
          <h3>Crear clases recurrentes</h3>

          <form onSubmit={crearClasesRecurrentes}>
            <div className="form-grid">
              <div className="form-field">
                <label>Actividad</label>
                <select
                  value={actividadId}
                  onChange={(e) =>
                    setActividadId(e.target.value)
                  }
                >
                  <option value="">
                    Seleccionar actividad
                  </option>

                  {actividades.map((actividad) => (
                    <option
                      key={actividad.id}
                      value={actividad.id}
                    >
                      {actividad.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Desde</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) =>
                    setFechaInicio(e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Hasta</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) =>
                    setFechaFin(e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Día de la semana</label>
                <select
                  value={diaSemana}
                  onChange={(e) =>
                    setDiaSemana(e.target.value)
                  }
                >
                  <option value="MONDAY">Lunes</option>
                  <option value="TUESDAY">
                    Martes
                  </option>
                  <option value="WEDNESDAY">
                    Miércoles
                  </option>
                  <option value="THURSDAY">
                    Jueves
                  </option>
                  <option value="FRIDAY">
                    Viernes
                  </option>
                  <option value="SATURDAY">
                    Sábado
                  </option>
                  <option value="SUNDAY">
                    Domingo
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label>Hora inicio</label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) =>
                    setHoraInicio(e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Hora fin</label>
                <input
                  type="time"
                  value={horaFin}
                  onChange={(e) =>
                    setHoraFin(e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Profesor</label>
                <input
                  type="text"
                  placeholder="Ej: Manu"
                  value={profesor}
                  onChange={(e) =>
                    setProfesor(e.target.value)
                  }
                />
              </div>

              <div className="form-field">
                <label>Cupo máximo</label>
                <input
                  type="number"
                  placeholder="Ej: 20"
                  value={cupoMaximo}
                  onChange={(e) =>
                    setCupoMaximo(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="calendar-actions">
              <button
                className="primary-btn"
                type="submit"
                disabled={guardando}
              >
                {guardando
                  ? "Creando..."
                  : "Crear clases"}
              </button>
            </div>
          </form>
        </div>

        <div className="table-header-row">
          <h3>Clases cargadas</h3>
        </div>

        {loading ? (
          <p>Cargando clases...</p>
        ) : clases.length === 0 ? (
          <div className="calendar-empty">
            No hay clases cargadas todavía.
          </div>
        ) : (
          <table className="socios-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Profesor</th>
                <th>Cupos</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {clases.map((clase) => (
                <tr key={clase.id}>
                  <td>{clase.actividad?.nombre}</td>

                  <td>{clase.fecha}</td>

                  <td>
                    {clase.horaInicio?.slice(0, 5)} -{" "}
                    {clase.horaFin?.slice(0, 5)}
                  </td>

                  <td>{clase.profesor}</td>

                  <td>
                    {clase.cuposDisponibles}/
                    {clase.cupoMaximo}
                  </td>

                  <td>{clase.estado}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        eliminarClase(clase.id)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default CalendarioAdmin;