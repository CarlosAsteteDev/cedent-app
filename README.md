# CEDENT — Guía de inicialización y validación

Guía para levantar el proyecto localmente y probar el flujo completo. Este archivo es de trabajo del equipo (no forma parte del informe académico).

## Requisitos previos

- **Node.js 20+** y **npm 10+**
- **MySQL 8.0** corriendo en local, con la base `cedent` ya creada y poblada (`database/schema.sql` en la raíz del proyecto, un nivel arriba de esta carpeta `app/`)

## 1. Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` (no está en git) copiando `.env.example` y completando la contraseña de MySQL:

```bash
cp .env.example .env
```

```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<tu contraseña de MySQL>
DB_NAME=cedent
JWT_SECRET=<cualquier cadena secreta>
JWT_EXPIRES_IN=8h
FRONTEND_URL=http://localhost:5173
```

Levantar el servidor:

```bash
npm run dev
```

Debe quedar escuchando en `http://localhost:4000`. Verificación rápida:

```bash
curl http://localhost:4000/api/health
```

Debe responder `{"ok":true}`.

## 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Queda disponible en `http://localhost:5173`. El archivo `.env` del frontend ya apunta a `http://localhost:4000/api` (`VITE_API_URL`); solo hace falta ajustarlo si el backend corre en otro puerto o host.

## 3. Cuentas de prueba

La base de datos trae usuarios de ejemplo. Todos usan la contraseña **`Demo123!`**:

| Correo | Rol | Detalle |
|---|---|---|
| `carlos.mendoza@example.com` | paciente | tiene citas de ejemplo ya reservadas |
| `maria.fernandez@example.com` | paciente | sin citas previas |
| `juan.ramirez@cedent.pe` | especialista | Odontología general |
| `ana.perez@cedent.pe` | especialista | Ortodoncia |
| `lucia.torres@cedent.pe` | especialista | Estética dental |
| `admin@cedent.pe` | administrador | sin panel propio en esta etapa (no está en el alcance de los 9 casos de uso) |

También puedes registrar una cuenta de paciente nueva desde `/registro`.

## 4. Flujo para validar (camino feliz)

**Como paciente** (`carlos.mendoza@example.com` o una cuenta nueva):
1. Iniciar sesión → redirige al catálogo.
2. Ver el catálogo de servicios y tarifario, filtrar por especialidad.
3. Reservar una cita: elegir servicio → especialista → fecha → hora disponible.
4. Pagar la cita (formulario de tarjeta simulado — cualquier dato sirve, siempre aprueba).
5. Ver el comprobante de pago generado.
6. Revisar "Mis citas" y volver a ver el comprobante o los resultados clínicos de una cita pagada.

**Como especialista** (`juan.ramirez@cedent.pe`, atiende Odontología general):
1. Iniciar sesión → redirige directo a "Mi agenda".
2. Cambiar la fecha para ver las citas programadas.
3. Entrar a "Resultados clínicos" de una cita propia y subir un archivo (PDF, PNG o JPG).
4. Verificar que un especialista **no puede** subir resultados a una cita de otro especialista (debe rechazar con error de autorización).

## 5. Notas sobre lo simulado

- **Pago (IZIPAY):** no hay integración real. El backend siempre aprueba el pago y genera una referencia falsa (`IZI-SIM-xxxx`).
- **Notificación por correo:** no se envía correo real. El backend genera el comprobante y guarda una copia en `backend/comprobantes/comprobante-cita-<id>.html` — ahí se puede abrir para ver cómo habría quedado el correo.
- **Resultados clínicos:** los archivos subidos quedan en `backend/uploads/resultados/` (no versionado en git).

## 6. Problemas comunes

- **El backend no conecta a MySQL:** revisar que `DB_PASSWORD` en `backend/.env` sea correcto y que el servicio de MySQL esté corriendo.
- **CORS o "Network Error" en el frontend:** confirmar que el backend esté corriendo en el puerto que indica `VITE_API_URL` (`frontend/.env`).
- **Un usuario de ejemplo no puede iniciar sesión:** todas las cuentas semilla usan `Demo123!`; si se recreó la base de datos desde `database/schema.sql` sin este ajuste, los hashes de contraseña son placeholders y no van a servir para iniciar sesión hasta reasignarles una contraseña real.
