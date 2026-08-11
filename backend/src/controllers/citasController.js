const pool = require('../config/db');

const HORAS_JORNADA = [
  '09:00:00', '10:00:00', '11:00:00', '12:00:00',
  '14:00:00', '15:00:00', '16:00:00', '17:00:00',
];

async function disponibilidad(req, res) {
  const { especialista_id, fecha } = req.query;

  if (!especialista_id || !fecha) {
    return res.status(400).json({ error: 'especialista_id y fecha son obligatorios' });
  }

  const [ocupadas] = await pool.query(
    `SELECT hora FROM citas
     WHERE especialista_id = ? AND fecha = ? AND estado != 'cancelada'`,
    [especialista_id, fecha]
  );

  const horasOcupadas = new Set(ocupadas.map((c) => c.hora));
  const disponibles = HORAS_JORNADA.filter((h) => !horasOcupadas.has(h));

  res.json({ fecha, especialista_id: Number(especialista_id), horas_disponibles: disponibles });
}

async function crearCita(req, res) {
  const { especialista_id, servicio_id, fecha, hora } = req.body;
  const paciente_id = req.usuario.id;

  if (!especialista_id || !servicio_id || !fecha || !hora) {
    return res.status(400).json({ error: 'especialista_id, servicio_id, fecha y hora son obligatorios' });
  }

  if (!HORAS_JORNADA.includes(hora)) {
    return res.status(400).json({ error: 'Hora fuera del horario de atención' });
  }

  try {
    const [resultado] = await pool.query(
      `INSERT INTO citas (paciente_id, especialista_id, servicio_id, fecha, hora, estado)
       VALUES (?, ?, ?, ?, ?, 'pendiente_pago')`,
      [paciente_id, especialista_id, servicio_id, fecha, hora]
    );

    res.status(201).json({ id: resultado.insertId, estado: 'pendiente_pago' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ese especialista ya tiene una cita agendada en ese horario' });
    }
    throw err;
  }
}

async function misCitas(req, res) {
  const [filas] = await pool.query(
    `SELECT c.id, c.fecha, c.hora, c.estado,
            s.nombre AS servicio, s.tarifa,
            esp_u.nombre_completo AS especialista,
            e.nombre AS especialidad,
            p.estado AS estado_pago
     FROM citas c
     JOIN servicios s ON s.id = c.servicio_id
     JOIN especialidades e ON e.id = s.especialidad_id
     JOIN especialistas esp ON esp.id = c.especialista_id
     JOIN usuarios esp_u ON esp_u.id = esp.usuario_id
     LEFT JOIN pagos p ON p.cita_id = c.id
     WHERE c.paciente_id = ?
     ORDER BY c.fecha DESC, c.hora DESC`,
    [req.usuario.id]
  );
  res.json(filas);
}

async function agendaEspecialista(req, res) {
  const { fecha } = req.query;

  const [especialista] = await pool.query(
    'SELECT id FROM especialistas WHERE usuario_id = ?',
    [req.usuario.id]
  );
  if (especialista.length === 0) {
    return res.status(404).json({ error: 'Este usuario no tiene un perfil de especialista asociado' });
  }

  let sql = `
    SELECT c.id, c.fecha, c.hora, c.estado,
           s.nombre AS servicio,
           pac.nombre_completo AS paciente, pac.telefono AS telefono_paciente
    FROM citas c
    JOIN servicios s ON s.id = c.servicio_id
    JOIN usuarios pac ON pac.id = c.paciente_id
    WHERE c.especialista_id = ?
  `;
  const params = [especialista[0].id];

  if (fecha) {
    sql += ' AND c.fecha = ?';
    params.push(fecha);
  }

  sql += ' ORDER BY c.fecha, c.hora';

  const [filas] = await pool.query(sql, params);
  res.json(filas);
}

async function obtenerCita(req, res) {
  const [filas] = await pool.query(
    `SELECT c.id, c.fecha, c.hora, c.estado, c.paciente_id,
            s.nombre AS servicio, s.tarifa, esd.nombre AS especialidad,
            esp_u.id AS especialista_usuario_id, esp_u.nombre_completo AS especialista
     FROM citas c
     JOIN servicios s ON s.id = c.servicio_id
     JOIN especialidades esd ON esd.id = s.especialidad_id
     JOIN especialistas esp ON esp.id = c.especialista_id
     JOIN usuarios esp_u ON esp_u.id = esp.usuario_id
     WHERE c.id = ?`,
    [req.params.id]
  );

  if (filas.length === 0) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  const cita = filas[0];
  const esDueño = cita.paciente_id === req.usuario.id;
  const esEspecialistaAsignado = cita.especialista_usuario_id === req.usuario.id;
  const esAdmin = req.usuario.rol === 'administrador';
  if (!esDueño && !esEspecialistaAsignado && !esAdmin) {
    return res.status(403).json({ error: 'No autorizado para ver esta cita' });
  }

  delete cita.especialista_usuario_id;
  res.json(cita);
}

module.exports = { disponibilidad, crearCita, misCitas, agendaEspecialista, obtenerCita, HORAS_JORNADA };
