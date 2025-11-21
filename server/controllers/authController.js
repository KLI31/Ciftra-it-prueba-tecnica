const pool = require("../utils/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResponse, sendError, verifyEmail } = require("../utils/helper");
const messages = require("../utils/messages.js");

// Registro de usuario

const registerUser = async (req, res) => {
  try {
    const { name, lastname, email, password, role } = req.body;

    // Verificar los campos existentes
    if (!name || !email || !password) {
      return sendError(res, messages.auth.missingFields);
    }

    const isEmailValid = verifyEmail(email);

    if (!isEmailValid) {
      return sendError(res, messages.auth.invalidEmail);
    }

    // Verificar si el email ya está registrado
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return sendError(res, messages.auth.emailAlreadyExists);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Asignar rol por defecto si no se proporciona uno
    const roleToAssign = role || "CLIENT";

    // Insertar el nuevo usuario en la base de datos
    const newUser = await pool.query(
      "INSERT INTO users (name, lastname, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, lastname,  email, role",
      [name, lastname, email, hashedPassword, roleToAssign],
    );
    const user = newUser.rows[0];
    console.log(user);

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return sendResponse(res, messages.auth.registerSuccess, { token, user });
  } catch (error) {
    console.error("Error registering user:", error);
    sendError(res, messages.server.internalError);
  }
};

// Login  usuario

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar campos existentes
    if (!email || !password) {
      return sendError(res, messages.auth.missingFields);
    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (userResult.rows.length === 0) {
      return sendError(res, messages.auth.invalidCredentials);
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, messages.auth.invalidCredentials);
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const response = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };

    return sendResponse(res, messages.auth.loginSuccess, {
      token,
      user: response,
    });
  } catch (error) {
    console.log("Error login user", error);
    sendError(res, messages.server.internalError);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
