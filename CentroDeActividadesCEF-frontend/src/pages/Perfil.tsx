import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import { useAuth } from "../context/useAuth";

interface Socio {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  cuota: string;
  estado: string;
}

function Perfil() {
  const [socio, setSocio] = useState<Socio | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const socioId = user?.socioId;

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/socios/${socioId}`
        );

        if (!response.ok) {
          throw new Error("No se pudo obtener el perfil");
        }

        const data: Socio = await response.json();

        setSocio(data);
      } catch (error) {
        console.error(error);
        alert("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    if (socioId) {
      obtenerPerfil();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [socioId]);

  

  if (!socioId) {
    return (
      <UserLayout>
        <p>Error al obtener el usuario.</p>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="dashboard-content">
        <h2>Mi Perfil</h2>

        {loading ? (
          <p>Cargando perfil...</p>
        ) : !socio ? (
          <p>No se encontró información del socio.</p>
        ) : (
          <div className="perfil-card">
            <h3>{socio.nombre}</h3>

            <p>
              <strong>Email:</strong> {socio.email}
            </p>

            <p>
              <strong>Teléfono:</strong> {socio.telefono || "Sin cargar"}
            </p>

            <p>
              <strong>Fecha de nacimiento:</strong>{" "}
              {socio.fechaNacimiento || "Sin cargar"}
            </p>

            <p>
              <strong>Cuota:</strong> {socio.cuota || "Sin cargar"}
            </p>

            <p>
              <strong>Estado:</strong> {socio.estado || "Sin cargar"}
            </p>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Perfil;