const express = require("express");
const Router = express.Router();

const {signup , login ,  changePassword} = require("../Controllers/Auth");


// Signup route 
Router.post("/signup" , signup);

// login route 
Router.post("/login" , login )

// chnage password

Router.post("/changePassword", changePassword)

module.exports = Router;
