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

  delete: async (id_donatur) => {
    const client = await pool.connect(); // Use client for transaction handling

    try {
      // Pastikan id_donatur adalah integer
      console.log(
        "Received id_donatur:",
        id_donatur,
        "Type:",
        typeof id_donatur
      );
      id_donatur = parseInt(id_donatur, 10);

      if (isNaN(id_donatur)) {
        throw new Error("id_donatur must be an integer.");
      }

      console.log("Attempting to delete donatur with id:", id_donatur);

      await client.query("BEGIN");

      // Step 1: Check if the donatur exists
      const donaturRes = await client.query(
        "SELECT * FROM donatur WHERE id_donatur = $1::int", // Menggunakan cast ::int untuk memastikan integer
        [id_donatur]
      );

      console.log("Donatur query result:", donaturRes.rows);

      if (donaturRes.rows.length === 0) {
        throw new Error("Donatur not found");
      }

      const donatur = donaturRes.rows[0];

      // Step 2: Now delete from donatur table first
      await client.query(
        "DELETE FROM donatur WHERE id_donatur = $1::int", // Menggunakan cast ::int untuk memastikan integer
        [id_donatur]
      );

      console.log("Deleted donatur with id:", id_donatur);

      // Step 3: If donatur is a permanent one (id_user is not null), delete from users table
      if (donatur.id_user !== null) {
        await client.query(
          "DELETE FROM users WHERE id_user = $1::int", // Menggunakan cast ::int untuk memastikan integer
          [donatur.id_user]
        );

        console.log("Deleted user with id_user:", donatur.id_user);
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error during deletion:", error);
      throw new Error(`Error deleting donatur: ${error.message}`);
    } finally {
      client.release();
    }
  },
};

export default Donatur;
