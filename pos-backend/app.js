const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// DB
connectDB();

// ✅ IMPORTANT CORS FIX
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ BODY + COOKIE
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/print", require("./routes/printRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/dish", require("./routes/dishRoutes"));
app.use("/api/analysis", require("./routes/analysisRoutes"))

app.get("/", (req, res) => {
  res.json({ message: "POS Server Running ✅" });
});

// ERROR HANDLER
app.use(globalErrorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});