const express = require("express");
const Router = express.Router();

// importing login and signup form Controllers 
const {signup , login ,  changePassword , createAdmin , UserLogin} = require("../Controllers/Auth");

//importing Protected Routes for Vender and Admin 

const {isAdmin , isVender , auth } = require("../MiddleWares/AuthMiddleWare")


// Signup route 
Router.post("/signup" , signup);

// login route 
Router.post("/login" , login )

// Create Admin 

Router.post("/createAdmin", createAdmin)

// chnage password

Router.post("/changePassword", changePassword)

// Route for geting the user data 

Router.get("/profileInfo",UserLogin )

//Protected route 

// test route 

Router.get("/test" , auth , (req ,res)=>{

        res.status(200).json({
        success:true,
        message:"Welcome to Test Route",

    })

})




// 1- Protected rout form is vender 

Router.get("/isVender" , auth , isVender  , (req , res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to Dashboard of Vendors",

    })
})

// 2 - Protected route for admin 

Router.get("/isadmin" , auth , isAdmin , (req, res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the Dasboard of admin"
    })
})

module.exports = Router;
