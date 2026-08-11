const multer = require('multer');
const path = require('path');

const DESTINO = path.join(__dirname, '..', '..', 'uploads', 'resultados');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, DESTINO),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `cita-${req.params.citaId}-${Date.now()}${extension}`);
  },
});

const TIPOS_PERMITIDOS = new Set(['application/pdf', 'image/png', 'image/jpeg']);

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!TIPOS_PERMITIDOS.has(file.mimetype)) {
      return cb(new Error('Tipo de archivo no permitido (solo PDF, PNG o JPG)'));
    }
    cb(null, true);
  },
});

module.exports = upload;
