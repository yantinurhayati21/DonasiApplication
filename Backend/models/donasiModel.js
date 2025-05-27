import { argon2d } from "argon2";
import pool from "../config/db.js";
import argon2 from "argon2";

const Donasi = {
  // Get all donasi
  getAll: async () => {
    const result = await pool.query(
      "SELECT * FROM donasi ORDER BY created_at DESC"
    );
    return result.rows;
  },

  // Get donasi by id
  getById: async (id) => {
    const result = await pool.query(
      "SELECT * FROM donasi WHERE id_donasi = $1",
      [id]
    );
    return result.rows[0];
  },

  // Create new donasi
  create: async (
    jenis_donatur, // 'Tetap' or 'Tidak Tetap'
    nominal,
    password,
    tanggal_donasi,
    // Tambahkan password untuk donatur Tetap
    status_donasi, // Pastikan status_donasi ada di parameter
    id_donatur
  ) => {
    // Check if donor type is 'Tidak Tetap'
    if (jenis_donatur === "Tidak Tetap") {
      // Insert into donatur table for 'Tidak Tetap'
      // const donaturResult = await pool.query(
      //   `INSERT INTO donatur
      //     (nama, email, alamat, no_telepon, jenis_donatur, status_aktif)
      //    VALUES ($1, $2, $3, $4, $5, $6)
      //    RETURNING id_donatur`,
      //   [nama, email, alamat, no_telepon, jenis_donatur, true]
      // );
    } else if (jenis_donatur === "Tetap") {
      // Handle 'Tetap' donor type: insert into users table first
      // if (!email || !password) {
      //   throw new Error('Email dan password harus diisi untuk donatur tetap.');
      // }

      // Insert into the `users` table for "Tetap" donatur
      // const userResult = await pool.query(
      //   `INSERT INTO users (email, password, role)
      //    VALUES ($1, $2, 'Donatur')
      //    RETURNING id_user`,
      //   [email, password]
      // );
      // const userId = userResult.rows[0].id_user;

      const isValidUser = await pool.query(
        "SELECT * FROM users WHERE id_user = $1",
        [id_donatur.id_user]
      );
      const isValidPassword = await argon2.verify(isValidUser.rows[0].password, password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      tanggal_donasi = new Date().toISOString();
    }

    try {
      const donasiResult = await pool.query(
        `INSERT INTO donasi 
           (id_donatur, tanggal_donasi, nominal, status_donasi) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [id_donatur.id_donatur, tanggal_donasi, nominal, "Checking"]
      );

      return donasiResult.rows[0];
    } catch (error) {
      console.error("Error inserting donation:", error);
      throw new Error("Failed to create donation");
    }
  },

  // Update existing donasi
  update: async (
    id,
    id_donatur,
    tanggal_donasi,
    nominal,
    metode_pembayaran,
    bukti_transfer,
    status_donasi,
    merchant_ref
  ) => {
    const result = await pool.query(
      "UPDATE donasi SET id_donatur = $1, tanggal_donasi = $2, nominal = $3, metode_pembayaran = $4, bukti_transfer = $5, status_donasi = $6, merchant_ref = $7, updated_at = NOW() WHERE id_donasi = $8 RETURNING *",
      [
        id_donatur,
        tanggal_donasi,
        nominal,
        metode_pembayaran,
        bukti_transfer,
        status_donasi,
        merchant_ref,
        id,
      ]
    );
    return result.rows[0];
  },

  // Delete donasi
  delete: async (id) => {
    await pool.query("DELETE FROM donasi WHERE id_donasi = $1", [id]);
  },

  // Change the status of donasi (for example, to mark it as 'Done')
  updateStatus: async (id, status_donasi) => {
    const result = await pool.query(
      "UPDATE donasi SET status_donasi = $1, updated_at = NOW() WHERE id_donasi = $2 RETURNING *",
      [status_donasi, id]
    );
    return result.rows[0];
  },
};

export default Donasi;
