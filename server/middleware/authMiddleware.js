const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/helper");
const messages = require("../utils/messages");

const verifyToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendError(res, messages.auth.noTokenProvided);
    }

    // Formato esperado: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return sendError(res, messages.auth.noTokenProvided);
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar información del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Token inválido o expirado
    if (error.name === "TokenExpiredError") {
      return sendError(res, messages.auth.tokenExpired);
    }
    return sendError(res, messages.auth.invalidToken);
  }
};

// Middleware para verificar roles de usuario
const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, messages.auth.unauthorized);
      }

      // Verificar que el rol del usuario esté en los roles permitidos
      if (!allowedRoles.includes(req.user.role)) {
        return sendError(res, messages.requests.notAuthorized);
      }

      next();
    } catch (error) {
      return sendError(res, messages.server.internalError);
    }
  };
};

module.exports = {
  verifyToken,
  verifyRole,
};
