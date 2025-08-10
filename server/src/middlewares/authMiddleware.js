import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token = req.cookies?.token;
  console.log("Token from cookie:", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: "verification failed:Not Authorized" });
    }
  } else {
    res.status(401).json({ message: "Not Authorized" });
  }
};

export default protect;
