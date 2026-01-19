const express = require("express");
const Porducts = require("../Models/ProductUploadeModel");

async function filterProducts(req, res) {
  try {
    const { type, brand, subCategory, page = 1, limit = 20, sort = "asc" } = req.query;

    if (!type) {
      return res.status(400).json({ success: false, message: "Product type is required" });
    }

    const skip = (page - 1) * limit;

    // Case-insensitive type filter
    const filterObj = { Product_Type: { $regex: `^${type}$`, $options: "i" } };

    // Brand filter
    if (brand) filterObj.Brand_Name = brand;

    // Category filter
    if (subCategory) filterObj.Product_Category = subCategory;

    // 1️⃣ Paginated & sorted products
    const filterProducts = await Porducts.find(filterObj)
      .sort({ Product_price: sort === "asc" ? 1 : -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    // 2️⃣ Total products count
    const totalProducts = await Porducts.countDocuments(filterObj);

    // 3️⃣ Brands + counts (case-insensitive type match)
    const brandAggregate = await Porducts.aggregate([
      { $match: { Product_Type: { $regex: `^${type}$`, $options: "i" } } },
      { $group: { _id: "$Brand_Name", count: { $sum: 1 } } },
    ]);

    const totalBrands = brandAggregate.map(b => b._id);
    const brandCount = {};
    brandAggregate.forEach(b => { brandCount[b._id] = b.count; });

    // 4️⃣ Categories + counts (case-insensitive type match)
    const categoryAggregate = await Porducts.aggregate([
      { $match: { Product_Type: { $regex: `^${type}$`, $options: "i" } } },
      { $group: { _id: "$Product_Category", count: { $sum: 1 } } },
    ]);

    const totalCategories = categoryAggregate.map(c => c._id);
    const categoryCount = {};
    categoryAggregate.forEach(c => { categoryCount[c._id] = c.count; });

    // 5️⃣ Send response
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
