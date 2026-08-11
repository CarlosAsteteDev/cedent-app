const { Router } = require('express');
const { requireAuth, requireRole } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  disponibilidad,
  crearCita,
  misCitas,
  agendaEspecialista,
  obtenerCita,
} = require('../controllers/citasController');
const { pagarCita, obtenerComprobante } = require('../controllers/pagosController');
const { subirResultado, listarResultados } = require('../controllers/resultadosController');

const router = Router();

router.get('/disponibilidad', disponibilidad);
router.get('/mis-citas', requireAuth, requireRole('paciente'), misCitas);
router.get('/agenda', requireAuth, requireRole('especialista'), agendaEspecialista);
router.get('/:id', requireAuth, obtenerCita);
router.post('/', requireAuth, requireRole('paciente'), crearCita);

router.post('/:citaId/pago', requireAuth, requireRole('paciente'), pagarCita);
router.get('/:citaId/comprobante', requireAuth, obtenerComprobante);

router.post(
  '/:citaId/resultados',
  requireAuth,
  requireRole('especialista'),
  upload.single('archivo'),
  subirResultado
);
router.get('/:citaId/resultados', requireAuth, listarResultados);

module.exports = router;
