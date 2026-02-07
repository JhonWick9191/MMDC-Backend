require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookiesParser = require("cookie-parser");

const DbConnection = require("./Config/MongoDb");

const user = require("./Routes/User");
const upload = require("./Routes/UploadeExcelfileRoute");
const searchRoute = require("./Routes/SearchProductsRoute");
const adminDashboardRoute = require("./Routes/AdminDashboardRoute");
const approveUser = require("./Routes/ApproveUserRoute");
const gstExcleRoute = require("./Routes/gstUploadeCloude");
const logoutRoute = require("./Routes/LogoutRoute");
const getUser = require("./Routes/MyRoute");
const newProducts = require("./Routes/NewProductRoute");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   ✅ CORS FIX (MOST IMPORTANT)
   ========================= */
const allowedOrigins = [
  "https://musicandmore.co.in",
  "https://www.musicandmore.co.in",
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);



/* =========================
   Parsers (after CORS)
   ========================= */
app.use(express.json());
app.use(cookiesParser());

/* =========================
   Routes
   ========================= */
app.use("/api/v1", gstExcleRoute);
app.use("/api/v1", approveUser);
app.use("/api/v1", user);
app.use("/api/v1", upload);
app.use("/api/v1", logoutRoute);
app.use("/api/v1", getUser);
app.use("/api/v1", searchRoute);
app.use("/api/v1", newProducts);
app.use("/api/v1/admin/dashboard", adminDashboardRoute);

/* =========================
   Default route
   ========================= */
app.get("/", (req, res) => {
  res.send("This is by default route");
});

/* =========================
   Server start
   ========================= */
app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});

/* =========================
   DB Connection
   ========================= */
DbConnection();

/* =========================
   Birthday Email Scheduler
   ========================= */
const { initializeBirthdayScheduler } = require("./schedulers/BirthdayScheduler");
initializeBirthdayScheduler();
