const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    phone_number: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    confrim_password: { type: String, require: true },
    gst_number: { type: String, require: true },

    role: {
        type: String,
        enum: ["Admin", "Vendor"]
    },

    image: {
        type: String,
        required: true,
    },

    aditional_info: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Products"
    }],

    // ⭐ ADD THESE FIELDS ONLY ⭐
    isApproved: {
        type: Boolean,
        default: false,
    },

    isActive: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        default: "pending",
    }
});

module.exports = mongoose.model("User", userSchema);
