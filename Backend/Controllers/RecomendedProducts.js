const ProductModel = require("../Models/ProductUploadeModel");

async function getRecommendations(req, res) {
  const category = req.query.category;
  if (!category) {
    return res.status(400).json({ success: false, message: "Category is required" });
  }

  try {
    // Guitar ke case me teen alag categories ke 5-5 products fetch karenge
    if (category.toLowerCase() === "electric guitar" || category.toLowerCase() === "acoustic guitar") {
      // String, Pick aur Strap categories ke products laao
      const strings = await ProductModel.find({ Product_Category: "String" }).limit(5);
      const picks = await ProductModel.find({ Product_Category: "Pick" }).limit(5);
      const straps = await ProductModel.find({ Product_Category: "Strap" }).limit(5);

      // In teeno ko combine karke bhejo
      const recommendations = [...strings, ...picks, ...straps];

      return res.status(200).json({ success: true, message: recommendations });
    }

    // Baaki categories ke liye wahi category products bhejo
    const recommendations = await ProductModel.find({
      Product_Category: category
    }).limit(10);

    res.status(200).json({ success: true, message: recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { getRecommendations };
