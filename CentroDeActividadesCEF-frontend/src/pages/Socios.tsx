import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AddSocioModal from "../components/AddSocioModal";
import "../styles/socios.css";

type Socio = {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  cuota: string;
  estado: string;
};

const SOCIOS_INICIALES: Socio[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@email.com",
    cuota: "Al día",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "María Gómez",
    email: "maria@email.com",
    cuota: "Pendiente",
    estado: "Activo",
  },
];

function Socios() {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [
    socioSeleccionado,
    setSocioSeleccionado,
  ] = useState<Socio | null>(
    null
  );

  const [search, setSearch] =
    useState("");

  const [socios, setSocios] =
    useState<Socio[]>(() => {
      const saved =
        localStorage.getItem(
          "socios"
        );

      return saved
        ? JSON.parse(saved)
        : SOCIOS_INICIALES;
    });

  useEffect(() => {
    localStorage.setItem(
      "socios",
      JSON.stringify(
        socios
      )
    );
  }, [socios]);

  const guardarSocio = (
    socio: Socio
  ) => {
    if (socio.id) {
      setSocios(
        socios.map((s) =>
          s.id === socio.id
            ? {
                ...s,
                ...socio,
              }
            : s
        )
      );
    } else {
      const nuevoSocio = {
        id:
          socios.length > 0
            ? Math.max(
                ...socios.map(
                  (s) => s.id
                )
              ) + 1
            : 1,

        nombre:
          socio.nombre,

        email:
          socio.email,

        telefono:
          socio.telefono,

        fechaNacimiento:
          socio.fechaNacimiento,

        cuota:
          "Pendiente",

        estado:
          "Activo",
      };

      setSocios([
        ...socios,
        nuevoSocio,
      ]);
    }

    setSocioSeleccionado(
      null
    );
  };

  const eliminarSocio = (
    id: number
  ) => {
    const confirmar =
      window.confirm(
        "¿Eliminar socio?"
      );

    if (!confirmar)
      return;

    setSocios(
      socios.filter(
        (s) =>
          s.id !== id
      )
    );
  };

  const sociosFiltrados =
    socios.filter(
      (socio) =>
        socio.nombre
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        socio.email
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
            Gestión de Socios
          </h2>

          <button
            className="add-socio-btn"
            onClick={() => {
              setSocioSeleccionado(
                null
              );

              setIsModalOpen(
                true
              );
            }}
          >
            + Agregar socio
          </button>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Buscar socio..."
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
              <th>Nombre</th>
              <th>Email</th>
              <th>Cuota</th>
              <th>Estado</th>
              <th>
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {sociosFiltrados.map(
              (socio) => (
                <tr
                  key={socio.id}
                >
                  <td>
                    {socio.id}
                  </td>

                  <td>
                    {
                      socio.nombre
                    }
                  </td>

                  <td>
                    {
                      socio.email
                    }
                  </td>

                  <td>
                    {
                      socio.cuota
                    }
                  </td>

                  <td>
                    <span
                      className={
                        socio.estado ===
                        "Activo"
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {
                        socio.estado
                      }
                    </span>
                  </td>

                  <td>
                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setSocioSeleccionado(
                            socio
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
                          eliminarSocio(
                            socio.id
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

        <AddSocioModal
          isOpen={
            isModalOpen
          }
          onClose={() =>
            setIsModalOpen(
              false
            )
          }
          onSaveSocio={(socio: unknown) =>
            guardarSocio(socio as Socio)
          }
          socioToEdit={
            socioSeleccionado
          }
        />
      </div>
    </Layout>
  );
}

export default Socios;