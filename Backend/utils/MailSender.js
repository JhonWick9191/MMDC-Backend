const nodemailer = require("nodemailer");
require("dotenv").config();

async function mailSender(email, title, body) {

    try {

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.PASS_KEY
            }
        });

        let info = await transporter.sendMail({
            from: `"Music & More" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });

        console.log("Mail sent successfully");
        console.log(info);

    } catch (error) {

        console.log("Error occurred while sending mail");
        console.log(error);

    }
}

module.exports = mailSender;