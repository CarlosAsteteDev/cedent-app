import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Catalogo() {
  const [especialidades, setEspecialidades] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const { usuario } = useAuth();

  useEffect(() => {
    api.get('/especialidades').then((res) => setEspecialidades(res.data));
  }, []);

  useEffect(() => {
    api.get('/servicios', { params: filtro ? { especialidad_id: filtro } : {} })
      .then((res) => setServicios(res.data));
  }, [filtro]);

  const serviciosPorEspecialidad = servicios.reduce((acc, s) => {
    (acc[s.especialidad] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="container">
      <h2 className="mb-4">Catálogo de servicios y tarifario</h2>

      <div className="mb-4" style={{ maxWidth: 320 }}>
        <label className="form-label">Filtrar por especialidad</label>
        <select className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas las especialidades</option>
          {especialidades.map((e) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>
      </div>

      {Object.entries(serviciosPorEspecialidad).map(([especialidad, items]) => (
        <div key={especialidad} className="mb-4">
          <h4>{especialidad}</h4>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Descripción</th>
                  <th>Tarifa</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nombre}</td>
                    <td>{s.descripcion}</td>
                    <td>S/ {s.tarifa}</td>
                    <td>
                      {usuario?.rol === 'paciente' && (
                        <Link className="btn btn-sm btn-primary" to={`/reservar?servicio_id=${s.id}`}>
                          Reservar
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
