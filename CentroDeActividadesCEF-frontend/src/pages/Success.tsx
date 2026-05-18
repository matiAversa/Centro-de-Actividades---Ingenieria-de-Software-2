import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import '../styles/success.css';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const effectRan = useRef(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (effectRan.current === true) return;
    const confirmarTodo = async () => {
      const paymentId = searchParams.get('payment_id');
      const status = searchParams.get('status');

      const pendingData = localStorage.getItem('pending_inscription');
      
      if (!pendingData || status !== 'approved') {
        setError('No se encontraron datos de la inscripción pendiente o el pago no fue aprobado.');
        setLoading(false);
        return;
      }

      const { socioId, claseId, monto } = JSON.parse(pendingData);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inscripciones/confirmar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: paymentId,
            status: status,
            usuarioId: socioId,
            claseId: claseId,
            monto: monto,
            externalReference: 0
          }),
        });

        if (!response.ok) {
          throw new Error('Error en el servidor al registrar la inscripción');
        }

        localStorage.removeItem('pending_inscription');
        setLoading(false);

      } catch (err) {
        console.error(err);
        setError('El pago se realizó, pero falló el registro en la base de datos. Por favor, guardá tu comprobante.');
        setLoading(false);
      }
    };

    confirmarTodo();
    return () => {
      effectRan.current = true;
    };
  }, [searchParams]);

  if (loading) {
    return (
      <Layout>
        <div className="success-container">
          <Spinner message="Confirmando tu lugar en la clase..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="success-container">
        {error ? (
          <div className="error-card">
            <h2>⚠ Error</h2>
            <p>{error}</p>
            <Link to="/" className="error-btn">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="success-card">
            <h1>✔</h1>
            <h2>¡Inscripción Exitosa!</h2>
            <p>Tu pago se procesó correctamente.</p>
            <hr />
            <p>
              <strong>ID de Operación:</strong> {searchParams.get('payment_id')}
            </p>
            <div className="success-actions">
              <button
                onClick={() => navigate('/mis-clases')}
                className="success-btn"
              >
                Ver mis clases
              </button>
              <Link to="/home" className="success-btn">
                Volver al inicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Success;