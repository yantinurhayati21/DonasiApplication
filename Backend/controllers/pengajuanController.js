import Pengajuan from "../models/pengajuanModel.js";
import Notification from "../models/notificationsModel.js";
import User from "../models/usersModel.js";
import { io } from "../index.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Tempat menyimpan file di server
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Menggunakan nama file unik
  },
});

const upload = multer({ storage: storage });

const createPengajuanWithDetail = async (req, res) => {
  const { id_user, tanggal, nominal_pengajuan, daftar_pengeluaran } = req.body;

  if (
    !id_user ||
    !tanggal ||
    !nominal_pengajuan ||
    !Array.isArray(daftar_pengeluaran) ||
    daftar_pengeluaran.length === 0
  ) {
    return res.status(400).json({
      status: "error",
      message:
        "Data pengajuan dan daftar pengeluaran harus lengkap dan tidak kosong",
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
      message:
        "Total harga barang tidak boleh lebih besar dari nominal pengajuan",
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
      id_user,
      tanggal,
      nominal_pengajuan,
      daftar_pengeluaran,
      status_pengajuan,
      approval_from_pimpinan,
      approved_from_bendahara
    );
    const pengajuan = { id_pengajuan: result.id_pengajuan }; // Ambil ID pengajuan yang valid
    const bendahara = await User.getBendahara(); // Ambil data bendahara
    // const pimpinan = await User.getPimpinan(); // Ambil data pimpinan

    if (nominal_pengajuan > 200000) {
      // Kirim notifikasi ke bendahara
      await Notification.createNotification(
        bendahara.id_user,
        `Ada pengajuan baru dengan ID ${pengajuan.id_pengajuan} yang perlu disetujui oleh Bendahara.`,
        pengajuan.id_pengajuan
      );
      // Emit ke socket.io untuk pengiriman notifikasi dan data pengajuan secara real-time
      io.emit("new-pengajuan-bendahara", {
        id_pengajuan: pengajuan.id_pengajuan,
        pesan: `Ada pengajuan baru dengan ID ${pengajuan.id_pengajuan} yang perlu disetujui oleh Bendahara.`,
        id_bendahara: bendahara.id_user, // ID bendahara untuk menargetkan yang tepat
        data: await Pengajuan.getAll(),
      });
    }

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

const loginBendahara = async (req, res) => {
  const { id_bendahara } = req.body;

  try {

    // Ambil semua notifikasi yang belum dibaca untuk bendahara
    const notifications = await Notification.getNotificationsByUserId(
      id_bendahara
    );

    // Kirim notifikasi ke bendahara melalui Socket.io
    if (notifications.length > 0) {
      notifications.forEach((notification) => {
        io.emit("new-notification", {
          id_pengajuan: notification.ref_id,
          message: notification.message,
          id_user: id_bendahara,
        });
      });
    }

    // Ambil data pengajuan terbaru
    const pengajuanTerbaru = await Pengajuan.getLatestPengajuanByBendahara(
      id_bendahara
    );

    // Kirimkan data pengajuan terbaru ke bendahara
    io.emit("pengajuan-terbaru", pengajuanTerbaru);

    res.status(200).json({
      status: "success",
      message: "Login berhasil dan notifikasi telah dikirim",
      pengajuanTerbaru: pengajuanTerbaru,
    });
  } catch (error) {
    console.error("Error logging in bendahara:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil notifikasi atau data pengajuan",
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
    console.log(data);
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
const getJumlahPengajuanMenungguBendahara = async (req, res) => {
  try {
    const result = await Pengajuan.countByStatus("menunggu_bendahara");
    res.status(200).json({
      status: "success",
      jumlah: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil jumlah pengajuan",
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

const validStatuses = ["diterima", "ditolak", "menunggu"];

const approvalfromBendahara = async (req, res) => {
  const id_pengajuan = req.params.id;
  if (isNaN(id_pengajuan)) {
    return res.status(400).json({
      status: "error",
      message: "ID Pengajuan tidak valid",
    });
  }
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: "error",
      message: "Status tidak valid",
    });
  }

  try {
    await Pengajuan.approvalByBendahara(id_pengajuan, status);

    const pimpinan = await User.getPimpinan(); // Ambil data pimpinan
    const pengurus = await User.getPengurus(); // Ambil data pengurus
    const bendahara = await User.getBendahara(); // Ambil data bendahara
    // Kirim notifikasi ke pimpinan setelah bendahara approve
    
    await Notification.updateNotificationsToRead(id_pengajuan,bendahara.id_user);
    if (status === "diterima") {
      // Kirim ke pimpinan
      // Ubah status menjadi 'read' untuk notifikasi yang belum dibaca
      await Notification.createNotification(
        pimpinan.id_user,
        `Pengajuan dengan ID ${id_pengajuan} telah disetujui oleh Bendahara dan menunggu persetujuan Pimpinan.`,
        id_pengajuan
      );
      io.emit("new-pengajuan-pimpinan", {
        id_pengajuan,
        pesan: `Pengajuan dengan ID ${id_pengajuan} telah disetujui oleh Bendahara dan menunggu persetujuan Pimpinan.`,
        id_pimpinan: pimpinan.id_user, // ID pimpinan untuk menargetkan yang tepat
        data: await Pengajuan.getAll(),
      });
    } else if (status === "ditolak") {
      // Kirim ke pengurus
      // await Notification.createNotification(
      //   pengurus.id_user,
      //   `Pengajuan dengan ID ${id_pengajuan} ditolak oleh Bendahara.`,
      //   id_pengajuan
      // );
      // io.emit("pengajuan-ditolak", {
      //   id_pengajuan,
      //   pesan: `Pengajuan dengan ID ${id_pengajuan} ditolak oleh Bendahara.`,
      //   id_pengurus: pengurus.id_user, // ID pengurus untuk menargetkan yang tepat
      // });
    }
    res.status(200).json({
      status: "success",
      message: "Status pengajuan berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating pengajuan status:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui status pengajuan",
    });
  }
};

const approvalfromPimpinan = async (req, res) => {
  const id_pengajuan = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: "error",
      message: "Status tidak valid",
    });
  }

  try {
    await Pengajuan.approvalByPimpinan(id_pengajuan, status);
    const pengurus = await User.getPengurus(); // Ambil data pengurus
    const pimpinan = await User.getPimpinan(); // Ambil data pengurus
    const bendahara = await User.getBendahara(); // Ambil data bendahara
    // Kirim notifikasi ke pengurus dan bendahara setelah pimpinan memberikan keputusan
    // await Notification.createNotification(
    //   pimpinan.id_user,
    //   `Pimpinan telah memberikan keputusan untuk Pengajuan dengan ID ${id_pengajuan} `,
    //   id_pengajuan
    // );
    await Notification.updateNotificationsToRead(id_pengajuan, pimpinan.id_user);

    io.emit("pengajuan-diterima-pimpinan", {
      id_pengajuan,
      pesan: `Pengajuan dengan ID ${id_pengajuan} telah disetujui/ditolak oleh Pimpinan.`,
      id_bendahara: bendahara.id_user, // ID bendahara
      id_pengurus: pengurus.id_user, // ID pengurus
    });
    res.status(200).json({
      status: "success",
      message: "Status pengajuan berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating pengajuan status:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui status pengajuan",
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getAllNotification();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res
      .status(500)
      .json({ status: "error", message: "Gagal mendapatkan notifikasi" });
  }
};

const updatePengajuan = async (req, res) => {
  const { id_pengajuan, jumlah_pengeluaran, deskripsi, nama_act, harga_act } =
    req.body;
  const file = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const pengajuan = await Pengajuan.update(
      id_pengajuan,
      jumlah_pengeluaran,
      deskripsi,
      file,
      JSON.parse(nama_act),
      JSON.parse(harga_act)
    );

    if (pengajuan) {
      return res.status(200).json({
        status: "success",
        message: "Pengajuan berhasil diperbarui",
        data: pengajuan,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Pengajuan tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Error updating pengajuan:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat memperbarui pengajuan",
    });
  }
};
export const uploadFile = upload.single("file_bukti");

// Status Bukti Pengajuan
const handleUpdateStatusBukti = async (req, res) => {
  const { id_pengajuan } = req.params;
  const { status_bukti } = req.body;
  try {
    const updatedPengajuan = await Pengajuan.updateStatusBukti(
      id_pengajuan,
      status_bukti
    );
    res.status(200).json(updatedPengajuan);
  } catch (error) {
    console.error("Error updating status bukti:", error);
    res.status(500).json({ message: "Gagal memperbarui status bukti pengajuan" });
  }
};

export {
  createPengajuanWithDetail,
  loginBendahara,
  getAllPengajuan,
  getPengajuanById,
  getJumlahPengajuanMenungguBendahara,
  deletePengajuan,
  approvalfromPimpinan,
  approvalfromBendahara,
  getNotifications,
  updatePengajuan,
  handleUpdateStatusBukti
};
