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

export const getByUserId = async (req, res) => {
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
    const { email, password, nama, alamat, no_telepon } = req.body;

    // Membuat user baru
    const userResult = await User.create(email, password);
    console.log(userResult);
    if (userResult.id_user === null) {
      throw new Error("Failed to create user");
    }
    // Membuat donatur baru dengan ID user yang baru dibuat
    const newDonatur = await Donatur.createFromUser(
      userResult.id_user,
      nama,
      email,
      alamat,
      no_telepon,
      "Tetap" // Default jenis donatur
    );

    // Mengembalikan response dengan JWT token
    res.status(201).json({
      message: "Pendaftaran Donatur Berhasil",
      donatur: newDonatur,
      token: userResult.token, // Mengirimkan token ke frontend
    });
  } catch (err) {
    console.error("Error during Donatur registration:", err);
    res.status(500).json({
      error: "Gagal mendaftar donatur, coba lagi.",
    });
  }
};

export const updateDonatur = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      nama,
      no_rekening,
      alamat,
      no_telepon,
      jenis_donatur,
      status_aktif,
    } = req.body;

    // Update the donatur and associated user
    const updatedDonatur = await Donatur.update(
      req.params.id,
      email,
      password,
      role,
      nama,
      no_rekening,
      alamat,
      no_telepon,
      jenis_donatur,
      status_aktif
    );
    res.json(updatedDonatur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDonatur = async (req, res) => {
  let { id_donatur } = req.params;

  // Konversi id_donatur menjadi integer jika perlu
  id_donatur = parseInt(id_donatur, 10); // Pastikan id_donatur adalah integer

  if (isNaN(id_donatur)) {
    return res
      .status(400)
      .json({ error: "Invalid id_donatur. It must be an integer." });
  }

  console.log("Attempting to delete donatur with id:", id_donatur); // Log id_donatur

  try {
    await Donatur.delete(id_donatur);
    res.json({ message: "Donatur deleted successfully" });
  } catch (err) {
    console.error("Error deleting donatur:", err); // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
};
