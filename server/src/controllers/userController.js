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
