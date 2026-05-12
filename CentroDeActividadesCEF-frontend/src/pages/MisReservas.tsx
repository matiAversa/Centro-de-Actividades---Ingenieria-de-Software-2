import UserLayout from "../components/UserLayout";
import { useApp } from "../context/useApp";

function MisReservas() {
  const {
    reservas,
    cancelarReserva,
  } = useApp();

  return (
    <UserLayout>
      <div className="dashboard-content">
        <h2>Mis Reservas</h2>

        {reservas.length ===
        0 ? (
          <p>
            No tenés reservas
          </p>
        ) : (
          <table className="socios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>
                  Actividad
                </th>
                <th>
                  Horario
                </th>
                <th>
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {reservas.map(
                (
                  reserva
                ) => (
                  <tr
                    key={
                      reserva.id
                    }
                  >
                    <td>
                      {
                        reserva.id
                      }
                    </td>

                    <td>
                      {
                        reserva.actividad
                      }
                    </td>

                    <td>
                      {
                        reserva.horario
                      }
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          cancelarReserva(
                            reserva.id
                          )
                        }
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </UserLayout>
  );
}

export default MisReservas;