import express from "express";
import path from "path";
import url from "url";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import doaRoutes from "./routes/doaRoutes.js";
import donaturRoutes from "./routes/donaturRoutes.js";
import donasiRoutes from "./routes/donasiRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import pengajuanRoutes from "./routes/pengajuanRoutes.js";
import kategoriRoutes from "./routes/kategoriRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"; // Corrected import path
import laporanRoutes from "./routes/laporanRoutes.js"; // Import laporan routes

dotenv.config();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Izinkan frontend dari localhost:3001
    methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"], // Izinkan metode GET dan POST
    allowedHeaders: ["Content-Type"], // Header yang diizinkan
  }
});
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Emit event ke frontend saat pengajuan dibuat
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  // socket.on("disconnect", () => {
  //   console.log("A user disconnected");
  // });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/doa", doaRoutes);
app.use("/api/donatur", donaturRoutes);
app.use("/api/donasi", donasiRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/pengajuan", pengajuanRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/laporan", laporanRoutes); // Use laporan routes


// Menjalankan server
server.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});

export { io };
