import Layout from "../components/Layout";
import "../styles/actividades.css";

function Actividades() {
  const actividades = [
    {
      id: 1,
      nombre: "Musculación",
      profesor: "Juan Pérez",
      horario: "08:00 - 10:00",
      cupos: 20,
      estado: "Disponible",
    },
    {
      id: 2,
      nombre: "Spinning",
      profesor: "María Gómez",
      horario: "18:00 - 19:00",
      cupos: 12,
      estado: "Completo",
    },
    {
      id: 3,
      nombre: "Yoga",
      profesor: "Carlos Ruiz",
      horario: "16:00 - 17:00",
      cupos: 8,
      estado: "Disponible",
    },
  ];

  return (
    <Layout>
      <div className="actividades-container">
        <div className="actividades-header">
          <h2>Gestión de Actividades</h2>

          <button>
            + Agregar actividad
          </button>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Buscar actividad..."
        />

        <table className="actividades-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Actividad</th>
              <th>Profesor</th>
              <th>Horario</th>
              <th>Cupos</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {actividades.map((actividad) => (
              <tr key={actividad.id}>
                <td>{actividad.id}</td>
                <td>{actividad.nombre}</td>
                <td>{actividad.profesor}</td>
                <td>{actividad.horario}</td>
                <td>{actividad.cupos}</td>

                <td>
                  <span
                    className={
                      actividad.estado ===
                      "Disponible"
                        ? "status available"
                        : "status full"
                    }
                  >
                    {actividad.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Actividades;