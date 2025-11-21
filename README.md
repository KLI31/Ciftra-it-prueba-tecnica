# Sistema de Gestión de Solicitudes - Prueba Técnica Cifra

Solución completa para el reto técnico de desarrollo Full Stack. Una plataforma web que permite la gestión de tickets de soporte simulando un flujo real entre **Clientes**, **Agentes de Soporte** y **Administradores**.

---

## Vista Previa

<!-- Agregar capturas de pantalla del proyecto -->

| Login & Register | Dashboard Admin |
|-------|-----------------|

<img width="1914" height="910" alt="login" src="https://github.com/user-attachments/assets/28b350a8-8776-4ee1-84b4-4a3bd134d097" />
<img width="1919" height="912" alt="Captura de pantalla 2025-11-21 141153" src="https://github.com/user-attachments/assets/aa58f940-61df-426f-8657-18935fd28f0a" />

<img width="1903" height="912" alt="admin-dashboard" src="https://github.com/user-attachments/assets/50ec98aa-6f7e-4c1b-855e-8ae101b23409" />

| Panel de Soporte | Panel de Cliente |
|------------------|------------------|
<img width="1918" height="917" alt="dashboard-soporte" src="https://github.com/user-attachments/assets/4f8eb840-5b4e-4242-9ac9-84fb50034be2" />
<img width="1916" height="914" alt="dashboard-usuario" src="https://github.com/user-attachments/assets/0c557d9b-723e-40dc-8ff3-e003a29207c4" />



---

## Diagrama de Flujo

<img width="1223" height="707" alt="Flujo" src="https://github.com/user-attachments/assets/d3345302-0a39-43f7-8461-db434b069f20" />

## Tecnologías y Decisiones Técnicas

### Frontend (Client)

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **Next.js** | 16.0.3 | Framework de React con App Router, renderizado híbrido y manejo eficiente de rutas protegidas |
| **React** | 19.2.0 | Última versión estable con mejoras de rendimiento |
| **TypeScript** | 5.x | Tipado estático para mayor robustez y mejor DX |
| **Tailwind CSS** | 4.x | Utilidades CSS para diseño responsivo y desarrollo rápido |
| **Zustand** | 5.0.8 | Estado global ligero, sin boilerplate, más eficiente que Redux |
| **Zod** | 4.1.12 | Validación de esquemas con inferencia de tipos TypeScript |
| **React Hook Form** | 7.66.1 | Manejo de formularios performante con validación integrada |
| **Chart.js** | 4.5.1 | Gráficas interactivas para el dashboard administrativo |
| **Shadcn/UI** | - | Componentes accesibles y personalizables basados en Radix UI |
| **Sonner** | 2.0.7 | Sistema de notificaciones toast elegante |
| **Lucide React** | 0.554.0 | Iconografía consistente y ligera |

### Backend (Server)

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **Node.js** | 18+ | Runtime JavaScript eficiente para APIs |
| **Express** | 5.1.0 | Framework minimalista y flexible para REST APIs |
| **PostgreSQL** | 15+ | Base de datos relacional robusta y escalable |
| **JWT** | 9.0.2 | Autenticación stateless segura |
| **Bcrypt** | 6.0.0 | Hash de contraseñas con salt |
| **pg** | 8.16.3 | Cliente PostgreSQL nativo para Node.js |

---

## Características Implementadas

### Autenticación y Autorización
- [x] Registro de usuarios con validación de datos
- [x] Login con JWT
- [x] Protección de rutas por rol (CLIENT, SUPPORT, ADMIN)
- [x] Persistencia de sesión en localStorage
- [x] Logout con limpieza de estado

### Panel de Cliente (CLIENT)
- [x] Dashboard con estadísticas personales
- [x] Crear nuevas solicitudes
- [x] Listado de solicitudes propias
- [x] Visualización del estado y respuestas
- [x] Eliminación de solicitudes propias

### Panel de Soporte (SUPPORT)
- [x] Dashboard con métricas de rendimiento
- [x] Listado de solicitudes asignadas
- [x] Filtrado por estado
- [x] Responder y actualizar estado de solicitudes
- [x] Tasa de resolución calculada

### Panel de Administrador (ADMIN)
- [x] Dashboard con gráficas estadísticas (Chart.js)
- [x] Visualización de todas las solicitudes
- [x] Asignación de solicitudes a usuarios de soporte
- [x] Reasignación de solicitudes
- [x] Gestión de usuarios de soporte (CRUD)
- [x] Filtros avanzados y exportación a CSV
- [x] Métricas de rendimiento del equipo

### UX/UI
- [x] Diseño completamente responsivo
- [x] Skeleton loaders durante la carga
- [x] Notificaciones toast para feedback
- [x] Validación de formularios en tiempo real
- [x] Modales reutilizables
- [x] Sidebar colapsable en móvil

