const OrderModel = require("../Models/OrderModel");
const ProductModel = require("../Models/ProductUploadeModel");

async function deleteOrderProduct(req, res) {
  try {
    const { orderId, productId } = req.body;
    const userId = req.user.id;

    // Check karo ki order user ka hai
    const order = await OrderModel.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Order me product dhundho
    const productToDelete = order.products.find(prod => prod._id.toString() === productId);
    if (!productToDelete) {
      return res.status(404).json({ success: false, message: "Product not found in order" });
    }

    // Stock quantity increase kar do
    await ProductModel.updateOne(
      { product_id: productToDelete.product_id },
      { $inc: { Product_Quantity: 1 } }
    );

    // Product ko order se hatao
    order.products = order.products.filter(prod => prod._id.toString() !== productId);

    // Order ko save karo
    await order.save();

    // Updated order bhejo
    res.status(200).json({ success: true, message: "Product deleted and stock updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting product from order" });
  }
}

module.exports = { deleteOrderProduct };
