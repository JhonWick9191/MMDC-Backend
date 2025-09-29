// creating a schema 

const mongoose =  require("mongoose");

// creatSchema for user auth 

const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        trim :true,
    },
    email:{
        type:String,
        required:true,        
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Admin" , "Vendor"]

    }

})

module.exports = mongoose.model("user" , userSchema)

