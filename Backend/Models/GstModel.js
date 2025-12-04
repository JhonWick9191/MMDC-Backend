const mongoose = require("mongoose");

const GstSchema = new mongoose.Schema({
    gstNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("GstNumber", GstSchema);
