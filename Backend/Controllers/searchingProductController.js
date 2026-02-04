const excelDataSchema = require("../Models/ProductUploadeModel");

async function searchProducts(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    // Normalize query (remove extra spaces)
    const searchQuery = q.trim().replace(/\s+/g, " ");
    const words = searchQuery.split(" ");

    // Each word must appear in at least one of these fields
    const andConditions = words.map((word) => ({
      $or: [
        { Product_Name: { $regex: word, $options: "i" } },
        { Model_number: { $regex: word, $options: "i" } },
        { Product_Type: { $regex: word, $options: "i" } },
        { Brand_Name: { $regex: word, $options: "i" } },

        {
          Product_Subcategory
            : { $regex: word, $options: "i" }
        }

      ]
    }));

    const filterProduct = await excelDataSchema.find({ $and: andConditions });

    if (filterProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found"
      });
    }

    res.status(200).json({
      success: true,
      count: filterProduct.length,
      data: filterProduct
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

module.exports = { searchProducts };
