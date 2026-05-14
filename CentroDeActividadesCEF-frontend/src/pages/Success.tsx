import { Link } from "react-router-dom";
import UserLayout from "../components/UserLayout";

function Success() {
  return (
    <UserLayout>
      <div className="dashboard-content">
        <h2>pago aprobado</h2>

        <Link to="/home">Volver al menu</Link>
      </div>
    </UserLayout>
  );
}

export default Success;