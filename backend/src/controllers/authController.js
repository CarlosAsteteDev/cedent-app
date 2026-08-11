const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

function firmarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nombre_completo: usuario.nombre_completo, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

async function registro(req, res) {
  const { nombre_completo, correo, telefono, contrasena } = req.body;

  if (!nombre_completo || !correo || !contrasena) {
    return res.status(400).json({ error: 'nombre_completo, correo y contrasena son obligatorios' });
  }

  const [existentes] = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
  if (existentes.length > 0) {
    return res.status(409).json({ error: 'Ya existe una cuenta con ese correo' });
  }

  const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

  const [resultado] = await pool.query(
    'INSERT INTO usuarios (nombre_completo, correo, telefono, contrasena_hash, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre_completo, correo, telefono || null, contrasena_hash, 'paciente']
  );

  const usuario = {
    id: resultado.insertId,
    nombre_completo,
    correo,
    rol: 'paciente',
  };

  res.status(201).json({ usuario, token: firmarToken(usuario) });
}

async function login(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'correo y contrasena son obligatorios' });
  }

  const [filas] = await pool.query(
    'SELECT id, nombre_completo, correo, contrasena_hash, rol FROM usuarios WHERE correo = ?',
    [correo]
  );

  if (filas.length === 0) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const usuarioDb = filas[0];
  const coincide = await bcrypt.compare(contrasena, usuarioDb.contrasena_hash);
  if (!coincide) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const usuario = {
    id: usuarioDb.id,
    nombre_completo: usuarioDb.nombre_completo,
    correo: usuarioDb.correo,
    rol: usuarioDb.rol,
  };

  res.json({ usuario, token: firmarToken(usuario) });
}

async function perfil(req, res) {
  const [filas] = await pool.query(
    'SELECT id, nombre_completo, correo, telefono, rol FROM usuarios WHERE id = ?',
    [req.usuario.id]
  );
  if (filas.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(filas[0]);
}

module.exports = { registro, login, perfil };
