import UserLayout from "../components/UserLayout";
import { useApp } from "../context/useApp";
import "../styles/clases.css";
import type { ReactElement } from "react";

interface Actividad {
  id: number;
  nombre: string;
  profesor: string;
  horario: string;
  cupos: number;
}

interface UseAppReturn {
  actividades: Actividad[];
  reservarClase: (id: number) => void;
  yaReservada: (id: number) => boolean;
}

function Clases(): ReactElement {
  const {
    actividades,
    reservarClase,
    yaReservada,
  } = useApp() as UseAppReturn;

  return (
    <UserLayout>
      <div className="dashboard-content">
        <h2>
          Actividades disponibles
        </h2>

        <div className="clases-grid">
          {actividades.map(
            (actividad: Actividad) => {
              const reservada =
                yaReservada(
                  actividad.id
                );

              return (
                <div
                  key={
                    actividad.id
                  }
                  className="clase-card"
                >
                  <h3>
                    {
                      actividad.nombre
                    }
                  </h3>

                  <p>
                    Profesor:{" "}
                    {
                      actividad.profesor
                    }
                  </p>

                  <p>
                    Horario:{" "}
                    {
                      actividad.horario
                    }
                  </p>

                  <p>
                    Cupos:{" "}
                    {
                      actividad.cupos
                    }
                  </p>

                  <button
                    disabled={
                      actividad.cupos ===
                        0 ||
                      reservada
                    }
                    onClick={() =>
                      reservarClase(
                        actividad.id
                      )
                    }
                  >
                    {reservada
                      ? "Reservado"
                      : actividad.cupos >
                        0
                      ? "Reservar"
                      : "Completo"}
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
    </UserLayout>
  );
}

export default Clases;