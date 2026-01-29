const express = require("express");
const Porducts = require("../Models/ProductUploadeModel");

async function filterProducts(req, res) {
  try {
    const {
      type,
      brand,
      subCategory,
      page = 1,
      limit = 20,
      sort = "asc",
    } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Product type is required",
      });
    }

    const skip = (page - 1) * limit;

    // 🔹 Base filter (case-insensitive Product Type)
    const filterObj = {
      Product_Type: { $regex: `^${type}$`, $options: "i" },
    };

    // 🔹 Brand filter
    if (brand) {
      filterObj.Brand_Name = brand.trim();
    }

    // 🔹 Category OR Subcategory filter (with cleaning)
    if (subCategory) {
      const cleanSubCategory = subCategory.trim().replace(/\s+/g, " ");
      console.log("Selected SubCategory:", cleanSubCategory);
      console.log(`${cleanSubCategory} -> Product_Category OR Product_Subcategory`);

      filterObj.$or = [
        { Product_Category: { $regex: `^${cleanSubCategory}$`, $options: "i" } },
        { Product_Subcategory: { $regex: `^${cleanSubCategory}$`, $options: "i" } },
      ];
    }

    // 1️⃣ Products (pagination + sorting)
    const products = await Porducts.find(filterObj)
      .sort({ Product_price: sort === "asc" ? 1 : -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    // 2️⃣ Total product count
    const totalProducts = await Porducts.countDocuments(filterObj);

    // 3️⃣ Brand counts
    const brandAggregate = await Porducts.aggregate([
      { $match: { Product_Type: { $regex: `^${type}$`, $options: "i" } } },
      { $group: { _id: "$Brand_Name", count: { $sum: 1 } } },
    ]);

    const brandCount = {};
    brandAggregate.forEach((b) => {
      if (b._id) brandCount[b._id.trim()] = b.count; // trim spaces
    });

    // 4️⃣ Category counts
    const categoryAggregate = await Porducts.aggregate([
      { $match: { Product_Type: { $regex: `^${type}$`, $options: "i" } } },
      { $group: { _id: "$Product_Category", count: { $sum: 1 } } },
    ]);

    const categoryCount = {};
    const totalCategories = [];
    categoryAggregate.forEach((c) => {
      if (c._id) {
        const cleanCategory = c._id.trim().replace(/\s+/g, " ");
        categoryCount[cleanCategory] = c.count;
        totalCategories.push(cleanCategory);
      }
    });

    // 5️⃣ Category → Subcategory mapping (for UI / debug)
    const subCategoryAggregate = await Porducts.aggregate([
      {
        $match: {
          Product_Type: { $regex: `^${type}$`, $options: "i" },
          Product_Subcategory: { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$Product_Category",
          subCategories: { $addToSet: "$Product_Subcategory" },
        },
      },
    ]);

    const categoryWithSubCategories = {};
    subCategoryAggregate.forEach((item) => {
      if (item._id) {
        const cleanCategory = item._id.trim().replace(/\s+/g, " ");
        const cleanSubCats = item.subCategories.map((sc) =>
          sc.trim().replace(/\s+/g, " ")
        );
        categoryWithSubCategories[cleanCategory] = cleanSubCats;
      }
    });

    // 6️⃣ Final response
    res.status(200).json({
      success: true,
      message: products,
      data: "Data fetched successfully",
      page: Number(page),
      limit: Number(limit),
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      totalBrands: Object.keys(brandCount).length,
      totalCategories,
      brandCount,
      categoryCount,

      // 🔥 DEBUG / UI data
      categoryWithSubCategories,
    });
  } catch (error) {
    console.error("Error in filterProducts:", error);
    res.status(500).json({
      success: false,
      message: "Error while filtering products",
    });
  }
}

module.exports = { filterProducts };
