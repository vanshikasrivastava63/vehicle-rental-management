import { useState } from "react";
import "./Booking.css";

const API_URL = "http://localhost:5000";

function Booking({ vehicle, user, onClose, onBookingSuccess }) {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);

  

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Please login first.");
      return;
    }

    if (!vehicle?._id) {
      alert("Vehicle information is missing.");
      return;
    }

    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return dates.");
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      alert("Return date must be after pickup date.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          vehicleId: vehicle._id,
          pickupDate,
          returnDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Booking failed.");
        return;
      }

      onBookingSuccess({
  vehicle,
  pickupDate,
  returnDate,
  booking: data.booking,
});

      setPickupDate("");
      setReturnDate("");
      onClose();
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Unable to connect with server.");
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) {
    return null;
  }

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div
        className="booking-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="booking-close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        <div className="booking-heading">
          <span>BOOK YOUR RIDE</span>

          <h2>
            Reserve your
            <br />
            <strong>{vehicle.name}</strong>
          </h2>

          <p>Choose your pickup and return dates.</p>
        </div>

        <div className="booking-vehicle">
          <img
            src={
              vehicle.image ||
              "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=700&q=85"
            }
            alt={vehicle.name}
          />

          <div className="booking-vehicle-details">
            <span className="booking-type">
              {vehicle.type || "Vehicle"}
            </span>

            <h3>{vehicle.name}</h3>

            <p>
              {vehicle.brand || "Premium Brand"}
              {vehicle.location ? ` • ${vehicle.location}` : ""}
            </p>

            <div className="booking-price">
              <strong>₹{vehicle.pricePerDay}</strong>
              <span>/day</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleBooking}>
          <div className="date-grid">
            <div className="date-field">
              <label htmlFor="pickupDate">Pickup Date</label>

              <input
                id="pickupDate"
                type="date"
                value={pickupDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>

            <div className="date-field">
              <label htmlFor="returnDate">Return Date</label>

              <input
                id="returnDate"
                type="date"
                value={returnDate}
                min={
                  pickupDate ||
                  new Date().toISOString().split("T")[0]
                }
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            className="confirm-booking-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Confirming..." : "Confirm Booking"}
            <span>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;