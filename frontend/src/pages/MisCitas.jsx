import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const BADGE_POR_ESTADO = {
  pendiente_pago: 'warning',
  pagada: 'success',
  confirmada: 'primary',
  cancelada: 'secondary',
};

export default function MisCitas() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    api.get('/citas/mis-citas').then((res) => setCitas(res.data));
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4">Mis citas</h2>
      {citas.length === 0 && <p>Aún no tienes citas registradas.</p>}
      <div className="row g-3">
        {citas.map((c) => (
          <div className="col-md-6" key={c.id}>
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="card-title">{c.servicio}</h5>
                  <span className={`badge bg-${BADGE_POR_ESTADO[c.estado] || 'secondary'}`}>{c.estado}</span>
                </div>
                <p className="mb-1">{c.especialidad} — {c.especialista}</p>
                <p className="mb-1">{c.fecha} · {c.hora?.slice(0, 5)}</p>
                <p className="mb-2">Tarifa: S/ {c.tarifa}</p>
                {c.estado === 'pendiente_pago' && (
                  <Link className="btn btn-sm btn-success me-2" to={`/pago/${c.id}`}>Pagar</Link>
                )}
                {c.estado_pago === 'aprobado' && (
                  <>
                    <Link className="btn btn-sm btn-outline-primary me-2" to={`/comprobante/${c.id}`}>Ver comprobante</Link>
                    <Link className="btn btn-sm btn-outline-secondary" to={`/resultados/${c.id}`}>Resultados clínicos</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
