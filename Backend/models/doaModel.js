import pool from "../config/db.js";

const Doa = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM Doa");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM Doa WHERE id_doa = $1", [id]);
    return result.rows[0];
  },

  create: async (nama_doa, isi_doa) => {
    const result = await pool.query(
      "INSERT INTO Doa (nama_doa, isi_doa) VALUES ($1, $2) RETURNING *",
      [nama_doa, isi_doa]
    );
    return result.rows[0];
  },

  update: async (id, nama_doa, isi_doa) => {
    const result = await pool.query(
      "UPDATE Doa SET nama_doa = $1, isi_doa = $2 WHERE id_doa = $3 RETURNING *",
      [nama_doa, isi_doa, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM Doa WHERE id_doa = $1", [id]);
  },
};

export default Doa;
