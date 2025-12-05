const OrderModel = require("../Models/OrderModel");
const ProductModel = require("../Models/ProductUploadeModel");
// importing the mail function 
const Sendmail = require("../MiddleWares/MailFunction")
async function orderDetails(req, res) {
    console.log(req.body);
    try {
        const userId = req.user.id;
        const user = req.user.email;
        const { products, totalAmount } = req.body;
        console.log("User ID:", userId);
        console.log(user)
        console.log("Products:", products);

        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is Empty"
            });
        }

        const productsWithDetails = [];

        for (const item of products) {
            const productId = item._id || item.productId;
            const quantityOrdered = item.quantity || item.count || 1;

            // 1. Stock decrement with sufficient quantity check
            const updateResult = await ProductModel.updateOne(
                { _id: productId, Product_Quantity: { $gte: quantityOrdered } },
                { $inc: { Product_Quantity: -quantityOrdered } }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product ID: ${productId}`
                });
            }

            // 2. Fetch product details like price and others from DB
            const productInDb = await ProductModel.findById(productId).lean();
            if (!productInDb) {
                return res.status(400).json({
                    success: false,
                    message: `Product not found: ${productId}`
                });
            }            

            // 3. Prepare single product object with all required fields
            productsWithDetails.push({
                product_id: productInDb.product_id,
                Product_Name: productInDb.Product_Name,              
                Product_price: productInDb.Product_price,
                Vendor_price:productInDb.Vendor_price,
                quantity: quantityOrdered,
                product_image: productInDb.image_01, 
                brand_name : productInDb.Brand_Name,
                model_number:productInDb.Model_number,
                rating: productInDb.rating || 0,
                save: productInDb.save || ""
            });
        }
        console.log("API HIT OF PLACE ORDER")
        // Create order with detailed products info
        const new_order = await OrderModel.create({
            user: userId,
            products: productsWithDetails,            
            totalAmount,
            
        });

        res.status(200).json({
            success: true,
            message: "Order Placed successfully ",
            order: new_order,
         
        });

        // email function for order place 
        // console.log(new_order)
        Sendmail(user,new_order,)



    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while placing the order"
        });
    }
}

module.exports = { orderDetails };
