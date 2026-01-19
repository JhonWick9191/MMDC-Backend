const express = require("express");
const Porducts = require("../Models/ProductUploadeModel");

async function filterProducts(req, res) {
  try {
    const { type, brand, subCategory, page = 1, limit = 20, sort = "asc" } = req.query;

    const skip = (page - 1) * limit;

    if (!type) {
      return res.status(400).json({ success: false, message: "Product type is required" });
    }

    const filterObj = { Product_Type: type };

    // ✅ brand filter
    if (brand) filterObj.Brand_Name = brand;

    // ✅ category filter
    if (subCategory) filterObj.Product_Category = subCategory;

    // 1️⃣ Paginated products with sort
    const filterProducts = await Porducts.find(filterObj)
      .sort({ Product_price: sort === "asc" ? 1 : -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    if (filterProducts.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    // 2️⃣ Total products count
    const totalProducts = await Porducts.countDocuments(filterObj);

    // 3️⃣ Total brands + their counts
    const brandAggregate = await Porducts.aggregate([
      { $match: { Product_Type: type } },
      { $group: { _id: "$Brand_Name", count: { $sum: 1 } } },
    ]);
    const totalBrands = brandAggregate.map(b => b._id);
    const brandCount = {};
    brandAggregate.forEach(b => { brandCount[b._id] = b.count; });

    // 4️⃣ Total categories + their counts
    const categoryAggregate = await Porducts.aggregate([
      { $match: { Product_Type: type } },
      { $group: { _id: "$Product_Category", count: { $sum: 1 } } },
    ]);
    const totalCategories = categoryAggregate.map(c => c._id);
    const categoryCount = {};
    categoryAggregate.forEach(c => { categoryCount[c._id] = c.count; });

    res.status(200).json({
      success: true,
      message: filterProducts,
      data: "Data fetched successfully",
      page: Number(page),
      limit: Number(limit),
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      totalBrands: totalBrands.length,
      totalCategories,
      brandCount,
      categoryCount
    });

  } catch (error) {
    console.error("Error in filterProducts:", error);
    res.status(500).json({ success: false, message: "Error while filtering products" });
  }
}

module.exports = { filterProducts };
