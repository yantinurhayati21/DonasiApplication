import Donasi from "../models/donasiModel.js";
import Donatur from "../models/donaturModel.js";
import Midtrans from "midtrans-client";
import jwt from "jsonwebtoken";

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-t4kxaAxlEvTzWshqBBkDAP_i",
  clientKey: "SB-Mid-client-I98qkLjSbupoiE_R",
});

// ✅ Get all donasi
const getAllDonasi = async (req, res) => {
  try {
    const donasiList = await Donasi.getAll();
    res.status(200).json({
      status: "success",
      data: donasiList,
    });
  } catch (error) {
    console.error("Error fetching donasi:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data donasi",
    });
  }
};

// ✅ Get donasi by ID
const getDonasiById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID donasi harus berupa angka",
    });
  }

  try {
    const donasi = await Donasi.getById(id);
    res.status(200).json({
      success: true,
      data: donasi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil donasi",
      error: error.message,
    });
  }
};


// ✅ Payment donasi via Midtrans
const paymentDonasi = async (req, res) => {
  const { nominal } = req.body;

  try {
    const orderId = `DON-${Date.now()}`;

    const params = {
      transaction_details: {
        order_id: orderId,
        gross_amount: nominal,
      },
      customer_details: {
        first_name: `Donatur ID ${id_donatur}`,
        email: "anonymous@example.com", // Bisa diganti sesuai kebutuhan
      },
      credit_card: {
        secure: true,
      },
    };

    // Membuat token Midtrans
    const snapToken = await snap.createTransaction(params);

    // Mengirimkan response sukses dengan token transaksi
    res.status(201).json({
      status: "success",
      message: "Token Midtrans berhasil dibuat",
      data: {
        token: snapToken.token,
        order_id: orderId,
      },
    });
  } catch (error) {
    console.error("Error creating midtrans token:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal membuat transaksi Midtrans",
    });
  }
};

const createDonasiTidakTetap = async (req, res) => {
  const {
    nama,
    email,
    alamat,
    no_telepon,
    nominal,
    doa_pilihan,
    doa_spesific,
  } = req.body;

  try {
    const donatur = await Donatur.create(
      nama,
      email,
      alamat,
      no_telepon,
      "Tidak Tetap"
    );

    const orderId = `DON-${Date.now()}`;
    const tanggal_donasi = new Date();

    const donasi = await Donasi.create(
      donatur.id_donatur,
      nominal,
      tanggal_donasi,
      "Checking",
      doa_pilihan,
      doa_spesific,
      orderId
    );

    const snapToken = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: nominal,
      },
      customer_details: {
        first_name: nama,
        email,
      },
      credit_card: {
        secure: true,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Donasi tidak tetap berhasil dibuat",
      data: {
        token: snapToken.token,
        order_id: orderId,
        donasiId: donasi.id_donasi,
        jenisDonatur: donatur.jenis_donatur,
      },
    });
  } catch (error) {
    console.error("Error creating donasi tidak tetap:", error);
    res.status(500).json({ message: "Gagal membuat donasi tidak tetap" });
  }
};
// 🔸 Untuk donatur TETAP (harus login)
const createDonasiTetap = async (req, res) => {
  const { nominal, doa_pilihan, doa_spesific } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token from headaer:", token);
  try {
    if (!token) return res.status(401).json({ message: "Belum login" });

    const user = jwt.verify(token, process.env.JWT_SECRET);

    const id_user = user.id_user;
    if (!id_user) {
      return res.status(401).json({ message: "Token tidak valid: id_user tidak ada" });
    }
    const id_donatur = await getIdDonaturByUserId(id_user);

    const orderId = `DON-${Date.now()}`;
    const tanggal_donasi = new Date();

    const donasi = await Donasi.create(
      id_donatur,
      nominal,
      tanggal_donasi,
      "Checking",
      doa_pilihan,
      doa_spesific,
      orderId
    );
    const nama = user.nama || "Donatur Tetap";
    const email = user.email || "donatur@example.com";
    const snapToken = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: nominal,
      },
      customer_details: {
        first_name: nama,
        email: email,
      },
      credit_card: {
        secure: true,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Donasi tetap berhasil dibuat",
      data: {
        token: snapToken.token,
        order_id: orderId,
        donasiId: donasi.id_donasi,
        jenisDonatur: "Tetap",
      },
    });
  } catch (error) {
    console.error("Error creating donasi tetap:", error);
    res.status(500).json({ message: "Gagal membuat donasi tetap" });
  }
};

// Helper: get donatur
const getIdDonaturByUserId = async (id_user) => {
  const donatur = await Donatur.getByUserId(id_user);
  if (!donatur) {
    console.log("Donatur tidak ditemukan untuk id_user:", id_user);
    throw new Error("Donatur tetap tidak ditemukan");
  }
  return donatur.id_donatur;
};

// ✅ Delete donasi
const deleteDonasi = async (req, res) => {
  const { id } = req.params;

  try {
    await Donasi.delete(id);
    res.status(200).json({
      status: "success",
      message: "Donasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting donasi:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus donasi",
    });
  }
};

// ✅ Update status donasi (ex: dari "Checking" ke "Done")
const updateStatusDonasi = async (req, res) => {
  const { id } = req.params;
  const { status_donasi } = req.body;

  try {
    const updatedDonasi = await Donasi.updateStatus(id, status_donasi);

    res.status(200).json({
      status: "success",
      message: `Status donasi berhasil diperbarui menjadi ${status_donasi}`,
      data: updatedDonasi,
    });
  } catch (error) {
    console.error("Error updating donasi status:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui status donasi",
    });
  }
};

const getAllDonasiforBendahara = async (req, res) => {
  try {
    const data = await Donasi.getAllDonasiforBendahara();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data donasi',
      data: data
    });
  } catch (error) {
    console.error('Error saat mengambil data donasi:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data donasi',
      error: error.message
    });
  }
};


export {
  getAllDonasi,
  getDonasiById,
  createDonasiTetap,
  createDonasiTidakTetap,
  deleteDonasi,
  paymentDonasi,
  updateStatusDonasi,
  getAllDonasiforBendahara
};
