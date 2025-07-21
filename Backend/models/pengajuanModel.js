import pool from "../config/db.js";

const Pengajuan = {
  createWithPengeluaran: async (
    id_user,
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
           (id_user, tanggal, nominal_pengajuan, status_pengajuan, approval_from_pimpinan, approved_from_bendahara, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id_pengajuan`,
        [
          id_user,
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
      "SELECT * FROM pengajuan ORDER BY created_at ASC"
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
                    'created_at', pe.created_at,
                    'total_harga_act', pe.total_harga_act,
                    'nama_item_act', pe.nama_item_act
                  )
                ) FILTER (WHERE pe.id_pengeluaran IS NOT NULL), '[]'
              ) AS detail_pengeluaran
       FROM pengajuan p
       JOIN pengeluaran pe ON p.id_pengajuan = pe.id_pengajuan
       WHERE p.id_pengajuan = $1
       GROUP BY p.id_pengajuan`,
      [id_pengajuan]
    );

    return result.rows[0];
  },
  countByStatus: async (status) => {
    const result = await pool.query(
      "SELECT COUNT(*) FROM pengajuan WHERE status_pengajuan = $1",
      [status]
    );
    return parseInt(result.rows[0].count, 10);
  },

  delete: async (id_pengajuan) => {
    await pool.query("DELETE FROM pengajuan WHERE id_pengajuan = $1", [
      id_pengajuan,
    ]);
  },

  approvalByBendahara: async (id_pengajuan, status) => {
    // Validasi status
    const validStatuses = ["diterima", "ditolak", "menunggu"];
    if (!validStatuses.includes(status)) {
      throw new Error("Status approval bendahara tidak valid");
    }

    let status_pengajuan = "";

    // Logika validasi status
    if (status === "diterima") {
      status_pengajuan = "menunggu_pimpinan"; // Jika diterima, set status pengajuan menjadi 'menunggu_pimpinan'
    } else if (status === "ditolak") {
      status_pengajuan = "ditolak_bendahara"; // Jika ditolak, status pengajuan tetap 'ditolak'
    } else {
      status_pengajuan = "menunggu"; // Status default jika tidak diterima atau ditolak
    }

    try {
      // Update pengajuan dengan status yang sudah disesuaikan
      if (status === "ditolak") {
        await pool.query(
          `UPDATE pengajuan SET approved_from_bendahara = $1, approval_from_pimpinan = $2, status_pengajuan = $3 WHERE id_pengajuan = $4`,
          [status, "ditolak", status_pengajuan, id_pengajuan]
        );
      } else {
        await pool.query(
          `UPDATE pengajuan SET approved_from_bendahara = $1, status_pengajuan = $2 WHERE id_pengajuan = $3`,
          [status, status_pengajuan, id_pengajuan]
        );
      }
    } catch (error) {
      console.error("Error updating pengajuan status:", error);
      throw new Error("Gagal memperbarui status pengajuan");
    }
  },

  approvalByPimpinan: async (id_pengajuan, status) => {
    // Validasi status
    const validStatuses = ["diterima", "ditolak", "menunggu"];
    if (!validStatuses.includes(status)) {
      throw new Error("Status approval pimpinan tidak valid");
    }

    if (status === "diterima") {
      await pool.query(
        `UPDATE pengajuan SET approval_from_pimpinan = $1, status_pengajuan = $2 WHERE id_pengajuan = $3`,
        [status, "diterima", id_pengajuan]
      );
    } else if (status === "ditolak") {
      await pool.query(
        `UPDATE pengajuan SET approval_from_pimpinan = $1, status_pengajuan = $2 WHERE id_pengajuan = $3`,
        [status, "ditolak_pimpinan", id_pengajuan]
      );
    }
  },
  update: async (
    id_pengajuan,
    jumlah_pengeluaran,
    deskripsi,
    file_bukti,
    nama_act,
    harga_act
  ) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Update pengajuan
      const updateQuery = `
        UPDATE pengajuan
        SET pengeluaran_actual = $1, deskripsi = $2, file_bukti = $3, status_bukti_pengeluaran = 'menunggu'
        WHERE id_pengajuan = $4
        RETURNING id_pengajuan
      `;
      const result = await client.query(updateQuery, [
        jumlah_pengeluaran,
        deskripsi,
        file_bukti,
        id_pengajuan,
      ]);

      // Pastikan pengajuan ada
      if (result.rowCount === 0) {
        throw new Error("Pengajuan tidak ditemukan");
      }

      if (nama_act.length > 0) {
        const pengeluaranList = await client.query(
          "SELECT id_pengeluaran FROM pengeluaran WHERE id_pengajuan = $1",
          [id_pengajuan]
        );
        for (let index = 0; index < pengeluaranList.rows.length; index++) {
          try {
            const pengeluaranResult = await client.query(
              "UPDATE pengeluaran SET nama_item_act = $1, total_harga_act = $2 WHERE id_pengeluaran = $3 ",
              [
                nama_act[index],
                harga_act[index],
                pengeluaranList.rows[index].id_pengeluaran,
              ]
            );
            console.log(
              index + " update pengeluaran berhasil ",
              pengeluaranResult
            );
          } catch (err) {
            console.error(index + " update pengeluaran gagal ", err);
          }
        }
      }

      await client.query("COMMIT");

      return result.rows[0]; // Mengembalikan id_pengajuan yang telah diperbarui
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

export default Pengajuan;
