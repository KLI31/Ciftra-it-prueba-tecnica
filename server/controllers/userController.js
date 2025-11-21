const pool = require("../utils/db");
const bcrypt = require("bcryptjs");
const messages = require("../utils/messages");
const { sendResponse, sendError, verifyEmail } = require("../utils/helper");

const getSupportUsers = async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        name,
        lastname,
        email,
        role,
        created_at
      FROM users
      WHERE role = 'SUPPORT'
      ORDER BY name ASC
    `;

    const result = await pool.query(query);

    return sendResponse(res, messages.support.getSupports, {
      users: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching support users:", error);
    return sendError(res, messages.server.internalError);
  }
};

const createSupportUser = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    // Validaciones
    if (!name || !lastname || !email || !password) {
      return sendError(res, messages.validation.requiredFields);
    }

    if (name.length < 2 || name.length > 50) {
      return sendError(res, {
        ...messages.validation.invalidField,
        message: "El nombre debe tener entre 2 y 50 caracteres",
      });
    }

    if (lastname.length < 2 || lastname.length > 50) {
      return sendError(res, {
        ...messages.validation.invalidField,
        message: "El apellido debe tener entre 2 y 50 caracteres",
      });
    }

    const validEmail = verifyEmail(email);

    if (!validEmail) {
      return sendError(res, messages.validation.invalidEmail);
    }

    if (password.length < 6) {
      return sendError(res, {
        ...messages.validation.invalidField,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()],
    );

    if (existingUser.rows.length > 0) {
      return sendError(res, messages.auth.emailExists);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario de soporte
    const insertQuery = `
      INSERT INTO users (name, lastname, email, password, role)
      VALUES ($1, $2, $3, $4, 'SUPPORT')
      RETURNING id, name, lastname, email, role, created_at
    `;

    const result = await pool.query(insertQuery, [
      name.trim(),
      lastname.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
    ]);

    const newUser = result.rows[0];

    return sendResponse(
      res,
      { status: 201, message: "Usuario de soporte creado exitosamente" },
      { user: newUser },
    );
  } catch (error) {
    console.error("Error creating support user:", error);
    return sendError(res, messages.server.internalError);
  }
};

const deleteSupportUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userCheck = await pool.query(
      "SELECT id, role FROM users WHERE id = $1",
      [id],
    );

    if (userCheck.rows.length === 0) {
      return sendError(res, {
        ...messages.general.notFound,
        message: "Usuario no encontrado",
      });
    }

    if (userCheck.rows[0].role !== "SUPPORT") {
      return sendError(res, {
        ...messages.requests.notAuthorized,
        message: "Solo se pueden eliminar usuarios de soporte",
      });
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    return sendResponse(
      res,
      { status: 200, message: "Usuario de soporte eliminado exitosamente" },
      null,
    );
  } catch (error) {
    console.error("Error deleting support user:", error);
    return sendError(res, messages.server.internalError);
  }
};

module.exports = {
  getSupportUsers,
  createSupportUser,
  deleteSupportUser,
};
