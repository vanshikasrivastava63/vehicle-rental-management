import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    pickupDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
  type: String,
  enum: ["Confirmed", "Cancelled", "Completed"],
  default: "Confirmed",
},

paymentStatus: {
  type: String,
  enum: ["Pending", "Success", "Failed"],
  default: "Pending",
},
    
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;