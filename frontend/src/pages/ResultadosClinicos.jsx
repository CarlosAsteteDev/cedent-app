import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ResultadosClinicos() {
  const { citaId } = useParams();
  const { usuario } = useAuth();
  const [cita, setCita] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  function cargarResultados() {
    api.get(`/citas/${citaId}/resultados`).then((res) => setResultados(res.data));
  }

  useEffect(() => {
    api.get(`/citas/${citaId}`).then((res) => setCita(res.data));
    cargarResultados();
  }, [citaId]);

  async function handleSubir(e) {
    e.preventDefault();
    if (!archivo) return;
    setError('');
    setMensaje('');
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      await api.post(`/citas/${citaId}/resultados`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMensaje('Resultado subido correctamente.');
      setArchivo(null);
      e.target.reset();
      cargarResultados();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo subir el resultado');
    } finally {
      setSubiendo(false);
    }
  }

  const apiOrigin = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

  return (
    <div className="container" style={{ maxWidth: 620 }}>
      <h2 className="mb-4">Resultados clínicos</h2>

      {cita && (
        <div className="card mb-4">
          <div className="card-body">
            <p className="mb-1"><strong>Servicio:</strong> {cita.servicio}</p>
            <p className="mb-1"><strong>Especialista:</strong> {cita.especialista}</p>
            <p className="mb-0"><strong>Fecha:</strong> {cita.fecha} {cita.hora?.slice(0, 5)}</p>
          </div>
        </div>
      )}

      {usuario?.rol === 'especialista' && (
        <form onSubmit={handleSubir} className="mb-4">
          <label className="form-label">Subir informe / resultado (PDF, PNG o JPG)</label>
          <div className="input-group">
            <input type="file" className="form-control" accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setArchivo(e.target.files[0])} required />
            <button className="btn btn-primary" type="submit" disabled={subiendo}>
              {subiendo ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
        </form>
      )}

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <h5>Historial</h5>
      {resultados.length === 0 && <p>Aún no hay resultados clínicos para esta cita.</p>}
      <ul className="list-group">
        {resultados.map((r) => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <a href={`${apiOrigin}${r.archivo_url}`} target="_blank" rel="noreferrer">
                {r.archivo_url.split('/').pop()}
              </a>
              <div className="text-muted small">Subido por {r.subido_por} el {r.fecha_subida}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