---

## Estructura del Proyecto

```
cifra-it/
├── client/                    # Frontend Next.js
│   ├── app/                   # App Router (páginas)
│   │   ├── (auth)/           # Rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── dashboard/        # Rutas protegidas
│   │       ├── admin/        # Panel administrador
│   │       ├── support/      # Panel soporte
│   │       └── user/         # Panel cliente
│   ├── components/           # Componentes React
│   │   ├── auth/            # Componentes de autenticación
│   │   ├── layout/          # Layout compartido
│   │   ├── requests/        # Componentes de solicitudes
│   │   ├── support/         # Componentes de soporte
│   │   └── ui/              # Shadcn UI components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilidades
│   ├── schemas/             # Esquemas Zod
│   ├── services/            # Llamadas a la API
│   ├── store/               # Estado global (Zustand)
│   └── types/               # Definiciones TypeScript
│
├── server/                   # Backend Express
│   ├── controllers/         # Lógica de negocio
│   ├── database/            # Configuración BD y esquemas
│   ├── middleware/          # Middlewares (auth, etc.)
│   ├── routes/              # Definición de rutas
│   └── utils/               # Helpers y utilidades
│
└── README.md                # Este archivo
```

---

## Modelo de Base de Datos


### Tablas

#### `users`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR(50) | Nombre del usuario |
| lastname | VARCHAR(50) | Apellido del usuario |
| email | VARCHAR(100) | Email único |
| password | VARCHAR(255) | Contraseña hasheada |
| role | ENUM | CLIENT, SUPPORT, ADMIN |
| created_at | TIMESTAMP | Fecha de creación |

#### `requests`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| title | VARCHAR(100) | Título de la solicitud |
| status | ENUM | pending, in_progress, resolved, rejected |
| response | TEXT | Respuesta del soporte |
| client_id | UUID | FK -> users.id |
| assigned_to | UUID | FK -> users.id (SUPPORT) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

---

## API Endpoints

### Autenticación
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Registro de usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |

### Solicitudes
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/requests` | Listar solicitudes | Autenticado |
| GET | `/api/requests/:id` | Obtener solicitud | Autenticado |
| POST | `/api/requests` | Crear solicitud | CLIENT |
| PUT | `/api/requests/:id/assign` | Asignar solicitud | ADMIN |
| PUT | `/api/requests/:id/respond` | Responder solicitud | SUPPORT |
| DELETE | `/api/requests/:id` | Eliminar solicitud | CLIENT/ADMIN |
| GET | `/api/requests/stats` | Estadísticas | ADMIN |

### Usuarios
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/users/support` | Listar usuarios soporte | ADMIN |
| POST | `/api/users/support` | Crear usuario soporte | ADMIN |
| DELETE | `/api/users/support/:id` | Eliminar usuario soporte | ADMIN |

---

## Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/KLI31/Cifra-it-prueba-tecnica
cd cifra-it
```

### 2. Configurar la Base de Datos
```sql
-- Crear base de datos
CREATE DATABASE cifra_it;

-- Ejecutar el script de migración
-- (ver archivo server/database/schema.sql)
```

### 3. Configurar Variables de Entorno

**Server (.env)**
```env
PORT=3001
DB_USER=tu_usuario_db
DB_HOST=tu_host_db
DB_NAME=cifra_it
DB_PASSWORD=tu_password_db
DB_PORT=5432
JWT_SECRET=tu_secret_key
```

**Client (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Instalar Dependencias y Ejecutar

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

### 5. Acceder a la Aplicación
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
---


## Decisiones de Diseño

### ¿Por qué Zustand sobre Redux?
- **Menos boilerplate:** No requiere actions, reducers, ni providers
- **Bundle más pequeño:** ~1kb vs ~7kb de Redux Toolkit
- **API simple:** Estado y acciones en un solo lugar
- **Mejor DX:** No requiere herramientas adicionales para async

### ¿Por qué Zod sobre Yup?
- **TypeScript first:** Inferencia de tipos automática
- **Mejor rendimiento:** Validación más rápida
- **API más limpia:** Sintaxis más legible
- **Ecosistema:** Mejor integración con React Hook Form

### ¿Por qué Next.js App Router?
- **Server Components:** Mejor SEO y performance
- **Layouts anidados:** Código más organizado
- **Loading states:** Suspense integrado
---

## Autor

**Luis David Rambao Fuentes**

- GitHub: [KLI31](https://github.com/KLI31)
- LinkedIn: [Luis David](https://www.linkedin.com/in/luisrambao/)

---

<p align="center">
  Desarrollado con ❤️ para la prueba técnica de <strong>Cifra</strong>
</p>
