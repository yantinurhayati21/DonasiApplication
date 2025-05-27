import User from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get bendahara (single user)
export const getBendahara = async (req, res) => {
  try {
    const user = await User.getBendahara();

    if (!user) {
      return res.status(404).json({ message: "Bendahara tidak ditemukan" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPimpinan = async (req, res) => {
  try {
    const user = await User.getPimpinan();

    if (!user) {
      return res.status(404).json({ message: "Pimpinan tidak ditemukan" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Create new user
export const createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await User.create(email, password);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, role } = req.body;
  try {
    const updatedUser = await User.update(id, email, password, role);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.delete(id);
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.getByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const { role } = user;
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, role });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login gagal" });
  }
};