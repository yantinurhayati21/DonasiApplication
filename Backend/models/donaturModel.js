import pool from "../config/db.js";

const Donatur = {
  getByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM donatur WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  getAll: async () => {
    const result = await pool.query(
      "SELECT * FROM donatur ORDER BY created_at DESC"
    );
    return result.rows;
  },

  getByUserId: async (id_user) => {
    const result = await pool.query(
      "SELECT * FROM donatur WHERE id_user = $1",
      [id_user]
    );
    return result.rows[0];
  },

  create: async (nama, email, alamat, no_telepon, jenis_donatur) => {
    const result = await pool.query(
      `INSERT INTO donatur 
         (id_user, nama, email, alamat, no_telepon, jenis_donatur, status_aktif) 
       VALUES (NULL, $1, $2, $3, $4, $5, TRUE)
       RETURNING *`,
      [nama, email, alamat, no_telepon, jenis_donatur]
    );
    return result.rows[0];
  },

  createFromUser: async (
    user_id,
    nama,
    email,
    alamat,
    no_telepon,
    jenis_donatur
  ) => {
    const result = await pool.query(
      `INSERT INTO donatur 
         (id_user, nama, email, alamat, no_telepon, jenis_donatur, status_aktif) 
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING *`,
      [user_id, nama, email, alamat, no_telepon, jenis_donatur]
    );
    return result.rows[0];
  },

  updateStatus: async (id_donatur, status_aktif) => {
    const client = await pool.connect(); // Menggunakan client untuk transaksi

    try {
      // Mulai transaksi
      await client.query("BEGIN");

      // Update status_aktif donatur berdasarkan id_donatur
      const result = await client.query(
        `UPDATE donatur 
        SET status_aktif = $1 
        WHERE id_donatur = $2 
        RETURNING *`,
        [status_aktif, id_donatur]
      );
      const updatedDonatur = result.rows[0];

      // Jika status diupdate, komit transaksi
      await client.query("COMMIT");
      return updatedDonatur;
    } catch (error) {
      // Jika terjadi kesalahan, rollback transaksi
      await client.query("ROLLBACK");
      console.error("Error updating donatur status:", error);
      throw new Error(`Error updating donatur status: ${error.message}`);
    } finally {
      client.release(); // Pastikan koneksi dilepas
    }
  },
};

export default Donatur;
