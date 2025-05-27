import Donatur from "../models/donaturModel.js";
import User from "../models/usersModel.js";

export const getAllDonatur = async (req, res) => {
  try {
    const donatur = await Donatur.getAll();
    res.json(donatur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDonaturById = async (req, res) => {
  try {
    const donatur = await Donatur.getById(req.params.id);
    if (!donatur) return res.status(404).json({ message: "Donatur not found" });
    res.json(donatur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDonatur = async (req, res) => {
  try {
    const { email, password, nama, alamat, no_telepon} = req.body;

    const userResult = await User.create(email, password);
    // Create the donatur and associated user in one go
    const newDonatur = await Donatur.create(email, nama, alamat, no_telepon, "Tetap");
    res.status(201).json(newDonatur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDonatur = async (req, res) => {
  try {
    const { email, password, role, nama, no_rekening, alamat, no_telepon, jenis_donatur, status_aktif } = req.body;

    // Update the donatur and associated user
    const updatedDonatur = await Donatur.update(req.params.id, email, password, role, nama, no_rekening, alamat, no_telepon, jenis_donatur, status_aktif);
    res.json(updatedDonatur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDonatur = async (req, res) => {
  try {
    await Donatur.delete(req.params.id);
    res.json({ message: "Donatur deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};