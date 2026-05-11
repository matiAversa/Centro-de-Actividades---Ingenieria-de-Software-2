import Layout from "../components/Layout";
import "../styles/reservas.css";

function Reservas() {
  const reservas = [
    {
      id: 1,
      socio: "Juan Pérez",
      actividad: "Spinning",
      fecha: "12/05/2026",
      horario: "18:00",
      estado: "Confirmada",
    },
    {
      id: 2,
      socio: "María Gómez",
      actividad: "Yoga",
      fecha: "13/05/2026",
      horario: "16:00",
      estado: "Pendiente",
    },
    {
      id: 3,
      socio: "Carlos Ruiz",
      actividad: "Musculación",
      fecha: "14/05/2026",
      horario: "08:00",
      estado: "Cancelada",
    },
  ];

  return (
    <Layout>
      <div className="reservas-container">
        <div className="reservas-header">
          <h2>Gestión de Reservas</h2>

          <button>
            + Nueva reserva
          </button>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Buscar reserva..."
        />

        <table className="reservas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Socio</th>
              <th>Actividad</th>
              <th>Fecha</th>
              <th>Horario</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.socio}</td>
                <td>{reserva.actividad}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.horario}</td>

                <td>
                  <span
                    className={`status ${reserva.estado.toLowerCase()}`}
                  >
                    {reserva.estado}
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

export default Reservas;