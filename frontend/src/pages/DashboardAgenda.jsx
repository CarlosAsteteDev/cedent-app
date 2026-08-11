import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { hoyLocal } from '../utils/fecha';

export default function DashboardAgenda() {
  const [fecha, setFecha] = useState(hoyLocal());
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setCargando(true);
    api.get('/citas/agenda', { params: { fecha } })
      .then((res) => setCitas(res.data))
      .finally(() => setCargando(false));
  }, [fecha]);

  return (
    <div className="container">
      <h2 className="mb-4">Mi agenda</h2>

      <div className="mb-4" style={{ maxWidth: 240 }}>
        <label className="form-label">Fecha</label>
        <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>

      {cargando && <p>Cargando...</p>}
      {!cargando && citas.length === 0 && <p>No tienes citas programadas para esta fecha.</p>}

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Teléfono</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {citas.map((c) => (
              <tr key={c.id}>
                <td>{c.hora?.slice(0, 5)}</td>
                <td>{c.paciente}</td>
                <td>{c.telefono_paciente}</td>
                <td>{c.servicio}</td>
                <td>{c.estado}</td>
                <td>
                  <Link className="btn btn-sm btn-outline-primary" to={`/resultados/${c.id}`}>
                    Resultados clínicos
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
