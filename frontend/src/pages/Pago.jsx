import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function Pago() {
  const { citaId } = useParams();
  const [cita, setCita] = useState(null);
  const [tarjeta, setTarjeta] = useState({ numero: '', vencimiento: '', cvv: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/citas/${citaId}`).then((res) => setCita(res.data));
  }, [citaId]);

  async function handlePagar(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await api.post(`/citas/${citaId}/pago`);
      navigate(`/comprobante/${citaId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo procesar el pago');
    } finally {
      setCargando(false);
    }
  }

  if (!cita) return <div className="container">Cargando...</div>;

  if (cita.estado !== 'pendiente_pago') {
    return (
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="alert alert-info">Esta cita ya fue pagada anteriormente (estado: {cita.estado}).</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2 className="mb-4">Pago de cita</h2>

      <div className="card mb-4">
        <div className="card-body">
          <p className="mb-1"><strong>Especialidad:</strong> {cita.especialidad}</p>
          <p className="mb-1"><strong>Especialista:</strong> {cita.especialista}</p>
          <p className="mb-1"><strong>Servicio:</strong> {cita.servicio}</p>
          <p className="mb-1"><strong>Fecha:</strong> {cita.fecha}</p>
          <p className="mb-1"><strong>Hora:</strong> {cita.hora?.slice(0, 5)}</p>
          <p className="mb-0"><strong>Monto a pagar:</strong> S/ {cita.tarifa}</p>
        </div>
      </div>

      <form onSubmit={handlePagar}>
        <div className="mb-3">
          <label className="form-label">Número de tarjeta</label>
          <input className="form-control" placeholder="4111 1111 1111 1111" value={tarjeta.numero}
            onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })} required maxLength={19} />
        </div>
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Vencimiento</label>
            <input className="form-control" placeholder="MM/AA" value={tarjeta.vencimiento}
              onChange={(e) => setTarjeta({ ...tarjeta, vencimiento: e.target.value })} required maxLength={5} />
          </div>
          <div className="col mb-3">
            <label className="form-label">CVV</label>
            <input className="form-control" placeholder="123" value={tarjeta.cvv}
              onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })} required maxLength={3} />
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-success w-100" disabled={cargando}>
          {cargando ? 'Procesando pago...' : `Pagar S/ ${cita.tarifa}`}
        </button>
      </form>
    </div>
  );
}
