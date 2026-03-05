const nodemailer = require("nodemailer");
require("dotenv").config();

async function mailSender(email, title, body) {

    try {

        // create transporter
        let transporter = nodemailer.createTransport({
            host: process.env.mailHost,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.PASS_KEY
            }
        });

        // send mail
        let info = await transporter.sendMail({
            from: `"MMDC Team" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });

        console.log("Mail sent successfully:", info.messageId);

    } catch (error) {

        console.log("Error occurred while sending mail");
        console.log(error);

    }

}

module.exports = mailSender;