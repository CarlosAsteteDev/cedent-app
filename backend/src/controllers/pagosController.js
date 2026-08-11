const pool = require('../config/db');
const { procesarPagoSimulado } = require('../utils/izipay');
const { enviarComprobante } = require('../utils/mailer');

async function pagarCita(req, res) {
  const { citaId } = req.params;

  const [citas] = await pool.query(
    `SELECT c.id, c.paciente_id, c.estado, s.tarifa
     FROM citas c
     JOIN servicios s ON s.id = c.servicio_id
     WHERE c.id = ?`,
    [citaId]
  );

  if (citas.length === 0) {
    return res.status(404).json({ error: 'Cita no encontrada' });
  }

  const cita = citas[0];

  if (cita.paciente_id !== req.usuario.id) {
    return res.status(403).json({ error: 'No autorizado para pagar esta cita' });
  }
  if (cita.estado !== 'pendiente_pago') {
    return res.status(409).json({ error: `La cita no está pendiente de pago (estado actual: ${cita.estado})` });
  }

  const resultadoPago = procesarPagoSimulado();

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO pagos (cita_id, monto, estado, referencia_izipay, fecha_pago)
       VALUES (?, ?, 'aprobado', ?, NOW())`,
      [citaId, cita.tarifa, resultadoPago.referencia]
    );

    await conn.query("UPDATE citas SET estado = 'pagada' WHERE id = ?", [citaId]);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  const [comprobanteFilas] = await pool.query(
    'SELECT * FROM vista_comprobante_pago WHERE cita_id = ?',
    [citaId]
  );
  const comprobante = comprobanteFilas[0];

  const notificacion = await enviarComprobante(comprobante);

  res.status(201).json({ comprobante, notificacion });
}

async function obtenerComprobante(req, res) {
  const [filas] = await pool.query(
    'SELECT * FROM vista_comprobante_pago WHERE cita_id = ?',
    [req.params.citaId]
  );

  if (filas.length === 0) {
    return res.status(404).json({ error: 'No hay comprobante de pago para esta cita' });
  }

  res.json(filas[0]);
}

module.exports = { pagarCita, obtenerComprobante };
