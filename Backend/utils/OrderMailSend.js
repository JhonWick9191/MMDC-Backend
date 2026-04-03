const nodemailer = require("nodemailer");
require("dotenv").config();

const orderDoneSeandMail = async (email, order, userDetails) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 2525,
            secure: false,
            tls: { rejectUnauthorized: false },
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.PASS_KEY
            },
            connectionTimeout: 5000,
            socketTimeout: 5000,
            greetingTimeout: 5000
        });

        // ✅ Product Table (with model number)
        const productList = order.products.map((item, index) => {
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.Product_Name}</td>
                    <td>${item.model_number}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.Product_price}</td>
                </tr>
            `;
        }).join("");

        // =========================
        // ✅ USER MAIL
        // =========================
        const userMailOptions = {
            from: '"Music and More" <ordersmmdc@gmail.com>',
            to: email,
            subject: "Order Confirmation 🛒",
            html: `
                <h2>Order Placed Successfully ✅</h2>
                <p><b>Order ID:</b> ${order._id}</p>

                <table border="1" cellpadding="10" cellspacing="0">
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Model</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                    ${productList}
                </table>

                <h3>Total Amount: ₹${order.totalAmount}</h3>

                <p>Thank you for shopping with us ❤️</p>
            `
        };

        // =========================
        // ✅ ADMIN MAIL (🔥 NEW)
        // =========================
        const adminMailOptions = {
            from: '"Music and More" <ordersmmdc@gmail.com>',
            to: "ordersmmdc@gmail.com", // 👈 tumhara admin email
            subject: "🆕 New Order Received",
            html: `
                <h2>New Order Alert 🚀</h2>

                <p><b>Order ID:</b> ${order._id}</p>
                <p><b>User Name:</b> ${userDetails?.name || "N/A"}</p>
                <p><b>User Email:</b> ${email}</p>

                <table border="1" cellpadding="10" cellspacing="0">
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Model</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                    ${productList}
                </table>

                <h3>Total Amount: ₹${order.totalAmount}</h3>
            `
        };

        // ✅ Send both mails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        console.log("✅ User + Admin mail sent successfully");

    } catch (error) {
        console.log(" Mail error:", error);
    }
};

module.exports = { orderDoneSeandMail };