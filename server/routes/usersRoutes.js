const express = require("express");
const router = express.Router();
const {
  getSupportUsers,
  createSupportUser,
  deleteSupportUser,
} = require("../controllers/userController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

router.get("/support", verifyToken, verifyRole(["ADMIN"]), getSupportUsers);

router.post("/support", verifyToken, verifyRole(["ADMIN"]), createSupportUser);

router.delete(
  "/support/:id",
  verifyToken,
  verifyRole(["ADMIN"]),
  deleteSupportUser,
);

module.exports = router;
