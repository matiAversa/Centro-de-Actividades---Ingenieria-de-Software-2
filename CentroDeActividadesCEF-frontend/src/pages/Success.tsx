import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

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
      <div style={containerStyle}>
        <div className="spinner"></div>
        <h2>Confirmando tu lugar en la clase...</h2>
        <p>Estamos procesando tu pago con Mercado Pago.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {error ? (
        <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px' }}>
          <h2>⚠ Error</h2>
          <p>{error}</p>
          <Link to="/">Volver al inicio</Link>
        </div>
      ) : (
        <div style={{ backgroundColor: '#f0fff4', padding: '40px', borderRadius: '15px', border: '1px solid #c6f6d5' }}>
          <h1 style={{ color: '#38a169', fontSize: '3rem' }}>✔</h1>
          <h2 style={{ color: '#2f855a' }}>¡Inscripción Exitosa!</h2>
          <p>Tu pago se procesó correctamente.</p>
          <hr />
          <p><strong>ID de Operación:</strong> {searchParams.get('payment_id')}</p>
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => navigate('/mis-clases')} style={buttonStyle}>
              Ver mis clases
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '80vh',
  textAlign: 'center',
  fontFamily: 'sans-serif'
};

const buttonStyle = {
  backgroundColor: '#009EE3',
  color: 'white',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default Success;