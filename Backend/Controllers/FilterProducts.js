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

    const skip = (Number(page) - 1) * Number(limit);

    // 🔹 Dynamic Filter Object
    const filterObj = {};

    // ✅ Type Filter
    if (type) {
      filterObj.Product_Type = {
        $regex: `^${type.trim()}$`,
        $options: "i",
      };
    }

    // ✅ Brand Filter
    if (brand) {
      filterObj.Brand_Name = {
        $regex: `^${brand.trim()}$`,
        $options: "i",
      };
    }

    // ✅ SubCategory OR Category Filter
    if (subCategory) {
      const cleanSubCategory = subCategory.trim().replace(/\s+/g, " ");

      filterObj.$or = [
        {
          Product_Category: {
            $regex: `^${cleanSubCategory}$`,
            $options: "i",
          },
        },
        {
          Product_Subcategory: {
            $regex: `^${cleanSubCategory}$`,
            $options: "i",
          },
        },
      ];
    }

    /* =========================================================
       1️⃣ Paginated Products (Right Side Products Section)
    ========================================================== */

    const products = await Porducts.find(filterObj)
      .sort({ Product_price: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Porducts.countDocuments(filterObj);

    /* =========================================================
       2️⃣ Brand Count (Sidebar)
    ========================================================== */

    const brandAggregate = await Porducts.aggregate([
      { $match: filterObj },
      { $group: { _id: "$Brand_Name", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const brandCount = {};
    brandAggregate.forEach((b) => {
      if (b._id) {
        brandCount[b._id.trim()] = b.count;
      }
    });

    /* =========================================================
       3️⃣ Category Count (Sidebar)
    ========================================================== */

    const categoryAggregate = await Porducts.aggregate([
      { $match: filterObj },
      { $group: { _id: "$Product_Category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const categoryCount = {};
    categoryAggregate.forEach((c) => {
      if (c._id) {
        categoryCount[c._id.trim()] = c.count;
      }
    });

    /* =========================================================
       4️⃣ FULL Category → SubCategory Tree (NO PAGINATION)
       🔥 Ye hi tumhari main problem ka solution hai
    ========================================================== */

    const categoryTreeAggregate = await Porducts.aggregate([
      { $match: filterObj },
      {
        $group: {
          _id: "$Product_Category",
          subCategories: { $addToSet: "$Product_Subcategory" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categoryWithSubCategories = {};

    categoryTreeAggregate.forEach((item) => {
      if (item._id) {
        categoryWithSubCategories[item._id.trim()] =
          item.subCategories
            .filter((sub) => sub) // remove null
            .map((sub) => sub.trim());
      }
    });

    /* =========================================================
       5️⃣ Final Response
    ========================================================== */

    res.status(200).json({
      success: true,
      products,
      page: Number(page),
      limit: Number(limit),
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),

      brandCount,
      categoryCount,
      categoryWithSubCategories, // 🔥 IMPORTANT
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
