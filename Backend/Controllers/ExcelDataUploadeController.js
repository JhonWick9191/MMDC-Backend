
const xlsx = require("xlsx");
const excelModel = require("../Models/ProductUploadeModel");

async function ProductUploade(req, res) {
  console.log("API HITS");

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Excel file read
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // ✅ Clean keys (trim spaces) and format numeric fields
    const data = rawData.map((row) => {
      const cleanedRow = {};
      Object.keys(row).forEach((key) => {
        let value = row[key];
        const trimmedKey = key.trim();

        // ✅ Fields that should be converted to Number
        const numberFields = [
          "product_id",
          "Product_price",
          "Vendor_price",
          "VenderTex_Rate",
          "Product_Quantity"
        ];

        if (numberFields.includes(trimmedKey)) {
          if (typeof value === "string") {
            value = value.replace(/,/g, "").trim();  // remove commas & spaces
          }
          value = Number(value) || 0; // convert to number (fallback to 0)
        }

        cleanedRow[trimmedKey] = value;
      });
      return cleanedRow;
    });

    // ✅ Bulk upsert for all rows
    const updateData = data.map((row) => ({
      updateOne: {
        filter: { product_id: row.product_id }, // unique field
        update: { $set: row },
        upsert: true,
      },
    }));

    if (updateData.length > 0) {
      await excelModel.bulkWrite(updateData);
    }

    res.status(200).json({
      success: true,
      message: "File uploaded & data stored/updated successfully",
    });
  } catch (error) {
    console.log("Error occur at ProductUploade:", error);
    res.status(500).json({
      success: false,
      message: "Error occur while uploading the excel file",
    });
  }
}

// ✅ Get all Excel data
async function getAllExcelData(req, res) {
  try {
    const allData = await excelModel.find();
    console.log("All Excel Data:", allData);

    res.status(200).json({
      success: true,
      message: allData,
    });
  } catch (error) {
    console.log("Error while fetching Excel data:", error);
    res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
}

module.exports = { ProductUploade, getAllExcelData };
