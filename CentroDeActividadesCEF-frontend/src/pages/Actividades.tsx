import { useState } from "react";
import Layout from "../components/Layout";
import AddActividadModal from "../components/AddActividadModal";
import { useApp } from "../context/useApp";
import "../styles/actividades.css";

function Actividades() {
  const {
    actividades,
    guardarActividad,
    eliminarActividad,
  } = useApp();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [
    actividadSeleccionada,
    setActividadSeleccionada,
  ] = useState<
    (typeof actividades)[number] | null
  >(null);

  const [search, setSearch] =
    useState("");

  const actividadesFiltradas =
    actividades.filter(
      (actividad) =>
        actividad.nombre
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        actividad.profesor
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <Layout>
      <div className="socios-container">
        <div className="socios-header">
          <h2>
            Gestión de
            Actividades
          </h2>

          <button
            className="add-socio-btn"
            onClick={() => {
              setActividadSeleccionada(
                null
              );

              setIsModalOpen(
                true
              );
            }}
          >
            + Agregar
            actividad
          </button>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Buscar actividad..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <table className="socios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>
                Actividad
              </th>
              <th>
                Profesor
              </th>
              <th>
                Horario
              </th>
              <th>
                Cupos
              </th>
              <th>
                Estado
              </th>
              <th>
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {actividadesFiltradas.map(
              (
                actividad
              ) => (
                <tr
                  key={
                    actividad.id
                  }
                >
                  <td>
                    {
                      actividad.id
                    }
                  </td>

                  <td>
                    {
                      actividad.nombre
                    }
                  </td>

                  <td>
                    {
                      actividad.profesor
                    }
                  </td>

                  <td>
                    {
                      actividad.horario
                    }
                  </td>

                  <td>
                    {
                      actividad.cupos
                    }
                  </td>

                  <td>
                    <span
                      className={
                        actividad.cupos >
                        0
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {actividad.cupos >
                      0
                        ? "Disponible"
                        : "Completo"}
                    </span>
                  </td>

                  <td>
                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setActividadSeleccionada(
                            actividad
                          );

                          setIsModalOpen(
                            true
                          );
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          eliminarActividad(
                            actividad.id
                          )
                        }
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <AddActividadModal
          isOpen={
            isModalOpen
          }
          onClose={() =>
            setIsModalOpen(
              false
            )
          }
          onSaveActividad={(
            actividad
          ) => {
            guardarActividad(
              {
                ...actividad,
                id: Number(
                  actividad.id
                ),
              }
            );

            setIsModalOpen(
              false
            );
          }}
          actividadToEdit={
            actividadSeleccionada
          }
        />
      </div>
    </Layout>
  );
}

export default Actividades;