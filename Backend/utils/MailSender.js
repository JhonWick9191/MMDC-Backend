const nodemailer = require("nodemailer");
require("dotenv").config;
async function mailSender(email , title , body  ){

    try{

        // create transporter 
        
        let transporter = nodemailer.createTransport({
            host:process.env.mailHost,
            auth:{
                user:process.env.MAIL_USER,
                pass :process.env.PASS_KEY
            }
        })

        // create mailsenders function 

        let mailSender = await transporter.sendMail({
            from:"MMDC || OTP - FOR SIGNUP ",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })

        console.log(mailSender)
        console.log("mail has been send to the user ")


    }catch(error){

        console.log("error is occur on mail sender")
        console.log(error)
    

    }

}

module.exports = mailSender;
