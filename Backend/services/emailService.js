import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Membuat transporter dengan menggunakan konfigurasi Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Ambil email pengirim dari variabel lingkungan
    pass: process.env.EMAIL_PASS, // Ambil password dari variabel lingkungan
  },
});

// Fungsi untuk mengirim email dalam format HTML
const sendEmail = (recipientEmail, subject, htmlContent) => {
  // Mengatur opsi email yang akan dikirim
  const mailOptions = {
    from: process.env.EMAIL_USER, // Email pengirim
    to: recipientEmail,           // Email penerima
    subject: subject,             // Subjek email
    html: htmlContent,            // Konten email dalam format HTML
  };

  // Mengirim email menggunakan transporter
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error); // Menangani error pengiriman email
      }
      resolve(info); // Jika email terkirim, return info
    });
  });
};

export default sendEmail;
