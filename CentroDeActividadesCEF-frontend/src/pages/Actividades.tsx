import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AddActividadModal from "../components/AddActividadModal";
import Spinner from "../components/Spinner";
import "../styles/actividades.css";

import {
  obtenerActividades,
  crearActividad,
  actualizarActividad,
  eliminarActividadApi,
  type Actividad,
} from "../services/actividadService";

type ActividadFormulario = Omit<Actividad, "id"> & {
  id?: string | number;
};

function Actividades() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] =
    useState<ActividadFormulario | null>(null);
  const [search, setSearch] = useState("");
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarActividades = async () => {
    setLoading(true);

    try {
      const data = await obtenerActividades();
      setActividades(data);
    } catch (error) {
      console.error("Error cargando actividades:", error);
      alert("No se pudieron cargar las actividades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargarActividades();
  }, []);

  const guardarActividad = async (actividad: ActividadFormulario) => {
    const actividadServicio: Actividad = {
      ...actividad,
      id:
        typeof actividad.id === "string"
          ? Number(actividad.id)
          : actividad.id,
    };

    try {
      if (actividadServicio.id) {
        await actualizarActividad(actividadServicio.id, actividadServicio);
      } else {
        await crearActividad({
          nombre: actividadServicio.nombre,
          descripcion: actividadServicio.descripcion,
          activo: actividadServicio.activo,
        });
      }

      await cargarActividades();
      setActividadSeleccionada(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error guardando actividad:", error);
      alert("No se pudo guardar la actividad");
    }
  };

  const eliminarActividad = async (id?: number) => {
    if (!id) return;

    const confirmar = window.confirm("¿Eliminar actividad?");

    if (!confirmar) return;

    try {
      await eliminarActividadApi(id);
      await cargarActividades();
    } catch (error) {
      console.error("Error eliminando actividad:", error);
      alert("No se pudo eliminar la actividad");
    }
  };

  const actividadesFiltradas = actividades.filter((actividad) => {
    const texto = search.toLowerCase();

    return (
      actividad.nombre.toLowerCase().includes(texto) ||
      actividad.descripcion?.toLowerCase().includes(texto) ||
      (actividad.activo ? "activa" : "inactiva").includes(texto)
    );
  });

  return (
    <Layout>
      <div className="socios-container">
        <div className="socios-header">
          <h2>Gestión de Actividades</h2>

          <button
            className="add-socio-btn"
            onClick={() => {
              setActividadSeleccionada(null);
              setIsModalOpen(true);
            }}
          >
            + Agregar actividad
          </button>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Buscar actividad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <Spinner message="Cargando actividades..." />
        ) : (
          <table className="socios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Actividad</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {actividadesFiltradas.map((actividad) => (
                <tr key={actividad.id}>
                  <td>{actividad.id}</td>

                  <td>{actividad.nombre}</td>

                  <td>{actividad.descripcion || "Sin descripción"}</td>

                  <td>
                    <span
                      className={actividad.activo ? "status active" : "status inactive"}
                    >
                      {actividad.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>

                  <td>
                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setActividadSeleccionada(actividad);
                          setIsModalOpen(true);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => eliminarActividad(actividad.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <AddActividadModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActividadSeleccionada(null);
          }}
          onSaveActividad={(actividad) => guardarActividad(actividad)}
          actividadToEdit={actividadSeleccionada}
        />
      </div>
    </Layout>
  );
}

export default Actividades;