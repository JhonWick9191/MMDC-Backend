const express = require("express");
const Router = express.Router();

const signup = require("../Controllers/Auth");


// Signup route 
Router.post("/signup" , signup);


// login route 

// Router.post("/login", login);


module.exports = Router;
