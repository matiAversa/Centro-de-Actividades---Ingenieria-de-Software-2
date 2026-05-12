import {
  createContext,
  useEffect,
  useState,
} from "react";

type Actividad = {
  id: number;
  nombre: string;
  profesor: string;
  horario: string;
  cupos: number;
  estado?: string;
};

type Reserva = {
  id: number;
  actividadId: number;
  actividad: string;
  horario: string;
};

export type AppContextType = {
  actividades: Actividad[];
  reservas: Reserva[];

  guardarActividad: (
    actividad: Actividad
  ) => void;

  eliminarActividad: (
    id: number
  ) => void;

  reservarClase: (
    actividadId: number
  ) => void;

  cancelarReserva: (
    reservaId: number
  ) => void;

  yaReservada: (
    actividadId: number
  ) => boolean;
};

export const AppContext =
  createContext<AppContextType | null>(
    null
  );

const ACTIVIDADES_INICIALES =
  [
    {
      id: 1,
      nombre:
        "Musculación",
      profesor:
        "Juan Pérez",
      horario:
        "08:00 - 10:00",
      cupos: 20,
    },
    {
      id: 2,
      nombre:
        "Spinning",
      profesor:
        "María Gómez",
      horario:
        "18:00 - 19:00",
      cupos: 0,
    },
  ];

export const AppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [
    actividades,
    setActividades,
  ] = useState<Actividad[]>(
    () => {
      const saved =
        localStorage.getItem(
          "actividades"
        );

      return saved
        ? JSON.parse(
            saved
          )
        : ACTIVIDADES_INICIALES;
    }
  );

  const [
    reservas,
    setReservas,
  ] = useState<Reserva[]>(
    () => {
      const saved =
        localStorage.getItem(
          "reservas"
        );

      return saved
        ? JSON.parse(
            saved
          )
        : [];
    }
  );

  useEffect(() => {
    localStorage.setItem(
      "actividades",
      JSON.stringify(
        actividades
      )
    );
  }, [actividades]);

  useEffect(() => {
    localStorage.setItem(
      "reservas",
      JSON.stringify(
        reservas
      )
    );
  }, [reservas]);

  const guardarActividad =
    (
      actividad: Actividad
    ) => {
      const estado =
        actividad.cupos > 0
          ? "Disponible"
          : "Completo";

      if (actividad.id) {
        setActividades(
          actividades.map(
            (a) =>
              a.id ===
              actividad.id
                ? {
                    ...a,
                    ...actividad,
                    estado,
                  }
                : a
          )
        );
      } else {
        const nuevaActividad =
          {
            ...actividad,
            id:
              actividades.length >
              0
                ? Math.max(
                    ...actividades.map(
                      (
                        a
                      ) =>
                        a.id
                    )
                  ) + 1
                : 1,
            estado,
          };

        setActividades([
          ...actividades,
          nuevaActividad,
        ]);
      }
    };

  const eliminarActividad =
    (id: number) => {
      setActividades(
        actividades.filter(
          (a) =>
            a.id !== id
        )
      );
    };

  const yaReservada = (
    actividadId: number
  ) => {
    return reservas.some(
      (r) =>
        r.actividadId ===
        actividadId
    );
  };

  const reservarClase = (
    actividadId: number
  ) => {
    if (
      yaReservada(
        actividadId
      )
    )
      return;

    const actividad =
      actividades.find(
        (a) =>
          a.id ===
          actividadId
      );

    if (
      !actividad ||
      actividad.cupos <= 0
    )
      return;

    setActividades(
      actividades.map((a) =>
        a.id === actividadId
          ? {
              ...a,
              cupos:
                a.cupos - 1,
            }
          : a
      )
    );

    setReservas([
      ...reservas,
      {
        id: Date.now(),
        actividadId,
        actividad:
          actividad.nombre,
        horario:
          actividad.horario,
      },
    ]);
  };

  const cancelarReserva = (
    reservaId: number
  ) => {
    const reserva =
      reservas.find(
        (r) =>
          r.id === reservaId
      );

    if (!reserva)
      return;

    setActividades(
      actividades.map((a) =>
        a.id ===
        reserva.actividadId
          ? {
              ...a,
              cupos:
                a.cupos + 1,
            }
          : a
      )
    );

    setReservas(
      reservas.filter(
        (r) =>
          r.id !== reservaId
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        actividades,
        reservas,
        guardarActividad,
        eliminarActividad,
        reservarClase,
        cancelarReserva,
        yaReservada,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};