// exporting express 

const express = require("express");
const DbConnection = require("./Config/MongoDb")
const user = require("./Routes/User")
const upload = require("./Routes/UploadeExcelfileRoute")
const app = express();
const cors = require("cors")
const searchRoute = require("./Routes/SearchProductsRoute")




// importing cookie parser 

const cookiesParser = require("cookie-parser");


// import route 
const gstExcleRoute = require("./Routes/gstUploadeCloude")
app.use("/api/v1", gstExcleRoute)
// getting env content 
require("dotenv").config();

const PORT = process.env.PORT || 5000; 

// adding parser for while geting req form body it is responsible for pass data from request body to the backend 
 app.use(express.json());

// app also use cookie parser for get the token from the cookies 

app.use(cookiesParser())


// adding cros oriign for which we can add frontend to backend 

app.use(cors({
      origin: ["http://localhost:5173", "http://localhost:3000" ,"https://mmdc-frontend-20.onrender.com", "https://mmdc-frontend-102.onrender.com"],
      credentials: true
}))

// approve user by admin  
const approveUser = require("./Routes/ApproveUserRoute")
app.use("/api/v1", approveUser)

//creating defalut route 

app.get("/", (req ,res)=>(
    res.send("This is by defaul route ")
))

// adding Routes 

app.use("/api/v1" , user )

// adding route from uplode products 

app.use("/api/v1",upload)
// Port of the app 

// Route for search products 

app.use("/api/v1", searchRoute)

app.listen(PORT, ()=>{    
    console.log(`Server is started asjdon ${PORT}`)
    
})


// making  db connection 

DbConnection();


