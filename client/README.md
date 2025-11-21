# Cliente - Sistema de Gestión de Solicitudes

Frontend del sistema de gestión de solicitudes desarrollado con **Next.js 16**, **React 19** y **TypeScript**.

---


## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.0.3 | Framework React con App Router |
| React | 19.2.0 | Librería UI |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Estilos utilitarios |
| Zustand | 5.0.8 | Estado global |
| Zod | 4.1.12 | Validación de esquemas |
| React Hook Form | 7.66.1 | Manejo de formularios |
| Chart.js | 4.5.1 | Gráficas |
| Shadcn/UI | - | Componentes UI |
| Sonner | 2.0.7 | Notificaciones toast |
| Lucide React | 0.554.0 | Iconos |

---

## Estructura del Proyecto

```
client/
├── app/                          # App Router (Next.js 16)
│   ├── (auth)/                   # Grupo de rutas de autenticación
│   │   ├── layout.tsx           # Layout con imagen lateral
│   │   ├── login/
│   │   │   └── page.tsx         # Página de login
│   │   └── register/
│   │       └── page.tsx         # Página de registro
│   │
│   ├── dashboard/                # Rutas protegidas
│   │   ├── layout.tsx           # Layout con sidebar
│   │   ├── page.tsx             # Redirección por rol
│   │   │
│   │   ├── admin/               # Panel Administrador
│   │   │   ├── page.tsx         # Dashboard con gráficas
│   │   │   ├── assign/
│   │   │   │   └── page.tsx     # Asignación de solicitudes
│   │   │   ├── requests/
│   │   │   │   └── page.tsx     # Listado completo
│   │   │   └── support-users/
│   │   │       └── page.tsx     # Gestión de usuarios soporte
│   │   │
│   │   ├── support/             # Panel Soporte
│   │   │   ├── page.tsx         # Dashboard de soporte
│   │   │   └── assigned-requests/
│   │   │       └── page.tsx     # Solicitudes asignadas
│   │   │
│   │   └── user/                # Panel Cliente
│   │       ├── page.tsx         # Dashboard del cliente
│   │       └── requests/
│   │           └── page.tsx     # Mis solicitudes
│   │
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Página principal (redirect)
│   └── globals.css              # Estilos globales
│
├── components/                   # Componentes React
│   ├── auth/
│   │   └── RoleProtectedRoute.tsx  # Protección de rutas por rol
│   │
│   ├── layout/
│   │   └── DashboardLayout.tsx  # Layout con sidebar y navegación
│   │
│   ├── requests/
│   │   ├── CreateRequestModal.tsx   # Modal para crear solicitud
│   │   ├── DeleteRequestModal.tsx   # Modal de confirmación
│   │   ├── RequestSkeleton.tsx      # Skeleton loaders
│   │   ├── RespondRequestModal.tsx  # Modal para responder
│   │   └── StatsSkeleton.tsx        # Skeleton de estadísticas
│   │
│   ├── support/
│   │   ├── AssignRequestModal.tsx       # Modal de asignación
│   │   ├── CreateSupportUserModal.tsx   # Modal crear usuario
│   │   ├── DeleteSupportUserModal.tsx   # Modal eliminar usuario
│   │   └── SelectSupport.tsx            # Selector de soporte
│   │
│   ├── ui/                      # Componentes Shadcn/UI
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   └── textarea.tsx
│   │
│   └── Profile.tsx              # Avatar de usuario
│
├── hooks/
│   └── useUserRole.ts           # Hook para obtener rol del usuario
│
├── lib/
│   ├── axios.ts                 # Instancia de Axios configurada
│   ├── requestUtils.ts          # Utilidades para solicitudes
│   └── utils.ts                 # Utilidades generales (cn, showNotification)
│
├── schemas/                     # Esquemas de validación Zod
│   ├── auth.schema.ts          # Login y Register
│   ├── request.schema.ts       # Responder solicitud
│   └── support.schema.ts       # Crear usuario soporte
│
├── services/                    # Servicios de API
│   ├── authService.ts          # Autenticación
│   ├── requestService.ts       # Solicitudes
│   └── userService.ts          # Usuarios soporte
│
├── store/                       # Estado global Zustand
│   ├── authStore.ts            # Estado de autenticación
│   ├── requestsStore.ts        # Estado de solicitudes
│   └── supportUsersStore.ts    # Estado de usuarios soporte
│
├── types/                       # Definiciones TypeScript
│   ├── auth.types.ts           # Tipos de autenticación
│   ├── requests.types.ts       # Tipos de solicitudes
│   ├── response.types.ts       # Tipos de respuesta API
│   └── support.types.ts        # Tipos de usuarios soporte
│
├── public/                      # Archivos estáticos
│   ├── image-login.webp
│   └── image-register.webp
│
├── components.json              # Configuración Shadcn/UI
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Patrones y Arquitectura

### Estado Global con Zustand

```typescript
// Ejemplo: authStore.ts
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    const response = await loginService(credentials);
    set({ user: response.user, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));
```

### Validación con Zod + React Hook Form

```typescript
// Schema
const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

// Uso en componente
const form = useForm<LoginFormData>({
  resolver: zodResolver(LoginSchema),
});
```

### Componentes Form de Shadcn/UI

```tsx
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Notificaciones Centralizadas

```typescript
// lib/utils.ts
export const showNotification = (
  message: string,
  description?: string,
  type: "success" | "error" | "info" | "warning" = "info"
) => {
  toast[type](message, { description });
};

// Uso
showNotification("¡Éxito!", "Solicitud creada", "success");
```

---

## Rutas y Protección

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro |
| `/dashboard` | Autenticado | Redirección por rol |
| `/dashboard/user/*` | CLIENT | Panel de cliente |
| `/dashboard/support/*` | SUPPORT | Panel de soporte |
| `/dashboard/admin/*` | ADMIN | Panel de administración |

### Protección de Rutas

```tsx
// Componente de protección
<RoleProtectedRoute allowedRoles={["ADMIN"]}>
  <AdminDashboard />
</RoleProtectedRoute>
```

---

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build
npm start
```

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3003/api
```

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run lint` | Ejecutar ESLint |

---

## Componentes Principales

### DashboardLayout
Layout compartido con sidebar responsive, navegación por rol y perfil de usuario.

### RoleProtectedRoute
HOC que protege rutas verificando el rol del usuario autenticado.

### Modales Reutilizables
- `CreateRequestModal` - Crear nueva solicitud
- `RespondRequestModal` - Responder solicitud (soporte)
- `AssignRequestModal` - Asignar solicitud (admin)
- `CreateSupportUserModal` - Crear usuario soporte
- `DeleteSupportUserModal` - Eliminar usuario soporte
---
