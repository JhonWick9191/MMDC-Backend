const nodemailer = require("nodemailer");
require("dotenv").config();
const orderDoneSeandMail = async (email, order) => {
    try {
         let transporter = nodemailer.createTransport({
                       host: process.env.MAIL_HOST,
                       port: 2525,             // Use working port
                       secure: false,          // TLS false for port 2525
                       tls: { rejectUnauthorized: false },
                       auth: {
                           user: process.env.MAIL_USER,   // Brevo SMTP user
                           pass: process.env.PASS_KEY     // Brevo SMTP key
                       },
                       connectionTimeout: 5000,
                       socketTimeout: 5000,
                       greetingTimeout: 5000
                   });

        //  Products HTML generate karo
        const productList = order.products.map((item, index) => {
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.Product_Name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.Product_price}</td>
                </tr>
            `;
        }).join("");

        const mailOptions = {
            from: '"Music and More" <ordersmmdc@gmail.com>',
            to: email,
            subject: "Order Confirmation ",
            html: `
                <h2>Order Placed Successfully ✅</h2>
                <p>Your order ID: <b>${order._id}</b></p>

                <table border="1" cellpadding="10" cellspacing="0">
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                    ${productList}
                </table>

                <h3>Total Amount: ₹${order.totalAmount}</h3>

                <p>Thank you for shopping with us ❤️</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Mail sent successfully");

    } catch (error) {
        console.log("Mail error:", error);
    }
};

module.exports =orderDoneSeandMail;