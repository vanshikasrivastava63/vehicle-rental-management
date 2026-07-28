import Booking from "../models/Booking.js";
import {
    createRazorpayOrder,
    verifyRazorpayPayment
} from "../services/paymentService.js";

// CREATE PAYMENT ORDER
export const createPaymentOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required"
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Booking is already paid"
            });
        }

        const order = await createRazorpayOrder(
            booking.totalAmount,
            `booking_${booking._id}`
        );

        res.status(200).json({
            success: true,
            message: "Razorpay order created successfully",
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            bookingId: booking._id
        });

    } catch (error) {
        console.error("Payment Order Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
    try {
        const {
            bookingId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !bookingId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification details are required"
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const isValid = verifyRazorpayPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        if (!isValid) {
            booking.paymentStatus = "failed";
            await booking.save();

            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        booking.paymentStatus = "paid";
        booking.bookingStatus = "confirmed";

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            booking
        });

    } catch (error) {
        console.error("Payment Verification Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};