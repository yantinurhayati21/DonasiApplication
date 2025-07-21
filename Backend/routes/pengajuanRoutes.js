import express from "express";
import {
  createPengajuanWithDetail,
  loginBendahara,
  getAllPengajuan,
  getPengajuanById,
  getJumlahPengajuanMenungguBendahara,
  deletePengajuan,
  approvalfromBendahara,
  approvalfromPimpinan,
  getNotifications,
  updatePengajuan,
  uploadFile
} from "../controllers/pengajuanController.js";

const router = express.Router();

router.post("/", createPengajuanWithDetail);
router.post("/login-bendahara", loginBendahara);
router.get("/", getAllPengajuan);
router.get("/notifikasi", getNotifications);
router.get("/:id", getPengajuanById);
router.get("/jumlah-menunggu-bendahara", getJumlahPengajuanMenungguBendahara);
router.delete("/:id", deletePengajuan);
router.put("/bendahara/:id", approvalfromBendahara);
router.put("/pimpinan/:id", approvalfromPimpinan);
router.put("/:id", uploadFile,updatePengajuan);

export default router;