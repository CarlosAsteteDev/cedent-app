const { Router } = require('express');
const {
  listarEspecialidades,
  listarServicios,
  listarEspecialistasPorServicio,
} = require('../controllers/catalogoController');

const router = Router();

router.get('/especialidades', listarEspecialidades);
router.get('/servicios', listarServicios);
router.get('/servicios/:servicioId/especialistas', listarEspecialistasPorServicio);

module.exports = router;
