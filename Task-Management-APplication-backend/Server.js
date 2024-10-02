const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");
const authRoutes = require("./Routes/Auth");
const Task = require('./Routes/Taskroutes')


require("dotenv").config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api",Task);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
