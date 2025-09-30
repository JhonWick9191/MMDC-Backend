// creating a schema 

const mongoose = require("mongoose");

// creatSchema for user auth 

const profileSchema = new mongoose.Schema({

    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Others"],

    },

    alternet_phone_number: {
        type: String,

    },

    alternet_email: {
        type: String
    },

    about_user: {
        type: String,
    },

})

module.exports = mongoose.model("Profile", profileSchema)

