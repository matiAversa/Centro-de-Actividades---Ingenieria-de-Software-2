import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../styles/socios.css";

import {
  obtenerSocios,
  type Socio,
} from "../services/socioService";

import {
  obtenerActividades,
  type Actividad,
} from "../services/actividadService";

import {
  obtenerInscripciones,
  crearInscripcion,
  eliminarInscripcionApi,
  type Inscripcion,
} from "../services/inscripcionService";

function Inscripciones() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  const [socioId, setSocioId] = useState("");
  const [actividadId, setActividadId] = useState("");

  const cargarDatos = async () => {
    try {
      const [sociosData, actividadesData, inscripcionesData] =
        await Promise.all([
          obtenerSocios(),
          obtenerActividades(),
          obtenerInscripciones(),
        ]);

      setSocios(sociosData);
      setActividades(actividadesData);
      setInscripciones(inscripcionesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos();
  }, []);

  const handleInscribir = async () => {
    if (!socioId || !actividadId) {
      alert("Seleccioná un socio y una actividad");
      return;
    }

    try {
      await crearInscripcion(Number(socioId), Number(actividadId));

      setSocioId("");
      setActividadId("");

      await cargarDatos();
    } catch (error) {
      console.error("Error inscribiendo:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("No se pudo crear la inscripción");
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
    } catch (error) {
      console.error("Error eliminando inscripción:", error);
      alert("No se pudo cancelar la inscripción");
    }
  };

  return (
    <Layout>
      <div className="socios-container">
        <div className="socios-header">
          <h2>Inscripciones</h2>
        </div>

        <div className="form-row">
          <select
            value={socioId}
            onChange={(e) => setSocioId(e.target.value)}
          >
            <option value="">Seleccionar socio</option>

            {socios.map((socio) => (
              <option key={socio.id} value={socio.id}>
                {socio.nombre} - {socio.email}
              </option>
            ))}
          </select>

          <select
            value={actividadId}
            onChange={(e) => setActividadId(e.target.value)}
          >
            <option value="">Seleccionar actividad</option>

            {actividades.map((actividad) => (
              <option key={actividad.id} value={actividad.id}>
                {actividad.nombre} - {actividad.horario} - Cupos:{" "}
                {actividad.cupos}
              </option>
            ))}
          </select>

          <button className="add-socio-btn" onClick={handleInscribir}>
            Inscribir
          </button>
        </div>

        <table className="socios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Socio</th>
              <th>Email</th>
              <th>Actividad</th>
              <th>Horario</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {inscripciones.map((inscripcion) => (
              <tr key={inscripcion.id}>
                <td>{inscripcion.id}</td>
                <td>{inscripcion.socio?.nombre}</td>
                <td>{inscripcion.socio?.email}</td>
                <td>{inscripcion.actividad?.nombre}</td>
                <td>{inscripcion.actividad?.horario}</td>
                <td>{inscripcion.fechaInscripcion}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleEliminar(inscripcion.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Inscripciones;