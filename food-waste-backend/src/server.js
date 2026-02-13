require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

connectDB();
app.get('/', (req, res) => {
  res.send('<h1>Testing the app</h1>');
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
