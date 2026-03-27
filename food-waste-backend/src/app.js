const express = require("express");
const cors = require("cors");

const app = express();
const errorHandler = require("./middlewares/errorMiddleware");
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/food", require("./routes/foodRoutes"));
app.use("/requests", require("./routes/requestsRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/complaints", require("./routes/complaintRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));
app.use(errorHandler);
module.exports = app;
