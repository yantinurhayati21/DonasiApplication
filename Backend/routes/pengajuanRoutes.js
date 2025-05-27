import express from "express";
import {
  createPengajuanWithDetail,
  getAllPengajuan,
  getPengajuanById,
  deletePengajuan,
} from "../controllers/pengajuanController.js";

const router = express.Router();

router.post("/", createPengajuanWithDetail);
router.get("/", getAllPengajuan);
router.get("/:id", getPengajuanById);
router.delete("/:id", deletePengajuan);

export default router;