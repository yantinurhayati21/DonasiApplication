import pool from "../config/db.js";

// Fungsi untuk membuat notifikasi
const createNotification = async (id_user, message, ref_id) => {
  const query = `INSERT INTO notifications (id_user, message, ref_id) VALUES ($1, $2, $3)`;
  try {
    await pool.query(query, [id_user, message, ref_id]);
  } catch (error) {
    console.error("Error inserting notification:", error);
    throw new Error("Failed to create notification");
  }
};

const getNotificationsByUserId = async (id_user) => {
  const query = `
    SELECT * FROM notifications 
    WHERE id_user = $1 AND status = 'unread'
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [id_user]);
  return result.rows;
};

const updateNotificationsToRead = async (id_pengajuan, id_user) => {
  const query = `
    UPDATE notifications 
    SET status = 'read' 
    WHERE id_user = $1 AND ref_id = $2 AND status = 'unread'
  `;
  try {
    const result = await pool.query(query, [id_user, id_pengajuan]);
    console.log(`${result.rowCount} notification(s) updated to 'read'`);  // Debug log
  } catch (error) {
    console.error("Error updating notifications:", error);
  }
};

const getAllNotification = async () => {
  const query = `
    SELECT * FROM notifications
  `;
  const result = await pool.query(query);
  return result.rows;
};

export default {
  getAllNotification,
  createNotification,
  getNotificationsByUserId,
  updateNotificationsToRead,
};
