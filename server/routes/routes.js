const { Router } = require("express");
const authRoutes = require("./authRoutes");
const requestsRoutes = require("./requestsRoutes");

const router = Router();

// listar info
router.get("/health", (req, res) => {
  return res.status(200).json({ status: "OK", message: "API is healthy" });
});

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de solicitudes
router.use("/requests", requestsRoutes);

module.exports = router;
