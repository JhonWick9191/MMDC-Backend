const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
require("dotenv").config();

const Email = process.env.MAIL_USER;
const passKey = process.env.PASS_KEY;

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: Email,
        pass: passKey,
    }
});

async function generateOrderPDF(order) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const filePath = `order_${order._id}.pdf`;
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // PDF Title
        doc.fontSize(20).text("Order Confirmation", { underline: true });
        doc.moveDown();

        doc.fontSize(12).text(`Order ID: ${order._id}`);
      
        doc.text(`Total Amount + GST and Tax Extra on Dealer Price : ₹${order.totalAmount}`);
          doc.text(`Please refer to the Terms & Conditions`)
        doc.moveDown();

        doc.fontSize(15).text("Products:", { underline: true });
        doc.moveDown();

        order.products.forEach(p => {
            doc.fontSize(12).text(`Product: ${p.Product_Name}`);
            doc.text(`Quantity: ${p.quantity}`);
            doc.text(`Price: ₹${p.Vendor_price}`);
            doc.moveDown();
        });

        doc.end();

        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
    });
}

async function sendOrderEmail(toEmail, order) {
    try {
        // 1️⃣ Create PDF
        const pdfPath = await generateOrderPDF(order);

        // -----------------------------------
        // 1️-  USER EMAIL  (PDF Attached)
        // -----------------------------------
        const userMailOptions = {
            from: Email,
            to: toEmail,
            subject: "Your Order Confirmation",
            html: `
                <h2>Your order has been successfully submitted  Thank you for Shopping with MMDC</h2>
            `,
            attachments: [
                {
                    filename: `order_${order._id}.pdf`,
                    path: pdfPath
                }
            ]
        };

        await transporter.sendMail(userMailOptions);
        console.log("Email sent to user");

        // -----------------------------------
        // 2️ - ADMIN EMAIL + SAME PDF ATTACHMENT
        // -----------------------------------
        const adminMailOptions = {
            from: Email,
            to: Email,
            subject: `Order Placed by: ${toEmail}`,
            html: `
                <div style="text-align:center; margin-bottom:20px;">
                    <img src="https://res.cloudinary.com/dfilhi9ku/image/upload/v1763107443/logo_mmdc_pt2lwh.png" width="150" alt="Company Logo" />
                </div>
                <h2>New Order Received!</h2>
                <p><strong>User Email:</strong> ${toEmail}</p>
                <p><strong>Order Status:</strong> Order Placed</p>

                <h3>Order Details:</h3>
              
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
                <hr>

                <h3>Products:</h3>
                ${order.products.map(
                    (p) => `
                    <div>
                        
                        <p><strong>${p.Product_Name}</strong></p>
                        <p>Quantity: ${p.quantity}</p>
                        <p>Price: ₹${p.Vendor_price}</p>
                        <img src="${p.product_image}" width="120"/>
                        <hr>
                    </div>`
                ).join("")}
            `,
            attachments: [
                {
                    filename: `order_${order._id}.pdf`,
                    path: pdfPath
                }
            ]
        };

        await transporter.sendMail(adminMailOptions);
        console.log("Admin email sent successfully!");

        // After sending mails → delete PDF
        fs.unlinkSync(pdfPath);

    } catch (err) {
        console.log("Email Error:", err);
    }
}

module.exports = sendOrderEmail;
