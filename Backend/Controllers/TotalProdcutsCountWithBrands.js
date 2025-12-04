const Products = require("../Models/ProductUploadeModel");

async function totalProductWithBrands(req, res) {
    try {
        // 1️ Total number of products
        const totalProducts = await Products.countDocuments();

        // 2️⃣ Brand-wise product count using aggregation
        const brandWiseCount = await Products.aggregate([
            {
                $group: {
                    _id: "$Brand_Name",       // brand name
                    productCount: { $sum: 1 } // number of products in this brand
                }
            },
            { 
                $sort: { _id: 1 }           // sort alphabetically (optional)
            }
        ]);

        // 3️⃣ Unique SKUs
        const allSkus = await Products.distinct("product_id");

        return res.status(200).json({
            success: true,
            message: "Product stats fetched successfully",
            totalProducts,
            totalBrands: brandWiseCount.length,
            brandWiseCount,  // 👈 added
        });

    } catch (error) {
        console.log("Error getting all product data for admin:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching product dashboard data"
        });
    }
}

module.exports = { totalProductWithBrands };
