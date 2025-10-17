const OrderModel = require("../Models/OrderModel");
// const User = require("../Models/UserModel");

async function orderDetails(req, res) {

    console.log(req.body)
    try {
        const userId =  req.user.id;
        const { products, totalAmount } = req.body;
        console.log("User ID:", userId);
        console.log("Products:", products);

        // Validation
        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is Empty"
            });
        }

        // Create order
        const new_order = await OrderModel.create({
            user: userId,
            products: products, // ✅ pass the products array
            totalAmount
        });

        res.status(200).json({
            success: true,
            message: "Order Placed successfully",
            order: new_order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error while sending the order items to the user dashboard"
        });
    }
}

module.exports = { orderDetails };
