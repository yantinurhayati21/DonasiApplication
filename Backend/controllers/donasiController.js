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
  const { id } = req.params;

  try {
    const donasi = await Donasi.getById(id);

    if (!donasi) {
      return res.status(404).json({
        status: "error",
        message: "Donasi tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      data: donasi,
    });
  } catch (error) {
    console.error("Error fetching donasi by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data donasi",
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

// ✅ Create Donasi (penyesuaian untuk jenis donatur)
const createDonasi = async (req, res) => {
  const {
    jenis_donatur,
    password,
    nama,
    email,
    alamat,
    no_telepon,
    nominal,
    tanggal_donasi
  } = req.body;
  const token = req.cookies.token;

  try {
    let id_donatur = null;
    // Check if donor type is 'Tidak Tetap'
    if (jenis_donatur === "Tidak Tetap") {
      // Insert into donatur table for 'Tidak Tetap'
      const donaturResult = await Donatur.create(
        nama,
        email,
        alamat,
        no_telepon,
        jenis_donatur, // 'Tetap' or 'Tidak Tetap'
      );
      id_donatur = donaturResult.id_donatur;
    } else if (jenis_donatur === "Tetap") {
      // Handle 'Tetap' donor type: insert into users table first
      // if (!email || !password) {
      //   throw new Error("Email dan password harus diisi untuk donatur tetap.");
      // }
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({
            message: "Token tidak valid",
          });
        }
        id_donatur = user.id_donatur;
      });;
      // // Insert into the `users` table for "Tetap" donatur
      // const userResult = await pool.query(
      //   `INSERT INTO users (email, password, role) 
      //    VALUES ($1, $2, 'Donatur') 
      //    RETURNING id_user`,
      //   [email, password]
      // );
      // const userId = userResult.rows[0].id_user;

      // // Insert into donatur table for "Tetap"
      // const donaturResult = await pool.query(
      //   `INSERT INTO donatur 
      //     (id_user, email, jenis_donatur, status_aktif) 
      //    VALUES ($1, $2, $3, $4) 
      //    RETURNING id_donatur`,
      //   [userId, email, jenis_donatur, true]
      // );
      // id_donatur = donaturResult.rows[0].id_donatur;
    } else {
      throw new Error("Invalid donor type.");
    }

    try {
      const donasiResult = await Donasi.create(
        jenis_donatur,
        nominal,
        password,
        tanggal_donasi,
        "Checking",
        id_donatur,
      );

      res.status(201).json({
        status: "success",
        message: "Donasi berhasil dibuat",
        data: donasiResult,
      });
    } catch (error) {
      console.error("Error inserting donation:", error);
      res.status(500).json({
        status: "error",
        message: "Gagal membuat donasi",
      });
    }
  } catch (error) {
    console.error("Error creating donasi:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Gagal membuat donasi",
    });
  }
};

// ✅ Update donasi
const updateDonasi = async (req, res) => {
  const { id } = req.params;
  const {
    id_donatur,
    tanggal_donasi,
    nominal,
    metode_pembayaran,
    bukti_transfer,
    status_donasi,
    merchant_ref,
  } = req.body;

  try {
    const updatedDonasi = await Donasi.update(
      id,
      id_donatur,
      tanggal_donasi,
      nominal,
      metode_pembayaran,
      bukti_transfer,
      status_donasi,
      merchant_ref
    );

    res.status(200).json({
      status: "success",
      message: "Donasi berhasil diperbarui",
      data: updatedDonasi,
    });
  } catch (error) {
    console.error("Error updating donasi:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui donasi",
    });
  }
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

export {
  getAllDonasi,
  getDonasiById,
  createDonasi,
  updateDonasi,
  deleteDonasi,
  updateStatusDonasi,
  paymentDonasi,
};
