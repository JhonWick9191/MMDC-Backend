const mongoose = require("mongoose")
const mailSender = require("../utils/MailSender")

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    },

    OTP:{
        type:String,
        required:true,
    }
})

// this is pre hook it is send mail before user data has been save to the data base 

// user deatils ----> varify email and send email -----------> otp enter ----------> then data save to the data base.

// function the for send email 

async function sendVerificationEmail(email , otp){

    try{

        const mail_responce = await mailSender(email,"Verification email for signup " , otp )
        console.log("email has been send sucessfully")
        console.log(mail_responce)

    }catch(error){
        console.log("Geeting error while sending the email")
        console.log(error)

    }

}

OTPSchema.pre("save" , async function (next) {
    await sendVerificationEmail(this.email , this.otp)
    next()
} )

module.exports = mongoose.model("OTP" , OTPSchema)