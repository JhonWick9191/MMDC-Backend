const mongoose = require("mongoose")

const excelDataShema = new mongoose.Schema({
  product_id:Number,
  new:String,
  Model_number: {
  type: String,
  required: true,
},

  Brand_Name:String,
  Product_Name:String,
  Product_Type:String,
  Product_Category:String,
  Product_Subcategory:String,

  Product_Discripction:String,

  Product_Quantity:Number,
  
  image_01:String,
  image_02:String,
  image_03:String,
  image_04:String,
  image_05:String,
  
  VenderTex_Rate:Number,
  Product_price:Number,
  Vendor_price:Number,

})

module.exports = mongoose.model("exelDataSchema" , excelDataShema)