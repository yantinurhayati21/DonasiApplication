import pool from "../config/db.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import Donatur from "./donaturModel.js";
import { getByUserId } from "../controllers/donaturController.js";

const User = {
  // Ambil semua user
  getAll: async () => {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );
    return result.rows;
  },

  // Ambil user berdasarkan ID
  getUserById: async (id_user) => {
    const result = await pool.query("SELECT * FROM users WHERE id_user = $1", [
      id_user,
    ]);
    return result.rows[0];
  },
  
  getByUserId: async (id_user) => {
    const result = await pool.query(
      "SELECT * FROM donatur WHERE id_user = $1",
      [id_user]
    );
    return result.rows[0]; 
  },

  getUserByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },
    // Ambil user bendahara (asumsi hanya 1)
  getBendahara: async () => {
    const result = await pool.query(
      "SELECT id_user FROM users WHERE email = 'bendahara@iyd.com'"
    );
    return result.rows[0]; // single object user bendahara
  },

  // Cari user berdasarkan email
  getPimpinan: async () => {
    const result = await pool.query(
      "SELECT id_user FROM users WHERE email = 'pimpinan@iyd.com'"
    );
    return result.rows[0];
  },

  getPengurus: async () => {
    const result = await pool.query(
      "SELECT id_user FROM users WHERE email = 'pengurus@iyd.com'"
    );
    return result.rows[0];
  },

  // Buat user baru
  create: async (email, password) => {
    const hashedPassword = await argon2.hash(password);
    const result = await pool.query(
      `INSERT INTO users (email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        email,
        hashedPassword,
        "Donatur",
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
    return result.rows[0];
  },

  // Update user
  update: async (id_user, email, password, role) => {
    const result = await pool.query(
      `UPDATE users
       SET email = $1,
           password = $2,
           role = $3,
           updated_at = NOW()
       WHERE id_user = $4
       RETURNING *`,
      [email, password, role, id_user]
    );
    return result.rows[0];
  },

  // Hapus user
  delete: async (id_user) => {
    await pool.query("DELETE FROM users WHERE id_user = $1", [id_user]);
  },
  login: async (email, password) => {
    try {
      const user = await User.getByEmail(email);
      const idDonatur = await Donatur.getByEmail(email);
      if (!user) {
        return null;
      }
      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        return null;
      }

      // Buat access token tanpa expiration time
      const accessToken = jwt.sign(
        {
          userId: user.id_user,
          id_donatur: idDonatur
        },
        process.env.JWT_SECRET
      );
      // Mengirimkan token ke klien
      return accessToken;
    } catch (error) {
      return error;
    }
  },
};

export default User;
