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

export const updateDonaturStatus = async (req, res) => {
  try {
    const { status_aktif } = req.body;  // Mengambil status_aktif dari body request
    const { id } = req.params; // Mengambil id_donatur dari parameter URL
     // Log untuk memastikan status_aktif yang diterima
    console.log("Received status_aktif:", status_aktif);
    // Pastikan status_aktif adalah boolean (true/false)
    if (typeof status_aktif !== "boolean") {
      return res.status(400).json({ message: "status_aktif harus berupa boolean." });
    }

    // Memanggil fungsi updateStatus pada model Donatur
    const updatedDonatur = await Donatur.updateStatus(id, status_aktif);

    // Jika update berhasil, kirimkan data donatur yang diperbarui sebagai respons
    res.json({
      message: "Status donatur berhasil diperbarui.",
      donatur: updatedDonatur,
    });
  } catch (err) {
    console.error("Error updating donatur status:", err);
    res.status(500).json({ error: err.message });
  }
};


