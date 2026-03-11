const nodemailer = require("nodemailer")
require("dotenv").config();

async function mailSender(email, title, body) {

    try {
        // transtorter function 

        let transporter = nodemailer.createTransport({

            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            tls: { rejectUnauthorized: false },
            auth: {
                user:process.env.MAIL_USER ,
                pass:process.env.PASS_KEY
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