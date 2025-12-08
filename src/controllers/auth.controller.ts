import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { signToken } from "../utils/authUtils";

// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = signToken(user._id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Login User
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password"); //Explicitly select
    if (!user || !(await bcrypt.compare(password, user.password as string))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken(user._id);
    res.json({
      status: "success",
      token,
      data: {
        user: { id: user._id, name: user.name, role: user.role },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
