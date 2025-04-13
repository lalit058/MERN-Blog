import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required!" });
  }
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
  }
  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "User not found!" });
      }
      // Compare the password with the hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Invalid credentials!" });
      }

      // Generate JWT token
      const accessToken = generateAccessToken(user._id, user.role, user.name, user.email);
      const refreshToken = generateRefreshToken(user._id);

      // Update user with refresh token
      user.refreshToken = refreshToken;
      await user.save();

      // Set the token in cookies
      res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // use true in production (https)
          sameSite: "strict",
          maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // use true in production (https)
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return token (optional) and user details
      const { password: hashedPassword, refreshToken: refToken, ...userDetails } = user.toObject();
      res.status(200).json({
          message: "Logged in successfully",
          user: userDetails,
          accessToken: accessToken
      });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};


export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.Token);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user._id, user.role);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(400).json({ message: "Invalid refresh token" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};