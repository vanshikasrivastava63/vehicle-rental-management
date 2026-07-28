import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function MyBookings({ user, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/bookings/user/${user.id}`
      );

      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Bookings Error:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    const shouldCancel = window.confirm(
      "Do you want to cancel this booking?"
    );

    if (!shouldCancel) return;

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to cancel booking.");
        return;
      }

      fetchBookings();
    } catch (error) {
      alert("Unable to connect with server.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.65)",
        zIndex: 1000,
        overflowY: "auto",
        padding: "35px 15px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "28px",
          position: "relative",
        }}
      >
        <button
  onClick={onClose}
  style={{
    position: "absolute",
    top: "15px",
    right: "18px",
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    borderRadius: "6px",
    padding: "8px 14px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Close
</button>

        <h2 style={{ color: "#111827" }}>My Bookings</h2>

        {loading && <p>Loading your bookings...</p>}

        {!loading && bookings.length === 0 && (
          <p>You have not booked any vehicle yet.</p>
        )}

        {!loading &&
          bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "18px",
                padding: "16px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                alignItems: "center",
              }}
            >
              <img
                src={
                  booking.vehicle?.image ||
                  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=700&q=85"
                }
                alt={booking.vehicle?.name}
                style={{
                  width: "140px",
                  height: "95px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px", color: "#111827" }}>
                  {booking.vehicle?.name || "Vehicle"}
                </h3>

                <p>
                  {new Date(booking.pickupDate).toLocaleDateString()} to{" "}
                  {new Date(booking.returnDate).toLocaleDateString()}
                </p>

                <p>
                  {booking.totalDays} day(s) · ₹{booking.totalAmount}
                </p>

                <p>
                  Booking: <strong>{booking.status}</strong>
                </p>

                <p>
                  Payment:{" "}
                  <strong>
                    {booking.paymentStatus || "Pending"}
                  </strong>
                </p>

                {booking.status === "Confirmed" && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    style={{
                      border: "none",
                      borderRadius: "6px",
                      padding: "9px 14px",
                      background: "#dc2626",
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MyBookings;