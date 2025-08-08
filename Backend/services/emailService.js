import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Membuat transporter dengan menggunakan konfigurasi Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Ambil email pengirim dari variabel lingkungan
    pass: process.env.EMAIL_PASS,  // Ambil password dari variabel lingkungan
  },
});

// Fungsi untuk mengirim email
const sendEmail = (recipientEmail, subject, text) => {
  // Mengatur opsi email yang akan dikirim
  const mailOptions = {
    from: process.env.EMAIL_USER, // Email pengirim
    to: recipientEmail, // Email penerima
    subject: subject, // Subjek email
    text: text, // Isi email
  };

  // Mengirim email menggunakan transporter
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); // Menampilkan error jika gagal mengirim
    } else {
      console.log('Email sent: ' + info.response); // Menampilkan pesan sukses jika email terkirim
    }
  });
};

export default sendEmail;
