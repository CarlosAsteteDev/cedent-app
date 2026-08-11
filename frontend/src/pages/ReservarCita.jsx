import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { hoyLocal } from '../utils/fecha';

export default function ReservarCita() {
  const [searchParams] = useSearchParams();
  const [servicios, setServicios] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);
  const [servicioId, setServicioId] = useState(searchParams.get('servicio_id') || '');
  const [especialistaId, setEspecialistaId] = useState('');
  const [fecha, setFecha] = useState('');
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/servicios').then((res) => setServicios(res.data));
  }, []);

  useEffect(() => {
    setEspecialistaId('');
    setEspecialistas([]);
    if (!servicioId) return;
    api.get(`/servicios/${servicioId}/especialistas`).then((res) => setEspecialistas(res.data));
  }, [servicioId]);

  useEffect(() => {
    setHora('');
    setHorasDisponibles([]);
    if (!especialistaId || !fecha) return;
    api.get('/citas/disponibilidad', { params: { especialista_id: especialistaId, fecha } })
      .then((res) => setHorasDisponibles(res.data.horas_disponibles));
  }, [especialistaId, fecha]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const { data } = await api.post('/citas', {
        especialista_id: Number(especialistaId),
        servicio_id: Number(servicioId),
        fecha,
        hora,
      });
      navigate(`/pago/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo reservar la cita');
    } finally {
      setCargando(false);
    }
  }

  const hoy = hoyLocal();

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h2 className="mb-4">Reservar cita</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Servicio</label>
          <select className="form-select" value={servicioId} onChange={(e) => setServicioId(e.target.value)} required>
            <option value="">Selecciona un servicio</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre} — S/ {s.tarifa}</option>
            ))}
          </select>
        </div>

        {servicioId && (
          <div className="mb-3">
            <label className="form-label">Especialista</label>
            <select className="form-select" value={especialistaId} onChange={(e) => setEspecialistaId(e.target.value)} required>
              <option value="">Selecciona un especialista</option>
              {especialistas.map((e) => (
                <option key={e.especialista_id} value={e.especialista_id}>
                  {e.nombre_completo} ({e.anios_experiencia} años de experiencia)
                </option>
              ))}
            </select>
            {especialistaId === '' && especialistas.length === 0 && (
              <div className="form-text">No hay especialistas activos para este servicio.</div>
            )}
          </div>
        )}

        {especialistaId && (
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input type="date" className="form-control" min={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </div>
        )}

        {fecha && (
          <div className="mb-3">
            <label className="form-label">Hora</label>
            <select className="form-select" value={hora} onChange={(e) => setHora(e.target.value)} required>
              <option value="">Selecciona una hora</option>
              {horasDisponibles.map((h) => (
                <option key={h} value={h}>{h.slice(0, 5)}</option>
              ))}
            </select>
            {horasDisponibles.length === 0 && (
              <div className="form-text">No hay horarios disponibles ese día.</div>
            )}
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={cargando || !hora}>
          {cargando ? 'Reservando...' : 'Reservar y continuar al pago'}
        </button>
      </form>
    </div>
  );
}
