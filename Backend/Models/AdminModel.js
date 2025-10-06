const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    first_name: {
        type:String,
        required:true,
        trim:true,
    },
        last_name: {
        type:String,
        required:true,
        trim:true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "Admin"
    }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
