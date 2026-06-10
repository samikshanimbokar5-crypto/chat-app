const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  try {
    // Check token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } else {
      return res.status(401).json({
        message: "No Token Found",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Token Failed",
    });
  }
};

module.exports = { protect };