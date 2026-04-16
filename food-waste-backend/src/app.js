const express = require("express");
const cors = require("cors");

const app = express();
const errorHandler = require("./middlewares/errorMiddleware");
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/food", require("./routes/foodRoutes"));
app.use("/api/requests", require("./routes/requestsRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use(errorHandler);
module.exports = app;