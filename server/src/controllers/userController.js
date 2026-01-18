import User from "../models/userModel.js";

export const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude password
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
