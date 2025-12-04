const xlsx = require("xlsx");
const GstModel = require("../Models/GstModel");

async function extractGST(req, res) {
  try {

    // File check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a GST Excel file",
      });
    }

    // Read Excel Sheet
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rawData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty",
      });
    }

    // Extract GST numbers from GST_Number column
    const gstNumbers = rawData
      .map((row) => row.GST_Number?.toString().trim())
      .filter((gst) => gst && gst !== "");

    if (gstNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No GST numbers found in the file",
      });
    }

    // Save each GST in MongoDB
    const savedGST = [];
    for (const gst of gstNumbers) {
      const saved = await GstModel.create({ gstNumber: gst });
      savedGST.push(saved);
    }

    return res.status(200).json({
      success: true,
      message: "GST numbers extracted & saved successfully",
      totalGST: gstNumbers.length,
      savedGST,
    });

  } catch (error) {
    console.error("GST Extract Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error while extracting GST numbers",
      error: error.message,
    });
  }
}

module.exports = { extractGST };
