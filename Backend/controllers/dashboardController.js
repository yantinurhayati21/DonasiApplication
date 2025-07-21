import pool from "../config/db.js";

const getDashboardData = async (req, res) => {
  try {
    const donaturTetapQuery = "SELECT COUNT(*) FROM donatur WHERE id_user IS NOT NULL";
    const totalDonasiQuery = "SELECT SUM(nominal) FROM donasi";
    const totalPengeluaranQuery = "SELECT SUM(pengeluaran_actual) FROM pengajuan";
    const saldoQuery = `
      SELECT (SELECT SUM(nominal) FROM donasi) - (SELECT SUM(pengeluaran_actual) FROM pengajuan) AS saldo
    `;

    // Log the queries before executing them
    console.log('Executing Queries:');
    console.log('donaturTetapQuery:', donaturTetapQuery);
    console.log('totalDonasiQuery:', totalDonasiQuery);
    console.log('totalPengeluaranQuery:', totalPengeluaranQuery);
    console.log('saldoQuery:', saldoQuery);

    // Menjalankan query secara bersamaan
    const donaturTetap = await pool.query(donaturTetapQuery);
    const totalDonasi = await pool.query(totalDonasiQuery);
    const totalPengeluaran = await pool.query(totalPengeluaranQuery);
    const saldo = await pool.query(saldoQuery);

    // Log the results before sending them in the response
    console.log('donaturTetap:', donaturTetap);
    console.log('totalDonasi:', totalDonasi);
    console.log('totalPengeluaran:', totalPengeluaran);
    console.log('saldo:', saldo);

    // Mengirimkan hasil dalam format JSON
    res.json({
      donaturTetap: donaturTetap.rows[0].count || 0, // Default to 0 if null
      totalDonasi: totalDonasi.rows[0].sum || 0,     // Default to 0 if null
      totalPengeluaran: totalPengeluaran.rows[0].sum || 0, // Default to 0 if null
      saldo: saldo.rows[0].saldo || 0,               // Default to 0 if null
    });
  } catch (err) {
    // More detailed logging
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

export { getDashboardData };
