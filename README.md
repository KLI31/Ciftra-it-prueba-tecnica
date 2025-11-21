### Sistema de Gestión de Solicitudes - Prueba Técnica Cifra
Solución completa para el reto técnico de desarrollo Full Stack. Una plataforma web que permite la gestión de tickets de soporte simulando un flujo real entre Clientes, Agentes de Soporte y Administradores.

---
## 🛠️ Tecnologías y Decisiones Técnicas

Para el desarrollo de esta prueba tecnica se opto por el siguiente listado de tecnologias y herramientas:

### Frontend (Client)
* **Framework:** **Next.js**. Se eligió por su capacidad de renderizado híbrido y manejo eficiente de rutas protegidas.
* **Estilos:** **Tailwind CSS**. Para un diseño responsivo, rápido y moderno.
* **Estado Global:** **Zustand**. Elegido sobre Redux/Context API por ser más ligero, boilerplate-free y eficiente para manejar la sesión del usuario (Auth).
* **Validaciones:** **Zod + React Hook Form**. Garantiza que los datos enviados al backend sean correctos y mejora la UX.
* **Visualización:** **Chart.js, ShadcnUI**. Para renderizar las estadísticas en el panel administrativo y componentes reutilizables para la UI.

### Backend (Server)
* **Runtime:** **Node.js** con **Express**. Arquitectura RESTful clásica, modular y escalable.
* **Base de Datos:** **PostgreSQL**.
---
