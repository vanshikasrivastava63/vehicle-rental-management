import Vehicle from "../models/Vehicle.js";

// ==========================================
// CREATE VEHICLE
// POST /api/vehicles
// ==========================================

export const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle
    });

  } catch (error) {
    console.error("Create Vehicle Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET ALL VEHICLES
// GET /api/vehicles
// ==========================================

export const getVehicles = async (req, res) => {
  try {

    const {
      type,
      brand,
      location,
      minPrice,
      maxPrice
    } = req.query;

    // -----------------------------
    // BUILD FILTER
    // -----------------------------

    const filter = {};

    if (type) {
      filter.type = {
        $regex: `^${type}$`,
        $options: "i"
      };
    }

    if (brand) {
      filter.brand = {
        $regex: `^${brand}$`,
        $options: "i"
      };
    }

    if (location) {
      filter.location = {
        $regex: `^${location}$`,
        $options: "i"
      };
    }

    // -----------------------------
    // PRICE FILTER
    // -----------------------------

    if (minPrice || maxPrice) {

      filter.pricePerDay = {};

      if (minPrice) {
        filter.pricePerDay.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.pricePerDay.$lte = Number(maxPrice);
      }
    }

    // -----------------------------
    // GET ALL VEHICLES
    // -----------------------------

    const vehicles = await Vehicle
      .find(filter)
      .sort({ createdAt: -1 });

    // -----------------------------
    // RESPONSE
    // -----------------------------

    res.status(200).json({
      success: true,
      totalVehicles: vehicles.length,
      vehicles
    });

  } catch (error) {

    console.error("Get Vehicles Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// GET SINGLE VEHICLE
// GET /api/vehicles/:id
// ==========================================

export const getVehicleById = async (req, res) => {
  try {

    const vehicle = await Vehicle.findById(
      req.params.id
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      vehicle
    });

  } catch (error) {

    console.error("Get Vehicle Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// UPDATE VEHICLE
// PUT /api/vehicles/:id
// ==========================================

export const updateVehicle = async (req, res) => {
  try {

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle
    });

  } catch (error) {

    console.error("Update Vehicle Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==========================================
// DELETE VEHICLE
// DELETE /api/vehicles/:id
// ==========================================

export const deleteVehicle = async (req, res) => {
  try {

    const vehicle = await Vehicle.findByIdAndDelete(
      req.params.id
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully"
    });

  } catch (error) {

    console.error("Delete Vehicle Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};