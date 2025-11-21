# Servidor - Sistema de Gestión de Solicitudes

Backend RESTful API desarrollado con **Node.js**, **Express 5** y **PostgreSQL**.

---

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 18+ | Runtime JavaScript |
| Express | 5.1.0 | Framework web |
| PostgreSQL | 15+ | Base de datos relacional |
| pg | 8.16.3 | Cliente PostgreSQL |
| JWT | 9.0.2 | Autenticación |
| Bcrypt | 6.0.0 | Hash de contraseñas |
| Morgan | 1.10.1 | Logger HTTP |
| CORS | 2.8.5 | Cross-Origin Resource Sharing |
| Dotenv | 17.2.3 | Variables de entorno |
| Nodemon | 3.1.11 | Hot reload en desarrollo |

---

## Estructura del Proyecto

```
server/
├── controllers/                 # Lógica de negocio
│   ├── authController.js       # Registro y login
│   ├── requestController.js    # CRUD de solicitudes
│   └── userController.js       # Gestión de usuarios soporte
│
├── database/
│   ├── db.js                   # Pool de conexiones PostgreSQL
│   └── init.sql                # Script de inicialización BD
│
├── middleware/
│   └── authMiddleware.js       # Verificación JWT y roles
│
├── routes/
│   ├── routes.js               # Router principal
│   ├── authRoutes.js           # /api/auth/*
│   ├── requestsRoutes.js       # /api/requests/*
│   └── usersRoutes.js          # /api/users/*
│
├── utils/
│   ├── db.js                   # Configuración de conexión BD
│   ├── helper.js               # Funciones helper (responses, validaciones)
│   └── messages.js             # Mensajes centralizados
│
├── .env                        # Variables de entorno (no commitear)
├── .env.example                # Ejemplo de variables
├── index.js                    # Punto de entrada
└── package.json
```

---

## API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/register` | Registro de usuario | `{ name, lastname, email, password, role? }` |
| POST | `/login` | Iniciar sesión | `{ email, password }` |

### Solicitudes (`/api/requests`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/` | Listar solicitudes | Autenticado |
| GET | `/:id` | Obtener solicitud | Autenticado |
| POST | `/` | Crear solicitud | CLIENT |
| PUT | `/:id/assign` | Asignar solicitud | ADMIN |
| PUT | `/:id/respond` | Responder solicitud | SUPPORT |
| DELETE | `/:id` | Eliminar solicitud | CLIENT/ADMIN |
| GET | `/stats` | Estadísticas | ADMIN |

### Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/support` | Listar usuarios soporte | ADMIN |
| POST | `/support` | Crear usuario soporte | ADMIN |
| DELETE | `/support/:id` | Eliminar usuario soporte | ADMIN |

---

## Modelo de Datos

### Diagrama ER

<!-- Agregar diagrama de Excalidraw -->

![ER Diagram](../screenshots/er-diagram-excalidraw.png)

### Tabla `users`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CLIENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipos ENUM
CREATE TYPE user_role AS ENUM ('CLIENT', 'SUPPORT', 'ADMIN');
```

### Tabla `requests`

```sql
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    status request_status NOT NULL DEFAULT 'pending',
    response TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para optimizar consultas
CREATE INDEX idx_requests_status_support ON requests(status, assigned_to);

-- Tipos ENUM
CREATE TYPE request_status AS ENUM ('pending', 'in_progress', 'resolved', 'rejected');
```

---

## Arquitectura

### Flujo de una Petición

```
Request → Middleware (Auth) → Route → Controller → Database → Response
```

### Middleware de Autenticación

```javascript
// authMiddleware.js
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return sendError(res, messages.auth.noToken);
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; // { userId, role }
  next();
};

// Protección por rol
const roleMiddleware = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return sendError(res, messages.auth.unauthorized);
  }
  next();
};
```

### Patrón de Respuestas

```javascript
// utils/helper.js
const sendResponse = (res, messageObj, data = {}) => {
  return res.status(messageObj.status).json({
    success: true,
    message: messageObj.message,
    ...data,
  });
};

const sendError = (res, messageObj) => {
  return res.status(messageObj.status).json({
    success: false,
    message: messageObj.message,
  });
};
```

### Mensajes Centralizados

```javascript
// utils/messages.js
const messages = {
  auth: {
    loginSuccess: { status: 200, message: "Inicio de sesión exitoso" },
    registerSuccess: { status: 201, message: "Usuario registrado exitosamente" },
    invalidCredentials: { status: 401, message: "Credenciales inválidas" },
    // ...
  },
  requests: {
    createSuccess: { status: 201, message: "Solicitud creada exitosamente" },
    notFound: { status: 404, message: "Solicitud no encontrada" },
    // ...
  },
};
```

---

## Instalación

### 1. Prerrequisitos
- Node.js 18+
- PostgreSQL 15+

### 2. Clonar y configurar

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env
```

### 3. Configurar Base de Datos

```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE cifra_it;"

# Ejecutar script de inicialización
psql -U postgres -d cifra_it -f database/init.sql
```

### 4. Variables de Entorno

```env
PORT=3001
DB_USER=tu_usuario_db
DB_HOST=tu_host_db
DB_NAME=cifra_it
DB_PASSWORD=tu_password_db
DB_PORT=5432
JWT_SECRET=tu_secret_key
```

### 5. Ejecutar

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm start
```

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor con nodemon (hot reload) |
| `npm test` | Ejecutar tests (pendiente) |

---

## Ejemplos de Uso

### Registro de Usuario

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "lastname": "Pérez",
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

### Crear Solicitud (CLIENT)

```bash
curl -X POST http://localhost:3001/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Problema con mi cuenta"
  }'
```

### Asignar Solicitud (ADMIN)

```bash
curl -X PUT http://localhost:3001/api/requests/:id/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "supportId": "uuid-del-soporte"
  }'
```

### Responder Solicitud (SUPPORT)

```bash
curl -X PUT http://localhost:3001/api/requests/:id/respond \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "status": "resolved",
    "response": "Tu problema ha sido solucionado..."
  }'
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | Éxito |
| 201 | Recurso creado |
| 400 | Bad Request (datos inválidos) |
| 401 | No autenticado |
| 403 | No autorizado (rol insuficiente) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Seguridad

- **Contraseñas hasheadas** con bcrypt (salt rounds: 10)
- **JWT** con expiración de 24 horas
- **Validación de emails** con regex
- **Protección de rutas** por rol
- **CORS** configurado para permitir origen específico
- **Headers de autorización** Bearer token

---
