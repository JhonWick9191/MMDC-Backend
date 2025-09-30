const JWT = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");

require("dotenv").config();

async function auth(req,res ,next) {

    try{

        // extract code 
        const token = req.cookied.token 
                        || req.body.token
                        || req.header("Authorisation").replace("Bearer", " ");

        // if toekn is missing 

        if(!token){ 
            return res.status(401).json({
                success:false,
            })           
        }

        // verify the token 
        try{
            const decode =  JWT.verify(token , process.env.JWT_SECRET )
            console.log(decode)
            req.UserModel = decode;

        }catch(error){

            // varification issue 
            return res.status(401).josn({
                success:false,
                message:"Token is invalid "
            })

        }

        next();

    }catch(error){
  
         return res.status(401).josn({
                success:false,
                message:"Someting went wrong while validation the toekn  "
            })

    }
    
}


// is vender 

async function isVender(req ,res ,next){

    try{

        if(req.UserModel.role !== "Vendor"){
            return res.status(401).json({
                success:false,
                message:"This is the protected route for Venders only "
            })
        }
     next();
    }catch(error){

        return res.status(500).json({
            sucess:false,
            message:"User role can't be verify , please try again later "
        })

    }

}


// is admin 


async function isadmin(req ,res ,next){

    try{

        if(req.UserModel.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is the protected route for Admin only "
            })
        }
     next();
    }catch(error){

        return res.status(500).json({
            sucess:false,
            message:"Admin role can't be verify , please try again later "
        })

    }

}



