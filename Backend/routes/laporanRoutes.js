// routes/laporanRoutes.js
import express from "express";
import laporanController from "../controllers/laporanController.js";

const router = express.Router();

// Endpoint untuk mendapatkan laporan keuangan
router.get("/keuangan", laporanController.getLaporanKeuangan);

export default router;
