const express = require('express');
const dotenv = require('dotenv');
const app = express();
const path = require("path");
const cors = require('cors');

dotenv.config();
const port = process.env.PORT;

const connectDB = require('./config/db');
const reviewRoutes = require("./routes/reviewRoutes");
const blogRoutes = require("./routes/blogRoutes");
const messageRoutes = require("./routes/messageRoutes");
const contactRoutes = require("./routes/contactRoutes");
const socialRoutes = require("./routes/socialRoutes");
const statsRoutes = require("./routes/statsRoutes");
const adminRoutes = require("./routes/adminRoutes");



// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500","http://localhost:5000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ API routes FIRST
app.use("/api/blogs", blogRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", socialRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);



app.use((err, req, res, next) => {
  if (err && (err.type === "entity.too.large" || err.name === "PayloadTooLargeError")) {
    return res.status(413).json({
      message: "Uploaded image is too large. Please upload a smaller image.",
      error: "PayloadTooLarge"
    });
  }

  return next(err);
});

// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});