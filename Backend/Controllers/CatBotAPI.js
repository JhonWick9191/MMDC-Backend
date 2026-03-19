const User = require("../Models/UserModel");
const Product = require("../Models/ProductUploadeModel");

async function chatBot(req, res) {
    try {
        let { query } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
            });
        }

        // clean query
        query = query.trim();

        // flexible regex (spaces/dashes ignore)
        const searchRegex = new RegExp(query.replace(/[-\s]/g, ""), "i");

        const product = await Product.findOne({
            $or: [
                { Model_number: { $regex: query, $options: "i" } },
                { Product_Name: { $regex: query, $options: "i" } },
                { product_model: { $regex: query, $options: "i" } }
            ]
        });

        // ❌ product not found
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sorry, product not found"
            });
        }

        // ✅ success response
        return res.status(200).json({
            success: true,
            data: {
                product_id: product.product_id,
                name: product.Product_Name,
                brand: product.Brand_Name,
                model_number: product.Model_number,
                category: product.Product_Category,
                subcategory: product.Product_Subcategory,
                type: product.Product_Type,
                price: product.Product_price,
                images: [
                    product.image_01,
                    product.image_02,
                    product.image_03,
                    product.image_04
                ],
                stock: product.Product_Quantity > 0 ? "In Stock" : "Out of Stock",
                new: product.new
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "There is problem occur during calling the chat bot"
        });
    }
}

module.exports = { chatBot };