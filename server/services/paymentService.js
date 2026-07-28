// import Razorpay from "razorpay";
// import crypto from "crypto";

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // Create Razorpay Order
// export const createRazorpayOrder = async (amount, receipt) => {
//     const options = {
//         amount: Math.round(amount * 100),
//         currency: "INR",
//         receipt
//     };

//     const order = await razorpay.orders.create(options);

//     return order;
// };

// // Verify Razorpay Payment
// export const verifyRazorpayPayment = ({
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature
// }) => {
//     const generatedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//         .update(
//             `${razorpay_order_id}|${razorpay_payment_id}`
//         )
//         .digest("hex");

//     return generatedSignature === razorpay_signature;
// };

// export default razorpay;
import Razorpay from "razorpay";
import crypto from "crypto";

console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);
console.log(
    "RAZORPAY SECRET:",
    process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing"
);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
export const createRazorpayOrder = async (amount, receipt) => {
    const options = {
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt
    };

    const order = await razorpay.orders.create(options);

    return order;
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
}) => {
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    return generatedSignature === razorpay_signature;
};

export default razorpay;