import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import "../styles/dashboard.css";

function Dashboard() {
  return (
    <Layout>
      <div className="dashboard-content">
        <h2>Resumen General</h2>

        <div className="cards-grid">
          <DashboardCard
            title="Socios Activos"
            value="320"
          />

          <DashboardCard
            title="Actividades"
            value="18"
          />

          <DashboardCard
            title="Reservas Hoy"
            value="57"
          />

          <DashboardCard
            title="Pagos Pendientes"
            value="12"
          />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;