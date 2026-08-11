const pool = require('../config/db');

async function subirResultado(req, res) {
  const { citaId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'Debe adjuntar un archivo' });
  }

  const [citas] = await pool.query(
    `SELECT c.id, c.paciente_id, esp.usuario_id AS especialista_usuario_id
     FROM citas c
     JOIN especialistas esp ON esp.id = c.especialista_id
     WHERE c.id = ?`,
    [citaId]
  );

  if (citas.length === 0) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  if (citas[0].especialista_usuario_id !== req.usuario.id) {
    return res.status(403).json({ error: 'Solo el especialista asignado puede subir resultados de esta cita' });
  }

  const archivo_url = `/uploads/resultados/${req.file.filename}`;

  const [resultado] = await pool.query(
    `INSERT INTO resultados_clinicos (cita_id, archivo_url, subido_por)
     VALUES (?, ?, ?)`,
    [citaId, archivo_url, req.usuario.id]
  );

  res.status(201).json({ id: resultado.insertId, archivo_url });
}

async function listarResultados(req, res) {
  const { citaId } = req.params;

  const [citas] = await pool.query(
    `SELECT c.paciente_id, esp.usuario_id AS especialista_usuario_id
     FROM citas c
     JOIN especialistas esp ON esp.id = c.especialista_id
     WHERE c.id = ?`,
    [citaId]
  );

  if (citas.length === 0) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  const { paciente_id, especialista_usuario_id } = citas[0];
  const esParte = req.usuario.id === paciente_id || req.usuario.id === especialista_usuario_id;
  if (!esParte && req.usuario.rol !== 'administrador') {
    return res.status(403).json({ error: 'No autorizado para ver estos resultados' });
  }

  const [filas] = await pool.query(
    `SELECT r.id, r.archivo_url, r.fecha_subida, u.nombre_completo AS subido_por
     FROM resultados_clinicos r
     JOIN usuarios u ON u.id = r.subido_por
     WHERE r.cita_id = ?
     ORDER BY r.fecha_subida DESC`,
    [citaId]
  );

  res.json(filas);
}

module.exports = { subirResultado, listarResultados };
