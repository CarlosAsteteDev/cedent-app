const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const COMPROBANTES_DIR = path.join(__dirname, '..', '..', 'comprobantes');
if (!fs.existsSync(COMPROBANTES_DIR)) {
  fs.mkdirSync(COMPROBANTES_DIR, { recursive: true });
}

// Transporte simulado: no envía correo real, solo compone el mensaje.
// Sustituir por un transporte SMTP real (con credenciales en .env) para producción.
const transporter = nodemailer.createTransport({ jsonTransport: true });

function construirHtmlComprobante(c) {
  return `
    <h2>CEDENT - Comprobante de pago</h2>
    <p>Estimado/a ${c.paciente},</p>
    <p>Su pago ha sido registrado con éxito.</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr><td>N° de pago</td><td>${c.pago_id}</td></tr>
      <tr><td>Referencia IZIPAY</td><td>${c.referencia_izipay}</td></tr>
      <tr><td>Fecha de pago</td><td>${c.fecha_pago}</td></tr>
      <tr><td>Especialidad</td><td>${c.especialidad}</td></tr>
      <tr><td>Servicio</td><td>${c.servicio}</td></tr>
      <tr><td>Especialista</td><td>${c.especialista}</td></tr>
      <tr><td>Fecha de la cita</td><td>${c.fecha_cita} ${c.hora_cita}</td></tr>
      <tr><td>Monto</td><td>S/ ${c.monto}</td></tr>
    </table>
    <p>Gracias por confiar en CEDENT.</p>
  `;
}

async function enviarComprobante(comprobante) {
  const html = construirHtmlComprobante(comprobante);

  const info = await transporter.sendMail({
    from: '"CEDENT" <no-responder@cedent.pe>',
    to: comprobante.correo_paciente,
    subject: `Comprobante de pago - Cita #${comprobante.cita_id}`,
    html,
  });

  const archivo = path.join(COMPROBANTES_DIR, `comprobante-cita-${comprobante.cita_id}.html`);
  fs.writeFileSync(archivo, html, 'utf-8');

  console.log(`[Notificación simulada] Comprobante de la cita #${comprobante.cita_id} "enviado" a ${comprobante.correo_paciente}`);
  console.log(`[Notificación simulada] Copia guardada en ${archivo}`);

  return { simulado: true, destinatario: comprobante.correo_paciente, archivo, messageId: info.messageId };
}

module.exports = { enviarComprobante };
