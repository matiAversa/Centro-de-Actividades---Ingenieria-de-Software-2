import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/useAuth";
import { obtenerPagosPorSocio, type Pago } from "../services/pagoService";
import "../styles/misPagos.css";

function MisPagos() {
	const [pagos, setPagos] = useState<Pago[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { user } = useAuth();
	const usuarioId = user?.usuarioId;

	useEffect(() => {
		const cargarPagos = async () => {
			if (!usuarioId) {
				setLoading(false);
				return;
			}

			try {
				const data = await obtenerPagosPorSocio(usuarioId);
				setPagos(data);
			} catch (err) {
				console.error(err);
				setError("No se pudieron cargar tus pagos.");
			} finally {
				setLoading(false);
			}
		};

		void cargarPagos();
	}, [usuarioId]);

	const formatearMonto = (monto?: number, moneda?: string) => {
		const valor = Number(monto ?? 0);
		const codigoMoneda = (moneda ?? "ARS").toUpperCase();

		if (!Number.isFinite(valor)) {
			return "Sin monto";
		}

		try {
			return new Intl.NumberFormat("es-AR", {
				style: "currency",
				currency: codigoMoneda,
			}).format(valor);
		} catch {
			return `${valor.toLocaleString("es-AR")} ${codigoMoneda}`;
		}
	};

	const formatearFecha = (fechaPago?: string) => {
		if (!fechaPago) {
			return "Sin fecha";
		}

		const fechaNormalizada =
			fechaPago.length === 10 ? `${fechaPago}T00:00:00` : fechaPago;
		const fecha = new Date(fechaNormalizada);

		if (Number.isNaN(fecha.getTime())) {
			return fechaPago;
		}

		return fecha.toLocaleDateString("es-AR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const obtenerClaseEstado = (estado?: string) => {
		const estadoNormalizado = (estado ?? "desconocido")
			.trim()
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/\s+/g, "-");

		return `estado-badge estado-${estadoNormalizado}`;
	};

	return (
		<UserLayout>
			<div className="mis-pagos-container">
				<div className="mis-pagos-header">
					<div>
						<p className="mis-pagos-subtitle">Historial personal</p>
						<h2>Mis Pagos</h2>
					</div>

					<div className="mis-pagos-summary">
						<span>{pagos.length} registros</span>
					</div>
				</div>

				{loading ? (
					<Spinner message="Cargando tus pagos..." />
				) : error ? (
					<div className="mis-pagos-empty error">
						<h3>No pudimos cargar tus pagos</h3>
						<p>{error}</p>
					</div>
				) : !usuarioId ? (
					<div className="mis-pagos-empty">
						<h3>No hay un usuario asociado</h3>
						<p>Iniciá sesión nuevamente para ver tus pagos.</p>
					</div>
				) : pagos.length === 0 ? (
					<div className="mis-pagos-empty">
						<h3>Aún no tenés pagos registrados</h3>
						<p>
							Cuando realices un pago, va a aparecer acá con su estado y método.
						</p>
					</div>
				) : (
					<div className="mis-pagos-grid">
						{pagos.map((pago, index) => (
							<article
								className="pago-card"
								key={pago.id ?? pago.mpPaymentId ?? index}
							>
								<div className="pago-card-top">
									<div>
										<span className="pago-label">MP Payment ID</span>
										<strong>{pago.mpPaymentId ?? "Sin ID"}</strong>
									</div>

									<span className={obtenerClaseEstado(pago.estado)}>
										{pago.estado ?? "Sin estado"}
									</span>
								</div>

								<dl className="pago-details">
									<div>
										<dt>Monto</dt>
										<dd>{formatearMonto(pago.monto, pago.moneda)}</dd>
									</div>

									<div>
										<dt>Moneda</dt>
										<dd>{pago.moneda ?? "ARS"}</dd>
									</div>

									<div>
										<dt>Clase</dt>
										<dd>{pago.clase?.actividad?.nombre ?? "No asignada"}</dd>
									</div>

									<div>
										<dt>Fecha de pago</dt>
										<dd>{formatearFecha(pago.fechaPago)}</dd>
									</div>

									<div>
										<dt>Método</dt>
										<dd>{pago.metodo ?? "No informado"}</dd>
									</div>
								</dl>
							</article>
						))}
					</div>
				)}
			</div>
		</UserLayout>
	);
}

export default MisPagos;
