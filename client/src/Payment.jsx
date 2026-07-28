import { useState } from "react";

const API_URL = "http://localhost:5000";

function Payment({ bookingDetails, onClose }) {
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const vehicle = bookingDetails?.vehicle;
  const pickupDate = bookingDetails?.pickupDate;
  const returnDate = bookingDetails?.returnDate;
  const bookingId = bookingDetails?.booking?._id;

  const totalDays =
    pickupDate && returnDate
      ? Math.ceil(
          (new Date(returnDate) - new Date(pickupDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalAmount = totalDays * (vehicle?.pricePerDay || 0);

  const updatePaymentStatus = async (paymentStatus) => {
    const response = await fetch(
      `${API_URL}/api/bookings/${bookingId}/payment`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Payment update failed.");
    }

    return data;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updatePaymentStatus("Success");

      setPaymentDone(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFailedPayment = async () => {
    try {
      setLoading(true);

      await updatePaymentStatus("Failed");

      alert("Payment marked as Failed.");
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "420px",
          maxWidth: "90%",
          background: "#ffffff",
          borderRadius: "15px",
          padding: "28px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "15px",
            border: "none",
            background: "transparent",
            color: "#111827",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {!paymentDone ? (
          <>
            <h2
              style={{
                color: "#111827",
                textAlign: "center",
              }}
            >
              Complete Payment
            </h2>

            <p>
              <strong>Vehicle:</strong> {vehicle?.name}
            </p>

            <p>
              <strong>Rental:</strong> {totalDays} day(s)
            </p>

            <p>
              <strong>Total Amount:</strong> ₹{totalAmount}
            </p>

            <form onSubmit={handlePayment}>
              <input
                type="text"
                placeholder="Card Holder Name"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  boxSizing: "border-box",
                  background: "#ffffff",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                }}
              />

              <input
                type="text"
                placeholder="Card Number"
                required
                maxLength="16"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  boxSizing: "border-box",
                  background: "#ffffff",
                  color: "#111827",
                  border: "1px solid #d1d5db",
                }}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  required
                  style={{
                    width: "50%",
                    padding: "12px",
                    marginBottom: "12px",
                    background: "#ffffff",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                  }}
                />

                <input
                  type="password"
                  placeholder="CVV"
                  required
                  maxLength="3"
                  style={{
                    width: "50%",
                    padding: "12px",
                    marginBottom: "12px",
                    background: "#ffffff",
                    color: "#111827",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#111827",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {loading ? "Processing..." : `Pay ₹${totalAmount}`}
              </button>

              <button
                type="button"
                onClick={handleFailedPayment}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  marginTop: "10px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Simulate Failed Payment
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "25px 0" }}>
            <h2
              style={{
                color: "#059669",
                fontSize: "26px",
                fontWeight: "800",
              }}
            >
              Payment Successful ✅
            </h2>

            <p>Your booking for {vehicle?.name} is confirmed.</p>

            <button
              onClick={onClose}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                background: "#111827",
                color: "white",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;