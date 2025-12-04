const multer = require("multer");
const path = require("path");

// ------------------------------
// Storage Setup
// ------------------------------
// This decides where the Excel file will be saved
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // "uploads" is the folder where file will be stored
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    // Get file extension (.xlsx)
    const ext = path.extname(file.originalname);

    // Save file with unique name: 1700000000.xlsx
    cb(null, Date.now() + ext);
  }
});

// ------------------------------
// File Filter (Only Excel Allowed)
// ------------------------------
function excelFilter(req, file, cb) {
  // These MIME types belong to Excel files
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel" // .xls
  ];

  // Check if uploaded file type is allowed
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only Excel files are allowed"), false); // Reject file
  }
}

// ------------------------------
// Multer Upload Config
// ------------------------------
const upload = multer({
  storage: storage,        // Where to store file
  fileFilter: excelFilter, // Allow only excel files
  limits: {
    fileSize: 5 * 1024 * 1024, // Max file size = 5MB
  },
});

// Exporting upload function to use in router
module.exports = upload;
