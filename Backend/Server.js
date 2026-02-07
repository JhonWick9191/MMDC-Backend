
require("dotenv").config();
const express = require("express");
const DbConnection = require("./Config/MongoDb")
const user = require("./Routes/User")
const upload = require("./Routes/UploadeExcelfileRoute")
const app = express();
const cors = require("cors")
const searchRoute = require("./Routes/SearchProductsRoute")
const adminDashboardRoute = require("./Routes/AdminDashboardRoute")





// importing cookie parser 

const cookiesParser = require("cookie-parser");
app.use(cookiesParser())

// import route 
const gstExcleRoute = require("./Routes/gstUploadeCloude")
app.use("/api/v1", gstExcleRoute)
// getting env content 


const PORT = process.env.PORT || 5000;

// adding parser for while geting req form body it is responsible for pass data from request body to the backend 
app.use(express.json());

// app also use cookie parser for get the token from the cookies 




// adding cros oriign for which we can add frontend to backend 

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://musicandmore.co.in", "https://www.musicandmore.co.in"],
    credentials: true,
}))

// approve user by admin  
const approveUser = require("./Routes/ApproveUserRoute")
app.use("/api/v1", approveUser)

//creating defalut route 

app.get("/", (req, res) => (
    res.send("This is by defaul route ")
))

// adding Routes 

app.use("/api/v1", user)

// adding route from uplode products 

app.use("/api/v1", upload)
// Port of the app 

// logout hander 

// Server.js (tumhare existing code me already hai)
const logoutRoute = require("./Routes/LogoutRoute");
app.use("/api/v1", logoutRoute);  // Yeh line already hai


// Route for search products 

// get route for user details 

const getUser = require("./Routes/MyRoute")

app.use("/api/v1", getUser)

app.use("/api/v1", searchRoute)

// new products 

const newProducts = require("./Routes/NewProductRoute")
app.use("/api/v1", newProducts)
app.use("/api/v1/admin/dashboard", adminDashboardRoute)

app.listen(PORT, () => {
    console.log(`Server is started asjdon ${PORT}`)

})


// making  db connection 

DbConnection();

// Initialize birthday email scheduler
const { initializeBirthdayScheduler } = require("./schedulers/BirthdayScheduler");
initializeBirthdayScheduler();


