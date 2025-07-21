import Donasi from "../models/donasiModel.js";
import Pengajuan from "../models/pengajuanModel.js";

// Controller untuk mendapatkan laporan keuangan
const getLaporanKeuangan = async (req, res) => {
  const { startDate, endDate } = req.query;  // Start and End dates for the period (e.g., Juli 2025)

  try {
    // 1. Total Pemasukan (Donasi)
    const pemasukanDonatur = await Donasi.getPemasukanByDateRange(startDate, endDate);
    
    const pemasukanTetap = pemasukanDonatur.filter(item => item.jenis_donatur === 'Tetap');
    const pemasukanTidakTetap = pemasukanDonatur.filter(item => item.jenis_donatur === 'Tidak Tetap');

    const totalPemasukan = {
      tetap: pemasukanTetap.reduce((sum, item) => sum + parseFloat(item.total_nominal), 0),
      tidakTetap: pemasukanTidakTetap.reduce((sum, item) => sum + parseFloat(item.total_nominal), 0),
    };

    // 2. Laporan Pengeluaran (Barang yang Dibeli dan Harga Aktual)
    const laporanPengeluaran = await Pengajuan.getPengeluaranByDateRange(startDate, endDate);
    const totalPengeluaran = await Pengajuan.getTotalPengeluaranByDateRange(startDate, endDate);

    // 3. Saldo Awal (Total Pemasukan - Total Pengeluaran sebelum periode)
    // const startDatePrevMonth = new Date(startDate);
    // const endDatePrevMonth = new Date(endDate);
    // startDatePrevMonth.setMonth(startDatePrevMonth.getMonth() - 1);
    // const formattedPrevMonthDate = `${startDatePrevMonth.getFullYear()}-${String(startDatePrevMonth.getMonth() + 1).padStart(2, "0")}-${String(endDatePrevMonth.getDate()).padStart(2, "0")}`;
    const startDatePrevMonth = new Date(startDate);
    const endDatePrevMonth = new Date(endDate);

    // Kurangi 1 bulan dari startDate
    const targetMonth = startDatePrevMonth.getMonth() - 1;
    startDatePrevMonth.setMonth(targetMonth);

    // Sesuaikan tanggal agar tidak overflow
    const maxDaysInMonth = new Date(startDatePrevMonth.getFullYear(), startDatePrevMonth.getMonth() + 1, 0).getDate();
    const validDay = Math.min(endDatePrevMonth.getDate(), maxDaysInMonth);
    startDatePrevMonth.setDate(validDay);

    // Format hasil
    const formattedPrevMonthDate = `${startDatePrevMonth.getFullYear()}-${String(startDatePrevMonth.getMonth() + 1).padStart(2, "0")}-${String(startDatePrevMonth.getDate()).padStart(2, "0")}`;


    // Pemasukan Awal (Sebelum Juli 2025)
    const pemasukanAwal = await Donasi.getPemasukanAwal(formattedPrevMonthDate);
    const pengeluaranAwal = await Pengajuan.getPengeluaranAwal(formattedPrevMonthDate);

    // Pastikan tidak ada nilai null atau undefined
    const validPemasukanAwal = pemasukanAwal || 0;
    const validPengeluaranAwal = pengeluaranAwal || 0;

    const saldoAwal = validPemasukanAwal - validPengeluaranAwal;

    // 4. Saldo Akhir (Pemasukan - Pengeluaran)
    const saldoAkhir = totalPemasukan.tetap + totalPemasukan.tidakTetap - totalPengeluaran;

    // Mengirimkan data laporan keuangan
    res.status(200).json({
      totalPemasukan,
      laporanPengeluaran,
      totalPengeluaran,
      saldoAwal,
      saldoAkhir,
    });
  } catch (error) {
    console.error("Error fetching laporan keuangan", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};

export default {
  getLaporanKeuangan,
};
