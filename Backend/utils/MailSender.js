const nodemailer = require("nodemailer")
require("dotenv").config();

async function mailSender(email, title, body) {

    try {
        // transtorter function 

        let transporter = nodemailer.createTransport({

            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            tls: { rejectUnauthorized: false },
            auth: {
                user: "a497f6001@smtp-brevo.com",
                pass: "bskxlvfgk2ODK0F"
            }
        })  

        // mail send 

        let info = await transporter.sendMail({
            from: '"Music and More" <ordersmmdc@gmail.com>',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log(info)

    } catch (error) {
        console.log(error)
        console.log("error while send email ")
    }

}

module.exports = mailSender;