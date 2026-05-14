import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import "../styles/socios.css";
import "../styles/inscripciones.css";

import { obtenerSocios, type Socio } from "../services/socioService";

import {
  obtenerInscripciones,
  crearInscripcion,
  eliminarInscripcionApi,
  type Inscripcion,
} from "../services/inscripcionService";

interface Actividad {
  id?: number;
  nombre?: string;
}

interface Clase {
  id?: number;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  profesor?: string;
  cupoMaximo?: number;
  cuposDisponibles?: number;
  estado?: string;
  actividad?: Actividad | null;
}

function Inscripciones() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  const [socioId, setSocioId] = useState("");
  const [claseId, setClaseId] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error" | "">("");

  const mostrarMensaje = (texto: string, tipo: "success" | "error") => {
    setMensaje(texto);
    setTipoMensaje(tipo);

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 3500);
  };

  const obtenerClases = async (): Promise<Clase[]> => {
    const response = await fetch("http://localhost:8080/api/clases");

    if (!response.ok) {
      throw new Error("Error al obtener clases");
    }

    return response.json();
  };

  const cargarDatos = useCallback(async () => {
    setLoading(true);

    try {
      const [sociosData, clasesData, inscripcionesData] = await Promise.all([
        obtenerSocios(),
        obtenerClases(),
        obtenerInscripciones(),
      ]);

      setSocios(sociosData);
      setClases(clasesData);
      setInscripciones(inscripcionesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
      mostrarMensaje("No se pudieron cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargarDatos();
  }, [cargarDatos]);

  const obtenerNombreActividad = (clase?: Clase | null) => {
    return clase?.actividad?.nombre || "Actividad sin nombre";
  };

  const obtenerProfesor = (clase?: Clase | null) => {
    return clase?.profesor || "Sin profesor";
  };

  const obtenerHorario = (clase?: Clase | null) => {
    if (!clase?.horaInicio || !clase?.horaFin) return "Sin horario";

    return `${clase.horaInicio.slice(0, 5)} - ${clase.horaFin.slice(0, 5)}`;
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "Sin fecha";

    const date = new Date(`${fecha}T00:00:00`);

    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  };

  const obtenerEstadoPago = (estadoPago?: string) => {
    switch (estadoPago) {
      case "PAGADA":
        return "Pagada";
      case "CANCELADA":
        return "Cancelada";
      default:
        return "Pendiente de pago";
    }
  };

  const obtenerClaseEstadoPago = (estadoPago?: string) => {
    switch (estadoPago) {
      case "PAGADA":
        return "status active";
      case "CANCELADA":
        return "status inactive";
      default:
        return "status pending";
    }
  };

  const clasesOrdenadas = [...clases]
    .filter((clase) => clase.id && clase.fecha && clase.horaInicio)
    .sort((a, b) => {
      const fechaA = new Date(`${a.fecha}T${a.horaInicio}`);
      const fechaB = new Date(`${b.fecha}T${b.horaInicio}`);

      return fechaA.getTime() - fechaB.getTime();
    });

  const handleInscribir = async () => {
    if (!socioId || !claseId) {
      mostrarMensaje("Seleccioná un socio y una clase", "error");
      return;
    }

    const claseSeleccionada = clases.find(
      (clase) => clase.id === Number(claseId)
    );

    if (!claseSeleccionada) {
      mostrarMensaje("La clase seleccionada no existe", "error");
      return;
    }

    if ((claseSeleccionada.cuposDisponibles ?? 0) <= 0) {
      mostrarMensaje(
        "La clase está completa. Más adelante se podrá agregar al socio a una cola de espera.",
        "error"
      );
      return;
    }

    try {
      await crearInscripcion(Number(socioId), Number(claseId));

      setSocioId("");
      setClaseId("");

      await cargarDatos();

      mostrarMensaje("Inscripción creada correctamente", "success");
    } catch (error) {
      console.error("Error inscribiendo:", error);

      if (error instanceof Error) {
        mostrarMensaje(error.message, "error");
      } else {
        mostrarMensaje("No se pudo crear la inscripción", "error");
      }
    }
  };

  const handleEliminar = async (id?: number) => {
    if (!id) return;

    const confirmar = window.confirm("¿Cancelar inscripción?");

    if (!confirmar) return;

    try {
      await eliminarInscripcionApi(id);
      await cargarDatos();

      mostrarMensaje("Inscripción cancelada correctamente", "success");
    } catch (error) {
      console.error("Error eliminando inscripción:", error);
      mostrarMensaje("No se pudo cancelar la inscripción", "error");
    }
  };

  const inscripcionesFiltradas = inscripciones.filter((inscripcion) => {
    const clase = inscripcion.clase;

    const texto = `
      ${inscripcion.socio?.nombre ?? ""}
      ${inscripcion.socio?.email ?? ""}
      ${obtenerNombreActividad(clase)}
      ${obtenerProfesor(clase)}
      ${clase?.fecha ?? ""}
      ${obtenerHorario(clase)}
      ${obtenerEstadoPago(inscripcion.estadoPago)}
    `.toLowerCase();

    return texto.includes(search.toLowerCase());
  });

  return (
  <Layout>
    <div className="inscripciones-container">
      <div className="inscripciones-hero">
        <div>
          <p>Panel administrador</p>
          <h2>Inscripciones</h2>
          <span>
            Administrá las inscripciones de socios a clases, revisá cupos y
            estados de pago.
          </span>
        </div>
      </div>

      {mensaje && <div className={`message-box ${tipoMensaje}`}>{mensaje}</div>}

      {loading ? (
        <Spinner message="Cargando inscripciones..." />
      ) : (
        <>
          <div className="inscripciones-form-card">
            <h3>Nueva inscripción</h3>

            <div className="inscripciones-form-grid">
              <select value={socioId} onChange={(e) => setSocioId(e.target.value)}>
                <option value="">Seleccionar socio</option>

                {socios.map((socio) => (
                  <option key={socio.id} value={socio.id}>
                    {socio.nombre} - {socio.email}
                  </option>
                ))}
              </select>

              <select value={claseId} onChange={(e) => setClaseId(e.target.value)}>
                <option value="">Seleccionar clase</option>

                {clasesOrdenadas.map((clase) => (
                  <option
                    key={clase.id}
                    value={clase.id}
                    disabled={(clase.cuposDisponibles ?? 0) <= 0}
                  >
                    {obtenerNombreActividad(clase)} - {formatearFecha(clase.fecha)} -{" "}
                    {obtenerHorario(clase)} - Cupos: {clase.cuposDisponibles ?? 0}/
                    {clase.cupoMaximo ?? 0}
                    {(clase.cuposDisponibles ?? 0) <= 0 ? " (Completo)" : ""}
                  </option>
                ))}
              </select>

              <button onClick={handleInscribir}>Inscribir</button>
            </div>
          </div>

          <div className="inscripciones-toolbar">
            <input
              type="text"
              placeholder="Buscar por socio, actividad, profesor, fecha o estado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="inscripciones-table-card">
            <table className="inscripciones-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Socio</th>
                  <th>Email</th>
                  <th>Actividad</th>
                  <th>Profesor</th>
                  <th>Fecha</th>
                  <th>Horario</th>
                  <th>Cupos</th>
                  <th>Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {inscripcionesFiltradas.map((inscripcion) => {
                  const clase = inscripcion.clase;

                  return (
                    <tr key={inscripcion.id}>
                      <td>{inscripcion.id}</td>
                      <td>{inscripcion.socio?.nombre || "Sin socio"}</td>
                      <td className="email-cell">
                        {inscripcion.socio?.email || "Sin email"}
                      </td>
                      <td>{obtenerNombreActividad(clase)}</td>
                      <td>{obtenerProfesor(clase)}</td>
                      <td>{formatearFecha(clase?.fecha)}</td>
                      <td>{obtenerHorario(clase)}</td>
                      <td>
                        {clase?.cuposDisponibles ?? "-"} /{" "}
                        {clase?.cupoMaximo ?? "-"}
                      </td>
                      <td>
                        <span
                          className={obtenerClaseEstadoPago(
                            inscripcion.estadoPago
                          )}
                        >
                          {obtenerEstadoPago(inscripcion.estadoPago)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="inscripcion-delete-btn"
                          onClick={() => handleEliminar(inscripcion.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  </Layout>
);
}

export default Inscripciones;