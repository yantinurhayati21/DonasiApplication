import express from "express";
import { getAllDoa, getDoaById, createDoa, updateDoa, deleteDoa } from "../controllers/doaController.js"; // Pastikan doaController.js ada dan memiliki ekspor yang sesuai
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllDoa);
router.get("/:id", getDoaById);
router.post("/", createDoa);
router.put("/:id", updateDoa);
router.delete("/:id", deleteDoa);

export default router; 
