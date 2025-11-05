import Donatur from "../models/donaturModel.js";
import User from "../models/usersModel.js";
import sendEmail from "../services/emailService.js";

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
    const { status_aktif } = req.body; // Mengambil status_aktif dari body request
    const { id } = req.params; // Mengambil id_donatur dari parameter URL
    // Log untuk memastikan status_aktif yang diterima
    console.log("Received status_aktif:", status_aktif);
    // Pastikan status_aktif adalah boolean (true/false)
    if (typeof status_aktif !== "boolean") {
      return res
        .status(400)
        .json({ message: "status_aktif harus berupa boolean." });
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

// Fungsi untuk mengirim email pengingat ke semua donatur tetap
export const sendReminderToAllDonaturTetap = async (req, res) => {
  try {
    const donaturList = await Donatur.getAllTetapAktif(); // Memanggil getAll() untuk mengambil donatur tetap yang aktif

    if (donaturList.length === 0) {
      return res.status(404).json({ message: "Tidak ada donatur tetap yang aktif" });
    }

    // Kirim email pengingat untuk setiap donatur yang aktif dan jenis donatur 'Tetap'
    const emailPromises = donaturList.map(async (donatur) => {
      // Membuat konten email dengan HTML yang lebih menarik
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f7f6; padding: 20px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2C6F89;">Halo ${donatur.nama},</h2>
            <p style="color: #555; font-size: 16px;">
              Ini adalah pengingat untuk donasi bulan ini. Terima kasih atas dukungan Anda yang luar biasa!
            </p>
            <p style="color: #555; font-size: 16px;">
              Kami sangat menghargai kontribusi Anda, dan bersama-sama kita membuat perbedaan yang besar!
            </p>
            <a href="http://localhost:3001/authentication/sign-in" style="background-color: #4CAF50; color: #fff; padding: 12px 24px; font-size: 18px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">Masuk ke Aplikasi Donasi</a>
            <p style="color: #555; font-size: 14px; margin-top: 20px;">
              Jika Anda memiliki pertanyaan atau membutuhkan bantuan, silakan hubungi kami di <a href="mailto:support@donasi.com">support@donasi.com</a>.
            </p>
          </div>
        </div>
      `;

      // Kirim email pengingat dengan konten HTML
      await sendEmail(donatur.email, "Pengingat Donasi Bulanan", htmlContent);

      // Perbarui kolom last_reminder_sent setelah email dikirim
      await Donatur.updateReminderSentDate(donatur.id_donatur);
    });

    // Tunggu semua email terkirim secara paralel
    await Promise.all(emailPromises);

    res.status(200).json({ message: "Pengingat berhasil dikirim ke semua donatur tetap yang aktif." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengirim pengingat", error: error.message });
  }
};


