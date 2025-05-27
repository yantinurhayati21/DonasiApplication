import pool from "../config/db.js";

const Pengajuan = {
  createWithPengeluaran: async (
    id_pengurus,
    tanggal,
    nominal_pengajuan,
    daftar_pengeluaran,
    status_pengajuan,
    approval_from_pimpinan,
    approved_from_bendahara
  ) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Insert data pengajuan dengan status dan approval sesuai input
      const pengajuanRes = await client.query(
        `INSERT INTO pengajuan 
           (id_pengurus, tanggal, nominal_pengajuan, status_pengajuan, approval_from_pimpinan, approved_from_bendahara, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id_pengajuan`,
        [
          id_pengurus,
          tanggal,
          nominal_pengajuan,
          status_pengajuan,
          approval_from_pimpinan,
          approved_from_bendahara,
        ]
      );

      const id_pengajuan = pengajuanRes.rows[0].id_pengajuan;

      // Insert daftar pengeluaran terkait pengajuan tersebut
      for (const item of daftar_pengeluaran) {
        const { nama_item, id_kategori, total_harga } = item;

        await client.query(
          `INSERT INTO pengeluaran 
             (id_pengajuan, nama_item, id_kategori, total_harga, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [id_pengajuan, nama_item, id_kategori, total_harga]
        );
      }

      await client.query("COMMIT");

      return { id_pengajuan };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  getAll: async () => {
    const result = await pool.query(
      "SELECT * FROM pengajuan ORDER BY created_at DESC"
    );
    return result.rows;
  },

  getById: async (id_pengajuan) => {
    const result = await pool.query(
      "SELECT * FROM pengajuan WHERE id_pengajuan = $1",
      [id_pengajuan]
    );
    return result.rows[0];
  },

  getByIdWithDetails: async (id_pengajuan) => {
    const result = await pool.query(
      `SELECT p.*, 
              COALESCE(
                json_agg(
                  json_build_object(
                    'id_pengeluaran', pe.id_pengeluaran,
                    'nama_item', pe.nama_item,
                    'id_kategori', pe.id_kategori,
                    'total_harga', pe.total_harga,
                    'created_at', pe.created_at
                  )
                ) FILTER (WHERE pe.id_pengeluaran IS NOT NULL), '[]'
              ) AS detail_pengeluaran
       FROM pengajuan p
       LEFT JOIN pengeluaran pe ON p.id_pengajuan = pe.id_pengajuan
       WHERE p.id_pengajuan = $1
       GROUP BY p.id_pengajuan`,
      [id_pengajuan]
    );

    return result.rows[0];
  },

  delete: async (id_pengajuan) => {
    await pool.query(
      "DELETE FROM pengajuan WHERE id_pengajuan = $1",
      [id_pengajuan]
    );
  },
};

export default Pengajuan;
