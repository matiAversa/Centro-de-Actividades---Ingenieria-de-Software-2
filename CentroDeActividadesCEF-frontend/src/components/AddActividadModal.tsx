import { useEffect, useState } from "react";
import "../styles/modal.css";

type Actividad = {
  id?: number | string;
  nombre: string;
  descripcion: string;
  activo: boolean;
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
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setActivo(true);
  };

  useEffect(() => {
    if (actividadToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNombre(actividadToEdit.nombre || "");
      setDescripcion(actividadToEdit.descripcion || "");
      setActivo(actividadToEdit.activo ?? true);
    } else {
      limpiarFormulario();
    }
  }, [actividadToEdit]);

  const handleSave = () => {
    if (!nombre.trim()) {
      alert("El nombre de la actividad es obligatorio");
      return;
    }

    onSaveActividad({
      id: actividadToEdit?.id,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      activo,
    });

    limpiarFormulario();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{actividadToEdit ? "Editar Actividad" : "Agregar Actividad"}</h2>

        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <input
          type="text"
          placeholder="Nombre de la actividad"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
        />

        <select
          value={activo ? "true" : "false"}
          onChange={(e) => setActivo(e.target.value === "true")}
        >
          <option value="true">Activa</option>
          <option value="false">Inactiva</option>
        </select>

        <button className="save-btn" onClick={handleSave}>
          Guardar
        </button>
      </div>
    </div>
  );
}

export default AddActividadModal;