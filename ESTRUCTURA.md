# Estructura de directorios — CEDENT

Estructura real del código en `app/` (generada a partir del repositorio, sin `node_modules`).

## Backend (`app/backend`)

```
backend/
├── .env                          # Credenciales locales (no versionado)
├── .env.example                  # Plantilla de variables de entorno
├── package.json
├── comprobantes/                 # Comprobantes de pago simulados (HTML), generados en runtime
├── uploads/
│   └── resultados/                # Archivos de resultados clínicos subidos por especialistas
└── src/
    ├── server.js                  # Punto de entrada: levanta el servidor Express
    ├── app.js                     # Configuración de Express: middlewares globales, montaje de rutas, manejo de errores
    ├── config/
    │   └── db.js                  # Pool de conexión a MySQL (mysql2), configurado desde variables de entorno
    ├── middlewares/
    │   ├── auth.js                # requireAuth (verifica JWT) y requireRole (autorización por rol)
    │   └── upload.js              # Configuración de multer para la subida de resultados clínicos
    ├── routes/
    │   ├── auth.js                # POST /api/auth/registro, /login · GET /perfil
    │   ├── catalogo.js            # GET /api/especialidades, /api/servicios
    │   ├── citas.js                # /api/citas: disponibilidad, reserva, agenda, pago, comprobante, resultados
    │   └── contacto.js            # GET /api/contacto
    ├── controllers/
    │   ├── authController.js      # Registro, login (bcrypt + JWT), perfil
    │   ├── catalogoController.js  # Especialidades, servicios y especialistas por servicio
    │   ├── citasController.js     # Disponibilidad, reserva, mis-citas, agenda del especialista
    │   ├── pagosController.js     # Pago simulado, transacción SQL, comprobante
    │   └── resultadosController.js # Subida y listado de resultados clínicos
    └── utils/
        ├── izipay.js               # Simulación de aprobación de pago (referencia IZI-SIM-xxxx)
        └── mailer.js               # Notificación simulada del comprobante (nodemailer jsonTransport)
```

## Frontend (`app/frontend`)

```
frontend/
├── .env                          # VITE_API_URL (URL del backend)
├── .env.example
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                   # Punto de entrada: BrowserRouter + AuthProvider + App
    ├── App.jsx                    # Definición de rutas (públicas, protegidas por rol)
    ├── index.css                  # Estilos base globales
    ├── api/
    │   └── client.js              # Instancia de axios con interceptor que agrega el JWT a cada request
    ├── context/
    │   └── AuthContext.jsx         # Estado de sesión (usuario, login, logout) vía React Context
    ├── components/
    │   ├── NavBar.jsx              # Barra de navegación, condicional según rol de sesión
    │   └── ProtectedRoute.jsx      # Bloquea rutas privadas según sesión y rol
    ├── utils/
    │   └── fecha.js                # Fecha local (evita el bug de huso horario de toISOString)
    └── pages/
        ├── Home.jsx                 # IU00X - Landing
        ├── Registro.jsx             # IU001 - Registro de paciente
        ├── Login.jsx                # IU002 - Inicio de sesión
        ├── Catalogo.jsx             # IU003 - Catálogo de servicios y tarifario
        ├── ReservarCita.jsx         # IU004 - Reserva de cita
        ├── Pago.jsx                 # IU005 - Pago simulado
        ├── DashboardAgenda.jsx      # IU006 - Dashboard de agenda del especialista
        ├── ResultadosClinicos.jsx   # IU007 - Resultados clínicos
        ├── Contacto.jsx             # IU008 - Contacto y ubicación
        ├── Comprobante.jsx          # IU009 - Confirmación y comprobante
        └── MisCitas.jsx             # Listado de citas del paciente
```
