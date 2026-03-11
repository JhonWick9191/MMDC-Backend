const nodemailer = require("nodemailer")
require("dotenv").config();

async function mailSender(email, title, body) {
    // Background email - crash nahi karega
    (async () => {
        try {
            let transporter = nodemailer.createTransporter({
                host: process.env.MAIL_HOST,
                port: 587,
                secure: false,
                tls: { rejectUnauthorized: false },
                auth: {
                    user: process.env.MAIL_USER,  // a497601@smtp-brevo.com
                    pass: process.env.PASS_KEY    // Brevo SMTP key
                },
                // SERVER TIMEOUT SHORT
                connectionTimeout: 5000,  // 5 sec only
                socketTimeout: 5000,
                greetingTimeout: 5000
            });

            let info = await transporter.sendMail({
                from: '"Music and More" <ordersmmdc@gmail.com>',
                to: email,
                subject: title,
                html: body
            });

            console.log("✅ Email sent:", info.messageId);
        } catch (error) {
            // SILENT FAIL - controller crash nahi hoga
            console.log("⚠️ Email failed (not critical):", error.message);
        }
    })();

    // Hamesha success return karo
    return { success: true, message: "Email queued" };
}

module.exports = mailSender;
