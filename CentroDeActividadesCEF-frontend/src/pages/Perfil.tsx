import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import { useAuth } from "../context/useAuth";
import "../styles/perfil.css";

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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [socio, setSocio] = useState<Socio | null>(null);
  const [loading, setLoading] = useState(true);

  const socioId = user?.socioId;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "ADMIN") {
      setLoading(false);
      return;
    }

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
      setLoading(false);
    }
  }, [user, socioId, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (user?.role === "ADMIN") {
    return (
      <UserLayout>
        <div className="dashboard-content perfil-page">
          <div className="perfil-hero">
            <div className="perfil-identity">
              <div className="perfil-avatar">
                {user.email.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="perfil-kicker">Administrador</p>
                <h2>Perfil de administrador</h2>
                <p className="perfil-subtitle">
                  Herramientas y accesos rápidos de administración.
                </p>
              </div>
            </div>

            <span className="perfil-badge">Administrador</span>
          </div>

          <div className="perfil-grid">
            <section className="perfil-card perfil-card-primary">
              <h3>Datos de administrador</h3>

              <dl className="perfil-details">
                <div>
                  <dt>Correo</dt>
                  <dd>{user.email}</dd>
                </div>

                <div>
                  <dt>Rol</dt>
                  <dd>Administrador</dd>
                </div>
              </dl>
            </section>

            <section className="perfil-card">
              <h3>Acciones rápidas</h3>

              <div className="perfil-actions">
                <button
                  type="button"
                  className="perfil-action-button perfil-action-button-secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Ir al panel
                </button>

                <button
                  type="button"
                  className="perfil-action-button"
                  onClick={() => navigate("/socios")}
                >
                  Gestionar socios
                </button>

                <button
                  type="button"
                  className="perfil-action-button"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            </section>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!socioId) {
    return (
      <UserLayout>
        <div className="dashboard-content">
          <p>Error al obtener el usuario.</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="dashboard-content perfil-page">
        <div className="perfil-hero">
          <div className="perfil-identity">
            <div className="perfil-avatar">
              {socio?.nombre?.charAt(0).toUpperCase() ??
                user?.email?.charAt(0).toUpperCase() ??
                "U"}
            </div>

            <div>
              <p className="perfil-kicker">Cuenta activa</p>
              <h2>Mi Perfil</h2>
              <p className="perfil-subtitle">
                Revisá tu información personal asociada al gimnasio.
              </p>
            </div>
          </div>

          <span className="perfil-badge">Socio</span>
        </div>

        {loading ? (
          <p>Cargando perfil...</p>
        ) : !socio ? (
          <p>No se encontró información del socio.</p>
        ) : (
          <div className="perfil-grid">
            <section className="perfil-card perfil-card-primary">
              <h3>Datos personales</h3>

              <dl className="perfil-details">
                <div>
                  <dt>Nombre</dt>
                  <dd>{socio.nombre}</dd>
                </div>

                <div>
                  <dt>Correo electrónico</dt>
                  <dd>{socio.email}</dd>
                </div>

                <div>
                  <dt>Teléfono</dt>
                  <dd>{socio.telefono || "Sin cargar"}</dd>
                </div>

                <div>
                  <dt>Fecha de nacimiento</dt>
                  <dd>{socio.fechaNacimiento || "Sin cargar"}</dd>
                </div>

                <div>
                  <dt>Cuota</dt>
                  <dd>{socio.cuota || "Sin cargar"}</dd>
                </div>

                <div>
                  <dt>Estado</dt>
                  <dd>{socio.estado || "Sin cargar"}</dd>
                </div>
              </dl>
            </section>

            <section className="perfil-card">
              <h3>Atajos</h3>

              <p className="perfil-helper-text">
                Usá estos accesos rápidos para seguir navegando.
              </p>

              <div className="perfil-actions">
                <button
                  type="button"
                  className="perfil-action-button perfil-action-button-secondary"
                  onClick={() => navigate("/home")}
                >
                  Ir al inicio
                </button>

                <button
                  type="button"
                  className="perfil-action-button"
                  onClick={() => navigate("/clases")}
                >
                  Ver clases
                </button>

                <button
                  type="button"
                  className="perfil-action-button"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Perfil;