import pool from "../config/db.js";

const Kategori = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM kategori_pengeluaran ORDER BY nama_kategori");
    return result.rows;
  },

  getAllData: async () => {
    const result = await pool.query("SELECT * FROM kategori_pengeluaran");
    return result.rows;
  },

getById: async (id) => {
    const result = await pool.query(
      "SELECT * FROM kategori_pengeluaran WHERE id_kategori = $1",
      [id]
    );
    return result.rows[0];
  },

  create: async (nama_kategori) => {
    const result = await pool.query(
      "INSERT INTO kategori_pengeluaran (nama_kategori) VALUES ($1) RETURNING *",
      [nama_kategori]
    );
    return result.rows[0];
  },

  update: async (id, nama_kategori) => {
    const result = await pool.query(
      "UPDATE kategori_pengeluaran SET nama_kategori = $1 WHERE id_kategori = $2 RETURNING *",
      [nama_kategori, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM kategori_pengeluaran WHERE id_kategori = $1", [id]);
  },
};

export default Kategori;


