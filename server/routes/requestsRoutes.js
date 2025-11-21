const express = require("express");
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getRequestById,
  assignRequest,
  respondToRequest,
  getRequestStats,
  deleteRequest,
} = require("../controllers/requestController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

router.get("/stats", verifyToken, verifyRole(["ADMIN"]), getRequestStats);

router.get("/", verifyToken, getAllRequests);

router.get("/:id", verifyToken, getRequestById);

router.post("/", verifyToken, verifyRole(["CLIENT"]), createRequest);

router.put(
  "/:id/respond",
  verifyToken,
  verifyRole(["SUPPORT"]),
  respondToRequest,
);

router.put("/:id/assign", verifyToken, verifyRole(["ADMIN"]), assignRequest);

router.delete("/:id", verifyToken, verifyRole(["ADMIN"]), deleteRequest);

module.exports = router;
