import { useEffect, useState } from "react";
import "../styles/modal.css";

export type RecepcionistaForm = {
	nombre: string;
	apellido: string;
	dni: string;
	telefono: string;
	correo: string;
	contrasena: string;
	genero: string;
	fechaNacimiento: string;
	rol: string;
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSaveRecepcionista: (recepcionista: RecepcionistaForm) => void;
};

function AddRecepcionistaModal({
	isOpen,
	onClose,
	onSaveRecepcionista,
}: Props) {
	const [formData, setFormData] = useState<RecepcionistaForm>({
		nombre: "",
		apellido: "",
		dni: "",
		telefono: "",
		correo: "",
		contrasena: "",
		genero: "",
		fechaNacimiento: "",
		rol: "RECEPCIONISTA",
	});

	useEffect(() => {
		if (!isOpen) return;

		setFormData({
			nombre: "",
			apellido: "",
			dni: "",
			telefono: "",
			correo: "",
			contrasena: "",
			genero: "",
			fechaNacimiento: "",
			rol: "RECEPCIONISTA",
		});
	}, [isOpen]);

	if (!isOpen) return null;

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		onSaveRecepcionista(formData);
		onClose();
	};

	return (
		<div className="modal-overlay">
			<div className="modal">
				<div className="modal-header">
					<h2>Agregar Recepcionista</h2>

					<button
						className="close-btn"
						onClick={onClose}
						type="button"
						aria-label="Cerrar modal"
					>
						✕
					</button>
				</div>

				<form className="modal-form" onSubmit={handleSubmit}>
					<input
						name="nombre"
						type="text"
						placeholder="Nombre"
						value={formData.nombre}
						onChange={handleChange}
					/>

					<input
						name="apellido"
						type="text"
						placeholder="Apellido"
						value={formData.apellido}
						onChange={handleChange}
					/>

					<input
						name="dni"
						type="text"
						placeholder="DNI"
						value={formData.dni}
						onChange={handleChange}
					/>

					<input
						name="telefono"
						type="tel"
						placeholder="Teléfono"
						value={formData.telefono}
						onChange={handleChange}
					/>

					<input
						name="correo"
						type="email"
						placeholder="Correo electrónico"
						value={formData.correo}
						onChange={handleChange}
					/>

					<input
						name="contrasena"
						type="password"
						placeholder="Contraseña"
						value={formData.contrasena}
						onChange={handleChange}
					/>

					<select name="genero" value={formData.genero} onChange={handleChange}>
						<option value="" disabled>
							Seleccionar género
						</option>
						<option value="1">Hombre</option>
						<option value="2">Mujer</option>
					</select>

					<input
						name="fechaNacimiento"
						type="date"
						value={formData.fechaNacimiento}
						onChange={handleChange}
					/>

					<div className="modal-footer">
						<button
							className="modal-btn modal-btn-secondary"
							type="button"
							onClick={onClose}
						>
							Cancelar
						</button>

						<button className="modal-btn modal-btn-primary" type="submit">
							Guardar recepcionista
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AddRecepcionistaModal;
