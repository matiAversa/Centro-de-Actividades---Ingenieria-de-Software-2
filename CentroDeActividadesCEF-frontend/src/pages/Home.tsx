import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../context/useAuth";
import "../styles/dashboard.css";

interface Actividad {
  id: number;
  nombre: string;
}

interface Clase {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  profesor: string;
  cupoMaximo: number;
  cuposDisponibles: number;
  estado: string;
  actividad: Actividad;
}

interface Inscripcion {
  id: number;
  clase: Clase;
  fechaInscripcion: string;
}

function Home() {
  const { user } = useAuth();
  const socioId = user?.socioId;

  const [clases, setClases] = useState<Clase[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socioId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [clasesRes, inscripcionesRes] = await Promise.all([
          fetch("http://localhost:8080/api/clases/proximas"),
          fetch(`http://localhost:8080/api/inscripciones/socio/${socioId}`),
        ]);

        if (!clasesRes.ok) {
          throw new Error("Error al cargar clases");
        }

        if (!inscripcionesRes.ok) {
          throw new Error("Error al cargar inscripciones");
        }

        const clasesData = await clasesRes.json();
        const inscripcionesData = await inscripcionesRes.json();

        setClases(clasesData);
        setInscripciones(inscripcionesData);
      } catch (error) {
        console.error("Error al cargar el home del socio:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [socioId]);

  const proximaInscripcion = inscripciones
    .filter((inscripcion) => inscripcion.clase?.fecha)
    .sort((a, b) => {
      const fechaA = new Date(
        `${a.clase.fecha}T${a.clase.horaInicio}`
      );

      const fechaB = new Date(
        `${b.clase.fecha}T${b.clase.horaInicio}`
      );

      return fechaA.getTime() - fechaB.getTime();
    })[0];

  const proximaClase =
    proximaInscripcion?.clase?.actividad?.nombre || "Sin clases";

  return (
    <UserLayout>
      <div className="dashboard-content">
        <h2>Bienvenido al CEF</h2>

        {loading ? (
          <p>Cargando resumen...</p>
        ) : !socioId ? (
          <p>No se encontró el socio logueado.</p>
        ) : (
          <div className="cards-grid">
            <DashboardCard
              title="Clases disponibles"
              value={String(clases.length)}
            />

            <DashboardCard
              title="Mis reservas"
              value={String(inscripciones.length)}
            />

            <DashboardCard
              title="Pagos pendientes"
              value="0"
            />

            <DashboardCard
              title="Próxima clase"
              value={proximaClase}
            />
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Home;