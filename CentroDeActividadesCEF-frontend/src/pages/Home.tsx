import UserLayout from "../components/UserLayout";
import DashboardCard from "../components/DashboardCard";
import "../styles/dashboard.css";

function Home() {
  return (
    <UserLayout>
      <div className="dashboard-content">
        <h2>Bienvenido al CEF</h2>

        <div className="cards-grid">
          <DashboardCard
            title="Clases disponibles"
            value="12"
          />

          <DashboardCard
            title="Mis reservas"
            value="3"
          />

          <DashboardCard
            title="Pagos pendientes"
            value="1"
          />

          <DashboardCard
            title="Próxima clase"
            value="Yoga"
          />
        </div>
      </div>
    </UserLayout>
  );
}

export default Home;