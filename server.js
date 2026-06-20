const express = require("express");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const { protect } = require("./middleware/authMiddleware");
const { initSocket } = require("./socket");


const app = express();


app.use(
  cors({
    origin: function(origin, callback){

      const allowedOrigins = [
        "http://localhost:5173",
        "https://chat-app-qgkc.onrender.com"
      ];


      if(!origin || allowedOrigins.includes(origin)){

        callback(null,true);

      }
      else{

        callback(new Error("Not allowed by CORS"));

      }

    },

    credentials:true

  })
);

app.use(express.json());



// Database
connectDB();



// Routes

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/messages",
  messageRoutes
);


app.use(
  "/api/users",
  userRoutes
);



// Home Route

app.get("/", (req,res)=>{

  res.send("Server Running");

});




// Protected Route

app.get(
  "/api/protected",
  protect,
  (req,res)=>{

    res.json({

      message:"Protected Route Accessed",

      user:req.user

    });

  }
);




// HTTP Server

const server = http.createServer(app);




// Socket.IO

initSocket(server);




// Start Server

const PORT = process.env.PORT || 8000;


server.listen(PORT,()=>{

  console.log(
    `Server running on port ${PORT}`
  );

});