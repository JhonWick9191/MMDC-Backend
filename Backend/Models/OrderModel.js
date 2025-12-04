const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product_id: { type: Number }, // original product id
            Product_Name: {
                type: String,                
            },
            product_model: {
                type: String
            },
            
            brand_name :{
                type:String
            },

            model_number:{
              type:String
            },

             product_image: {
                type: String
            },
            insideImages: [
                {
                    one: String,
                    two: String,
                    three: String,
                    four: String
                }
            ],
            Product_price: {
                type: Number,
                required: true
            },
             Vendor_price: {
                type: Number,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },
            rating: {
                type: Number
            },
            save: {
                type: String
                }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Cancelled"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);
