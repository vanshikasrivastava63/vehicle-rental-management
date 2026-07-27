import express from "express";

import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicleController.js";

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

export default router;