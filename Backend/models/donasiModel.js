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
    id_donatur,
    nominal,
    tanggal_donasi,
    status_donasi,
    doa_pilihan = [],
    doa_spesific = null,
    order_id
  ) => {
    try {
      // Insert ke tabel donasi tanpa id_doa (karena relasi di tabel doa_donasi)
      const donasiResult = await pool.query(
        `INSERT INTO donasi 
           (id_donatur, tanggal_donasi, nominal, status_donasi, doa_spesific, order_id)
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [id_donatur, tanggal_donasi, nominal, status_donasi, doa_spesific, order_id]
      );
      const donasi = donasiResult.rows[0];

      // Insert ke tabel doa_donasi untuk tiap id_doa yang dipilih
      for (const id_doa of doa_pilihan) {
        await pool.query(
          `INSERT INTO doa_donasi (id_donasi, id_doa) VALUES ($1, $2)`,
          [donasi.id_donasi, id_doa]
        );
      }

      return donasi;
    } catch (error) {
      console.error('Error inserting donation:', error);
      throw new Error('Failed to create donation');
    }
  },

  // Update existing donasi
  

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
