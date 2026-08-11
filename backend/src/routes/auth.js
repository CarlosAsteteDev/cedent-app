const { Router } = require('express');
const { registro, login, perfil } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', requireAuth, perfil);

module.exports = router;
