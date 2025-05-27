import pool from "../config/db.js";

const Kategori = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM kategori_pengeluaran ORDER BY nama_kategori");
    return result.rows;
  },
};

export default Kategori;
