/**
 * Mensajes centralizados del servidor
 * Agrupa todos los mensajes de respuesta por módulo
 * Cada mensaje incluye el código HTTP y el mensaje descriptivo
 */

const messages = {
  auth: {
    registerSuccess: {
      status: 201,
      message: "Usuario registrado exitosamente",
    },
    loginSuccess: {
      status: 200,
      message: "Inicio de sesión exitoso",
    },
    logoutSuccess: {
      status: 200,
      message: "Sesión cerrada exitosamente",
    },

    invalidEmail: {
      status: 400,
      message: "El formato del email no es válido",
    },
    invalidPassword: {
      status: 400,
      message:
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número",
    },
    invalidName: {
      status: 400,
      message:
        "El nombre solo puede contener letras y espacios (2-50 caracteres)",
    },
    invalidLastname: {
      status: 400,
      message:
        "El apellido solo puede contener letras y espacios (2-50 caracteres)",
    },
    missingFields: {
      status: 400,
      message: "Todos los campos son requeridos",
    },
    passwordsDoNotMatch: {
      status: 400,
      message: "Las contraseñas no coinciden",
    },

    invalidCredentials: {
      status: 401,
      message: "Credenciales inválidas",
    },
    emailAlreadyExists: {
      status: 409,
      message: "El email ya está registrado",
    },
    unauthorized: {
      status: 401,
      message: "No autorizado. Por favor, inicia sesión",
    },
    invalidToken: {
      status: 401,
      message: "Token inválido o expirado",
    },
    noTokenProvided: {
      status: 401,
      message: "No se proporcionó token de autenticación",
    },
    tokenExpired: {
      status: 401,
      message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente",
    },
  },

  server: {
    internalError: {
      status: 500,
      message: "Error interno del servidor. Por favor, intenta nuevamente",
    },
    databaseError: {
      status: 500,
      message: "Error de conexión con la base de datos",
    },
  },
  requests: {
    // Éxito (2xx)
    createSuccess: {
      status: 201,
      message: "Solicitud creada exitosamente",
    },
    updateSuccess: {
      status: 200,
      message: "Solicitud actualizada exitosamente",
    },
    deleteSuccess: {
      status: 200,
      message: "Solicitud eliminada exitosamente",
    },
    getSuccess: {
      status: 200,
      message: "Solicitud obtenida exitosamente",
    },
    listSuccess: {
      status: 200,
      message: "Solicitudes obtenidas exitosamente",
    },
    assignSuccess: {
      status: 200,
      message: "Solicitud asignada exitosamente",
    },
    responseSuccess: {
      status: 200,
      message: "Respuesta enviada exitosamente",
    },
    statusUpdateSuccess: {
      status: 200,
      message: "Estado actualizado exitosamente",
    },

    // Validación (4xx)
    missingFields: {
      status: 400,
      message: "Todos los campos requeridos deben ser proporcionados",
    },
    invalidTitle: {
      status: 400,
      message: "El título debe tener entre 5 y 100 caracteres",
    },
    invalidDescription: {
      status: 400,
      message: "La descripción debe tener entre 10 y 500 caracteres",
    },
    invalidStatus: {
      status: 400,
      message:
        "Estado inválido. Debe ser: PENDING, IN_PROGRESS, RESOLVED o REJECTED",
    },
    invalidResponse: {
      status: 400,
      message: "La respuesta debe tener al menos 10 caracteres",
    },
    invalidAssignment: {
      status: 400,
      message: "El usuario asignado debe tener rol SUPPORT",
    },

    notAuthorized: {
      status: 403,
      message: "No tienes permiso para realizar esta acción",
    },
    notYourRequest: {
      status: 403,
      message: "No puedes acceder a solicitudes de otros usuarios",
    },
    notAssignedToYou: {
      status: 403,
      message: "Esta solicitud no está asignada a ti",
    },
    onlyAdminCanAssign: {
      status: 403,
      message: "Solo los administradores pueden asignar solicitudes",
    },
    onlySupportCanRespond: {
      status: 403,
      message: "Solo el soporte asignado puede responder",
    },

    notFound: {
      status: 404,
      message: "Solicitud no encontrada",
    },
    userNotFound: {
      status: 404,
      message: "Usuario no encontrado",
    },
    noRequests: {
      status: 404,
      message: "No se encontraron solicitudes",
    },

    alreadyResolved: {
      status: 409,
      message: "Esta solicitud ya fue resuelta",
    },
    alreadyAssigned: {
      status: 409,
      message: "Esta solicitud ya está asignada",
    },
  },
};

module.exports = messages;
