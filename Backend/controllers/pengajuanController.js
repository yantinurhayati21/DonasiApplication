import Pengajuan from "../models/pengajuanModel.js";
import User from "../models/usersModel.js";
import { io } from "../index.js";
const createPengajuanWithDetail = async (req, res) => {
  const { id_pengurus, tanggal, nominal_pengajuan, daftar_pengeluaran } = req.body;

  if (
    !id_pengurus ||
    !tanggal ||
    !nominal_pengajuan ||
    !Array.isArray(daftar_pengeluaran) ||
    daftar_pengeluaran.length === 0
  ) {
    return res.status(400).json({
      status: "error",
      message: "Data pengajuan dan daftar pengeluaran harus lengkap dan tidak kosong",
    });
  }

  // Hitung total harga dari semua item pengeluaran
  const totalHargaBarang = daftar_pengeluaran.reduce(
    (total, item) => total + Number(item.total_harga),
    0
  );

  // Validasi total harga tidak boleh lebih besar dari nominal pengajuan
  if (totalHargaBarang > nominal_pengajuan) {
    return res.status(400).json({
      status: "error",
      message: "Total harga barang tidak boleh lebih besar dari nominal pengajuan",
    });
  }

  // Set status default
  let status_pengajuan = "menunggu_bendahara";
  let approval_from_pimpinan = "menunggu";
  let approved_from_bendahara = "menunggu";

  // Jika nominal pengajuan <= 200000, langsung set diterima
  if (nominal_pengajuan <= 200000) {
    status_pengajuan = "diterima";
    approval_from_pimpinan = "diterima";
    approved_from_bendahara = "diterima";
  }

  // Validasi setiap item pengeluaran
  for (const item of daftar_pengeluaran) {
    if (
      !item.nama_item ||
      !item.id_kategori ||
      !item.total_harga ||
      Number(item.total_harga) <= 0
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Setiap item pengeluaran harus memiliki nama_item, id_kategori, dan total_harga yang valid",
      });
    }
  }

  try {
    const result = await Pengajuan.createWithPengeluaran(
      id_pengurus,
      tanggal,
      nominal_pengajuan,
      daftar_pengeluaran,
      status_pengajuan,
      approval_from_pimpinan,
      approved_from_bendahara
    );
    const pengajuan = { id_pengajuan: result.id_pengajuan }; // Ambil ID pengajuan yang valid
    const bendahara = await User.getBendahara(); // Ambil data bendahara
    const pimpinan = await User.getPimpinan(); // Ambil data pimpinan

    // Kirim notifikasi ke bendahara dan pimpinan
    io.emit('new-pengajuan-bendahara', {
      id_pengajuan: pengajuan.id_pengajuan,
      pesan: `Ada pengajuan baru dengan ID ${pengajuan.id_pengajuan} yang perlu disetujui oleh Bendahara.`,
      id_bendahara: bendahara.id_user, // ID bendahara untuk menargetkan yang tepat
    });

    // Kirim notifikasi ke pimpinan setelah bendahara approve
    io.emit('new-pengajuan-pimpinan', {
      id_pengajuan: pengajuan.id_pengajuan,
      pesan: `Pengajuan dengan ID ${pengajuan.id_pengajuan} telah disetujui oleh Bendahara dan menunggu persetujuan Pimpinan.`,
      id_pimpinan: pimpinan.id_user, // ID pimpinan untuk menargetkan yang tepat
    });

    res.status(201).json({
      status: "success",
      message: "Pengajuan dan daftar pengeluaran berhasil dibuat",
      data: result,
    });
  } catch (error) {
    console.error("Error creating pengajuan dengan detail:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal membuat pengajuan",
    });
  }
};

const getAllPengajuan = async (req, res) => {
  try {
    const data = await Pengajuan.getAll();
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error fetching pengajuan:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data pengajuan",
    });
  }
};

const getPengajuanById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Pengajuan.getByIdWithDetails(id);
    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Pengajuan tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error fetching pengajuan by id:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data pengajuan",
    });
  }
};

const deletePengajuan = async (req, res) => {
  const { id } = req.params;

  try {
    await Pengajuan.delete(id);
    res.status(200).json({
      status: "success",
      message: "Pengajuan berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting pengajuan:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus pengajuan",
    });
  }
};

export {
  createPengajuanWithDetail,
  getAllPengajuan,
  getPengajuanById,
  deletePengajuan,
};
