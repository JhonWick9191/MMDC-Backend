const express = require("express");
const Router = express.Router();



// importing login and signup form Controllers 
const {signup , login ,  changePassword , createAdmin , UserLogin} = require("../Controllers/Auth");

//importing Protected Routes for Vender and Admin 

const {isAdmin , isVender , auth } = require("../MiddleWares/AuthMiddleWare")

//importing the order controller 

const {orderDetails} = require("../Controllers/Order")

//importing the order details controller 

const {getUserOrders,getAllOrdersForAdmin} = require("../Controllers/OrderProductByUser")

// importing Controller for deleting the order 

const{ deleteOrderProduct} = require("../Controllers/DeleteProduct")

// importing api for get user Details 



// Signup route 
Router.post("/signup" , signup);

// login route 
Router.post("/login" , login )

// Create Admin 

Router.post("/createAdmin", createAdmin)

// Route for find total number of brands and products 

const {totalProductWithBrands } = require("../Controllers/TotalProdcutsCountWithBrands")
Router.get("/totalCountBrandsAndProducts" , totalProductWithBrands)

// chnage password

Router.post("/changePassword", changePassword)

// Route for geting the user data 

Router.get("/profileInfo",UserLogin )


// Route for place order 

Router.post("/orderPlaces", auth , isVender ,orderDetails )

// Route for Delete order 

Router.delete("/deleteProduct" , auth , isVender , deleteOrderProduct )


// Router for getting order detials of user in user Dashboard 

Router.get("/orderDetials" ,auth , isVender , getUserOrders)

// Router for getting product details for the user 

Router.get("/allOrderProducts", auth , isAdmin ,getAllOrdersForAdmin )

//Protected route orderDetails

// test route 

Router.get("/test" , auth , (req ,res)=>{

        res.status(200).json({
        success:true,
        message:"Welcome to Test Route",

    })

})


// Getting the recomendation controller 

const {getRecommendations} =  require("../Controllers/RecomendedProducts")

// create an get route

Router.get("/alsoView" , getRecommendations)

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
