import Layout from "../components/Layout";
import "../styles/pagos.css";

function Pagos() {
  const pagos = [
    {
      id: 1,
      socio: "Juan Pérez",
      monto: "$25.000",
      vencimiento: "15/05/2026",
      metodo: "Transferencia",
      estado: "Pagado",
    },
    {
      id: 2,
      socio: "María Gómez",
      monto: "$25.000",
      vencimiento: "15/05/2026",
      metodo: "Pendiente",
      estado: "Pendiente",
    },
    {
      id: 3,
      socio: "Carlos Ruiz",
      monto: "$25.000",
      vencimiento: "10/05/2026",
      metodo: "No registrado",
      estado: "Vencido",
    },
  ];

  return (
    <Layout>
      <div className="pagos-container">
        <div className="pagos-header">
          <h2>Gestión de Pagos</h2>

          <button>
            + Registrar pago
          </button>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Buscar pago..."
        />

        <table className="pagos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Socio</th>
              <th>Monto</th>
              <th>Vencimiento</th>
              <th>Método</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.id}</td>
                <td>{pago.socio}</td>
                <td>{pago.monto}</td>
                <td>{pago.vencimiento}</td>
                <td>{pago.metodo}</td>

                <td>
                  <span
                    className={`status ${pago.estado.toLowerCase()}`}
                  >
                    {pago.estado}
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

export default Pagos;