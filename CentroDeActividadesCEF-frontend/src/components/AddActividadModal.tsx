import {
  useEffect,
  useState,
} from "react";

import "../styles/modal.css";

type Actividad = {
  id?: number | string;
  nombre: string;
  profesor: string;
  horario: string;
  cupos: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaveActividad: (actividad: Actividad) => void;
  actividadToEdit?: Actividad | null;
};

function AddActividadModal({
  isOpen,
  onClose,
  onSaveActividad,
  actividadToEdit,
}: Props) {
  const [nombre, setNombre] =
    useState("");

  const [
    profesor,
    setProfesor,
  ] = useState("");

  const [horario, setHorario] =
    useState("");

  const [cupos, setCupos] =
    useState("");

  const limpiarFormulario =
    () => {
      setNombre("");
      setProfesor("");
      setHorario("");
      setCupos("");
    };

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;

    if (actividadToEdit) {
      // Defer state updates to avoid synchronous setState inside effect
      t = setTimeout(() => {
        // actividadToEdit is typed as Actividad, safe to read properties
        setNombre(actividadToEdit.nombre);
        setProfesor(actividadToEdit.profesor);
        setHorario(actividadToEdit.horario);
        setCupos(String(actividadToEdit.cupos));
      }, 0);
    } else {
      // also defer clearing to keep behavior consistent
      t = setTimeout(() => limpiarFormulario(), 0);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [actividadToEdit]);

  const handleSave =
    () => {
      if (
        !nombre ||
        !profesor ||
        !horario ||
        !cupos
      ) {
        alert(
          "Completá todos los campos"
        );
        return;
      }

      onSaveActividad({
        id:
          actividadToEdit?.id,

        nombre,

        profesor,

        horario,

        cupos:
          Number(cupos),
      });

      limpiarFormulario();

      onClose();
    };

  if (!isOpen)
    return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          {actividadToEdit
            ? "Editar Actividad"
            : "Agregar Actividad"}
        </h2>

        <button
          className="close-btn"
          onClick={
            onClose
          }
        >
          ×
        </button>

        <input
          type="text"
          placeholder="Nombre de la actividad"
          value={nombre}
          onChange={(e) =>
            setNombre(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Profesor"
          value={profesor}
          onChange={(e) =>
            setProfesor(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Horario"
          value={horario}
          onChange={(e) =>
            setHorario(
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Cupos"
          value={cupos}
          onChange={(e) =>
            setCupos(
              e.target.value
            )
          }
        />

        <button
          className="save-btn"
          onClick={
            handleSave
          }
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export default AddActividadModal;