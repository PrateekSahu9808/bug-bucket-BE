import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    //checking the user exist or not
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    // create new user
    const user = await User.create({ name, email, password });
    //jwt token
    const token = generateToken(user._id);
    //Send cookie
    res.clearCookie("token", {
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      overwrite: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      message: "User registered successfully",
      responseCode: 201,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //checking
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter Email or Password" });
    }
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    // check if password is valid or not
    const token = generateToken(user._id);
    res.clearCookie("token", {
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      overwrite: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      message: "Login Successfull",
      responseCode: 200,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
