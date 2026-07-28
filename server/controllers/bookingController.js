import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

// CREATE BOOKING
// POST /api/bookings

export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      vehicleId,
      pickupDate,
      returnDate,
    } = req.body;

    if (!userId || !vehicleId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "All booking details are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (!vehicle.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is currently unavailable",
      });
    }

    const startDate = new Date(pickupDate);
    const endDate = new Date(returnDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid dates",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date",
      });
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const totalDays = Math.ceil(
      (endDate - startDate) / millisecondsPerDay
    );

    const totalAmount = totalDays * vehicle.pricePerDay;

    const booking = await Booking.create({
      user: userId,
      vehicle: vehicleId,
      pickupDate: startDate,
      returnDate: endDate,
      totalDays,
      pricePerDay: vehicle.pricePerDay,
      totalAmount,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate(
        "vehicle",
        "name brand type pricePerDay image"
      );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET USER BOOKINGS
// GET /api/bookings/user/:userId

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.params.userId,
    })
      .populate(
        "vehicle",
        "name brand type pricePerDay image"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CANCEL BOOKING
// PUT /api/bookings/:id/cancel

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// UPDATE PAYMENT STATUS
// PUT /api/bookings/:id/payment

export const markPaymentPaid = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["Success", "Failed"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.paymentStatus = paymentStatus;

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Payment marked as ${paymentStatus}`,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};