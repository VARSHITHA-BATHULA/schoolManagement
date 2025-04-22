const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const schoolRoutes = require("./routes/schoolRoutes");
const errorHandler = require("./middleware/errorHandler");



dotenv.config();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("School Management API is running 🚀");
});

app.use("/api", schoolRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
