function generarReferenciaIzipay() {
  const sufijo = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `IZI-SIM-${sufijo}`;
}

function procesarPagoSimulado() {
  return { aprobado: true, referencia: generarReferenciaIzipay() };
}

module.exports = { procesarPagoSimulado };
