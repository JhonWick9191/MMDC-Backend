const Contact = require("../Models/ContactusModel")

async function contactUs(req ,res){
    try{

        // getting deatils from request body 
        const {firstName ,lastName, email , phone , reason , message} = req.body 

        if(!firstName || !lastName || !email || !phone || !reason || !message){
            return res.status(400).json({
                sucess:false,
                message:"Please fill all feild so that we can connect you "
            })  
        }

        const contectData = await Contact.create({
             firstName,
             lastName,
             email,
             phone,
             reason,
             message,
        })
         console.log(contectData)
        return res.status(200).json({
            sucess:true,
            message:"Thank you for contact us sortly our team will connect you",
            data:contectData
            
        })

        

    }catch(error){
        console.error(error)
        return res.status(500).json({
            sucess:false,
            message:"Error getting in contact us",
            data:error
        })
    }
}


async function getContectDeails(req , res){
    try{

        //get all data for contect db 
        const  getAllDataFromContectDB = await Contact.find();
        if(!getAllDataFromContectDB){
            return res.status(404).json({
                sucess:false,
                messgae:"There is no any query data present in db "
            })
        }

        return res.status(200).json({
            sucess:true,
            message:"Getting all data",
            data:getAllDataFromContectDB
        })
    
    }catch(error){

        return res.status(500).josn({
            sucess:false,
            messgae:"There is error occur in get connect data "
        })

    }
}

module.exports={contactUs , getContectDeails}