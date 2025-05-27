import pool from "../config/db.js";

const Donatur = {
  getByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM donatur WHERE email = $1", [email]);
    return result.rows[0];
  },
  getAll: async () => {
    const result = await pool.query("SELECT * FROM donatur ORDER BY created_at DESC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM donatur WHERE id_donatur = $1", [id]);
    return result.rows[0];
  },

  create: async (email, nama, alamat, no_telepon, jenis_donatur) => {
    
    let id_user = null;
    if(jenis_donatur === "Tetap"){
      // Insert the user first
      const userResult = await pool.query("select * from users where email = $1", [email]);
      id_user = userResult.rows[0].id_user;
    }

    console.log(jenis_donatur)
    // Insert the donatur using the id_user from the users table
    const donaturResult = await pool.query(
      "INSERT INTO donatur (id_user, nama, email, alamat, no_telepon, jenis_donatur, status_aktif) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [id_user, nama, email, alamat, no_telepon, jenis_donatur, true]
    );
    return donaturResult.rows[0];
  },

  update: async (id, email, password, role, nama, no_rekening, alamat, no_telepon, jenis_donatur, status_aktif) => {
    // Update the user first
    await pool.query(
      "UPDATE users SET email = $1, password = $2, role = $3, updated_at = NOW() WHERE id_user = (SELECT id_user FROM donatur WHERE id_donatur = $4)",
      [email, password, role, id]
    );

    // Update the donatur
    const result = await pool.query(
      "UPDATE donatur SET nama = $1, email = $2, no_rekening = $3, alamat = $4, no_telepon = $5, jenis_donatur = $6, status_aktif = $7, updated_at = NOW() WHERE id_donatur = $8 RETURNING *",
      [nama, email, no_rekening, alamat, no_telepon, jenis_donatur, status_aktif, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    // Delete from donatur, the user will be deleted due to the foreign key constraint
    await pool.query("DELETE FROM donatur WHERE id_donatur = $1", [id]);
  },
};

export default Donatur;
