import { useEffect, useState } from "react";
import "../styles/modal.css";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSave: (payload: any) => void;
	usuario?: any | null;
};

function EditPerfilModal({ isOpen, onClose, onSave, usuario }: Props) {
	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [correo, setCorreo] = useState("");
	const [dni, setDni] = useState("");
	const [telefono, setTelefono] = useState("");
	const [fechaNacimiento, setFechaNacimiento] = useState("");
	const [genero, setGenero] = useState("");

	useEffect(() => {
		if (usuario) {
			setNombre(usuario.nombre || "");
			setApellido(usuario.apellido || "");
			setCorreo(usuario.correo || "");
			setDni(usuario.dni || "");
			setTelefono(usuario.telefono || "");
			setFechaNacimiento(usuario.fechaNacimiento || "");
			setGenero(usuario.genero || "");
		} else {
			setNombre("");
			setApellido("");
			setCorreo("");
			setDni("");
			setTelefono("");
			setFechaNacimiento("");
			setGenero("");
		}
	}, [usuario]);

	if (!isOpen) return null;

	const handleSave = () => {
		if (!nombre.trim()) {
			alert("El nombre es obligatorio");
			return;
		}

		onSave({
			nombre: nombre.trim(),
			apellido: apellido.trim(),
			correo: correo.trim(),
			dni: dni.trim(),
			telefono: telefono.trim(),
			fechaNacimiento: fechaNacimiento.trim(),
			genero: genero.trim(),
		});
		onClose();
	};

	return (
		<div className="modal-overlay">
			<div className="modal">
				<div className="modal-header">
					<h2>Editar perfil</h2>

					<button
						className="close-btn"
						onClick={onClose}
						type="button"
						aria-label="Cerrar modal"
					>
						×
					</button>
				</div>

				<div className="modal-form">
					<label>
						Nombre
						<input value={nombre} onChange={(e) => setNombre(e.target.value)} />
					</label>

					<label>
						Apellido
						<input
							value={apellido}
							onChange={(e) => setApellido(e.target.value)}
						/>
					</label>

					<label>
						Correo electrónico
						<input value={correo} onChange={(e) => setCorreo(e.target.value)} />
					</label>

					<label>
						DNI
						<input value={dni} onChange={(e) => setDni(e.target.value)} />
					</label>

					<label>
						Teléfono
						<input
							value={telefono}
							onChange={(e) => setTelefono(e.target.value)}
						/>
					</label>

					<label>
						Fecha de nacimiento
						<input
							value={fechaNacimiento}
							onChange={(e) => setFechaNacimiento(e.target.value)}
						/>
					</label>

					<label>
						Género
						<select value={genero} onChange={(e) => setGenero(e.target.value)}>
							<option value="">Seleccionar</option>
							<option value="Masculino">Hombre</option>
							<option value="Femenino">Mujer</option>
						</select>
					</label>

					<div className="modal-footer">
						<button
							className="modal-btn modal-btn-secondary"
							type="button"
							onClick={onClose}
						>
							Cancelar
						</button>
						<button
							className="modal-btn modal-btn-primary"
							type="button"
							onClick={handleSave}
						>
							Guardar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditPerfilModal;
