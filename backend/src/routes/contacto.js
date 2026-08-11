const { Router } = require('express');

const router = Router();

// RF09 / CU008: información estática de contacto y ubicación de la clínica.
router.get('/', (_req, res) => {
  res.json({
    nombre: 'CEDENT',
    direccion: 'Av. Brasil, Breña, Lima, Perú',
    telefono: '(01) 555-0000',
    whatsapp: '+51 987 000 000',
    correo: 'contacto@cedent.pe',
    horario: 'Lunes a sábado, 9:00 a.m. - 6:00 p.m.',
    mapa: {
      lat: -12.0559,
      lng: -77.0561,
    },
  });
});

module.exports = router;
