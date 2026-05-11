import { useEffect, useState } from "react";

type Socio = {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaveSocio: (socio: Socio) => void;
  socioToEdit?: Socio | null;
};

function AddSocioModal({
  isOpen,
  onClose,
  onSaveSocio,
  socioToEdit,
}: Props) {
  const [formData, setFormData] =
    useState<Socio>({
      nombre: "",
      email: "",
      telefono: "",
      fechaNacimiento: "",
    });

  useEffect(() => {
    queueMicrotask(() => {
      setFormData({
        id: socioToEdit?.id,
        nombre: socioToEdit?.nombre || "",
        email: socioToEdit?.email || "",
        telefono: socioToEdit?.telefono || "",
        fechaNacimiento: socioToEdit?.fechaNacimiento || "",
      });
    });
  }, [socioToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    onSaveSocio(formData);

    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      fechaNacimiento: "",
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>
            {socioToEdit
              ? "Editar Socio"
              : "Agregar Socio"}
          </h2>

          <button
            className="close-modal-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form
          className="modal-form"
          onSubmit={handleSubmit}
        >
          <input
            name="nombre"
            type="text"
            placeholder="Nombre completo"
            value={
              formData.nombre
            }
            onChange={
              handleChange
            }
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
          />

          <input
            name="telefono"
            type="tel"
            placeholder="Teléfono"
            value={
              formData.telefono
            }
            onChange={
              handleChange
            }
          />

          <input
            name="fechaNacimiento"
            type="date"
            value={
              formData.fechaNacimiento
            }
            onChange={
              handleChange
            }
          />

          <button
            className="save-socio-btn"
            type="submit"
          >
            {socioToEdit
              ? "Guardar cambios"
              : "Guardar socio"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSocioModal;