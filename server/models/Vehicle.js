import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    brand: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      required: true,
      enum: ["Car", "Bike", "SUV"]
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0
    },

    image: {
      type: String,
      default: ""
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;