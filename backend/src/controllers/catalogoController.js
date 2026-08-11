const pool = require('../config/db');

async function listarEspecialidades(_req, res) {
  const [filas] = await pool.query('SELECT id, nombre FROM especialidades ORDER BY nombre');
  res.json(filas);
}

async function listarServicios(req, res) {
  const { especialidad_id } = req.query;

  let sql = `
    SELECT s.id, s.nombre, s.descripcion, s.tarifa,
           e.id AS especialidad_id, e.nombre AS especialidad
    FROM servicios s
    JOIN especialidades e ON e.id = s.especialidad_id
  `;
  const params = [];

  if (especialidad_id) {
    sql += ' WHERE s.especialidad_id = ?';
    params.push(especialidad_id);
  }

  sql += ' ORDER BY e.nombre, s.nombre';

  const [filas] = await pool.query(sql, params);
  res.json(filas);
}

async function listarEspecialistasPorServicio(req, res) {
  const { servicioId } = req.params;

  const [filas] = await pool.query(
    `SELECT es.id AS especialista_id, u.nombre_completo, es.anios_experiencia, es.biografia
     FROM especialistas es
     JOIN usuarios u ON u.id = es.usuario_id
     JOIN servicios s ON s.especialidad_id = es.especialidad_id
     WHERE s.id = ? AND es.activo = TRUE
     ORDER BY u.nombre_completo`,
    [servicioId]
  );
  res.json(filas);
}

module.exports = { listarEspecialidades, listarServicios, listarEspecialistasPorServicio };
