const express = require("express");

const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const router = express.Router();

// CREATE
router.post("/", createVehicle);

// GET ALL
router.get("/", getVehicles);

// GET SINGLE
router.get("/:id", getVehicleById);

// UPDATE
router.put("/:id", updateVehicle);

// DELETE
router.delete("/:id", deleteVehicle);

module.exports = router;