const express = require("express");
const cors = require("cors");
const http = require("http");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { protect } = require("./middleware/authMiddleware");
const { initSocket } = require("./socket");

const app = express();


// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-vercel-url.vercel.app"
    ],
    credentials: true
  })
);


app.use(express.json());


// Connect Database
connectDB();


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


// Home Route
app.get("/", (req, res) => {

  res.send("Server Running");

});


// Protected Route
app.get("/api/protected", protect, (req, res) => {

  res.json({

    message: "Protected Route Accessed",

    user: req.user,

  });

});


// Create HTTP Server
const server = http.createServer(app);


// Initialize Socket.IO
initSocket(server);


// Start Server
const PORT = process.env.PORT || 8000;


server.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});