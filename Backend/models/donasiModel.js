import { argon2d } from "argon2";
import pool from "../config/db.js";
import argon2 from "argon2";

const Donasi = {
  // Get all donasi
  getAllDonasiforBendahara: async () => {
    const result = await pool.query(`
    SELECT 
      donatur.nama,
      donatur.jenis_donatur,
      donasi.tanggal_donasi,
      donasi.nominal,
      COALESCE(STRING_AGG(doa.nama_doa, ', '), '') AS list_doa,
      donasi.doa_spesific,
      donasi.order_id
    FROM donasi
    JOIN donatur ON donasi.id_donatur = donatur.id_donatur
    LEFT JOIN doa_donasi ON donasi.id_donasi = doa_donasi.id_donasi
    LEFT JOIN doa ON doa_donasi.id_doa = doa.id_doa
    GROUP BY 
      donatur.nama, 
      donatur.jenis_donatur, 
      donasi.tanggal_donasi, 
      donasi.nominal, 
      donasi.doa_spesific,
      donasi.order_id
    ORDER BY donasi.tanggal_donasi DESC;
  `);
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
        [
          id_donatur,
          tanggal_donasi,
          nominal,
          status_donasi,
          doa_spesific,
          order_id,
        ]
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
      console.error("Error inserting donation:", error);
      throw new Error("Failed to create donation");
    }
  },

  // Change the status of donasi (for example, to mark it as 'Done')
  updateStatus: async (id, status_donasi) => {
    const result = await pool.query(
      "UPDATE donasi SET status_donasi = $1, updated_at = NOW() WHERE id_donasi = $2 RETURNING *",
      [status_donasi, id]
    );
    return result.rows[0];
  },

  // Mengambil total donasi berdasarkan rentang tanggal
  getPemasukanByDateRange: async (startDate, endDate) => {
    const result = await pool.query(
      `SELECT 
        donatur.jenis_donatur,
        SUM(donasi.nominal) AS total_nominal
      FROM donasi
      JOIN donatur ON donasi.id_donatur = donatur.id_donatur
      WHERE donasi.tanggal_donasi BETWEEN $1 AND $2
      GROUP BY donatur.jenis_donatur`,
      [startDate, endDate]
    );
    return result.rows;
  },

  // Mengambil total pemasukan donasi sebelum periode yang diberikan
  getPemasukanAwal: async (endDate) => {
    // Ubah endDate menjadi tanggal terakhir bulan sebelumnya (endDate - 1 hari)
    const previousMonthEndDate = new Date(endDate);
    // previousMonthEndDate.setDate(1); // set to first of the current month
    // previousMonthEndDate.setHours(0, 0, 0, 0); // optional: reset time
    // previousMonthEndDate.setDate(0); // go to last day of previous month

    const formattedDate = previousMonthEndDate.toISOString().split("T")[0]; // Format: 'YYYY-MM-DD'
    console.log("Formatted Date for Pemasukan Awal:", formattedDate);
    const result = await pool.query(
      `SELECT SUM(nominal) AS total_nominal
     FROM donasi
     WHERE tanggal_donasi <= $1`,
      [formattedDate]
    );


    return result.rows[0].total_nominal || 0;
  },
};

export default Donasi;
