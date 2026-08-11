const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const catalogoRoutes = require('./routes/catalogo');
const citasRoutes = require('./routes/citas');
const contactoRoutes = require('./routes/contacto');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api', catalogoRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/contacto', contactoRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador de errores centralizado (Express 5 reenvía automáticamente
// los rechazos de promesas de los controladores async hasta aquí).
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = app;
