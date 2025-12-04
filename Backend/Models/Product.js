const mongoose = require("mongoose");
const UserModel = require("./UserModel");

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
    },

    // a particualr product how many persons are placed the order 
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        requried:true,
        ref:"UserModel"
    }

})

module.exports = mongoose.model("Products", productSchema)