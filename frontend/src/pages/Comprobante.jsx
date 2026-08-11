import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';

export default function Comprobante() {
  const { citaId } = useParams();
  const [comprobante, setComprobante] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/citas/${citaId}/comprobante`)
      .then((res) => setComprobante(res.data))
      .catch((err) => setError(err.response?.data?.error || 'No se pudo cargar el comprobante'));
  }, [citaId]);

  if (error) return <div className="container"><div className="alert alert-danger">{error}</div></div>;
  if (!comprobante) return <div className="container">Cargando...</div>;

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="alert alert-success">Pago aprobado. Se envió el comprobante a {comprobante.correo_paciente}.</div>

      <div className="card">
        <div className="card-header bg-primary text-white">Comprobante de pago — CEDENT</div>
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-6">N° de pago</dt><dd className="col-6">{comprobante.pago_id}</dd>
            <dt className="col-6">Referencia de pago</dt><dd className="col-6">{comprobante.referencia_izipay}</dd>
            <dt className="col-6">Fecha de pago</dt><dd className="col-6">{comprobante.fecha_pago}</dd>
            <dt className="col-6">Paciente</dt><dd className="col-6">{comprobante.paciente}</dd>
            <dt className="col-6">Especialidad</dt><dd className="col-6">{comprobante.especialidad}</dd>
            <dt className="col-6">Servicio</dt><dd className="col-6">{comprobante.servicio}</dd>
            <dt className="col-6">Especialista</dt><dd className="col-6">{comprobante.especialista}</dd>
            <dt className="col-6">Fecha de la cita</dt><dd className="col-6">{comprobante.fecha_cita} {comprobante.hora_cita?.slice(0, 5)}</dd>
            <dt className="col-6">Monto</dt><dd className="col-6">S/ {comprobante.monto}</dd>
          </dl>
        </div>
      </div>

      <Link to="/mis-citas" className="btn btn-primary mt-3">Ver mis citas</Link>
    </div>
  );
}
