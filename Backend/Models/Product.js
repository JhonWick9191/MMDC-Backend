const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    product_id:{
        type:String,
        requried:true,        
    },

    product_model:{
        type:String,
        required:true,        
    },

    product_name:{
        type:String,
        required:true,
        trim:true
    },

    product_image:{
        type:String,
        required:true,
    },

    product_price:{
        type:String,
        required:true,
    },

    product_RP:{
        type:String,
        required:true,
    },

    product_discripction:{
        type:String,
        required:true,
    }



})

module.exports = mongoose.model("Product", productSchema)