const nodemailer = require("nodemailer");
require("dotenv").config();

async function mailSender(email, title, body) {
    // Background email - crash nahi karega
    (async () => {
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

            let info = await transporter.sendMail({
                from: '"Music and More" <ordersmmdc@gmail.com>',
                to: email,
                subject: title,
                html: body
            });

            console.log(" Email sent:", info.messageId);
        } catch (error) {
            console.log(" Email failed (not critical):", error.message);
        }
    })();

    // Hamesha success return karo
    return { success: true, message: "Email queued" };
}

module.exports = mailSender;