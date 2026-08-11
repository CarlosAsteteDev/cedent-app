import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Contacto() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api.get('/contacto').then((res) => setInfo(res.data));
  }, []);

  if (!info) return <div className="container">Cargando...</div>;

  const mapaSrc = `https://www.google.com/maps?q=${info.mapa.lat},${info.mapa.lng}&z=16&output=embed`;

  return (
    <div className="container">
      <h2 className="mb-4">Contacto y ubicación</h2>
      <div className="row g-4">
        <div className="col-md-5">
          <ul className="list-group">
            <li className="list-group-item"><strong>Dirección:</strong> {info.direccion}</li>
            <li className="list-group-item"><strong>Teléfono:</strong> {info.telefono}</li>
            <li className="list-group-item"><strong>WhatsApp:</strong> {info.whatsapp}</li>
            <li className="list-group-item"><strong>Correo:</strong> {info.correo}</li>
            <li className="list-group-item"><strong>Horario:</strong> {info.horario}</li>
          </ul>
        </div>
        <div className="col-md-7">
          <iframe
            title="Ubicación de CEDENT"
            src={mapaSrc}
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
