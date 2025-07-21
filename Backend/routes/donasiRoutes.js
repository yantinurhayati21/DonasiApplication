import express from "express";
import {
    getAllDonasi,
    getDonasiById,
    createDonasiTetap,
    createDonasiTidakTetap,
    paymentDonasi,
    updateStatusDonasi,
    getAllDonasiforBendahara
} from "../controllers/donasiController.js"; 
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/laporan/bendahara", getAllDonasiforBendahara);


// Route to get all Donatur records
router.get("/", getAllDonasi);

// Route to get a specific Donatur by ID
router.get("/:id", getDonasiById); 

// Route to create a new Donatur (also creates a user in the 'users' table)
router.post("/", verifyToken, createDonasiTetap);

// Route to create a new Donatur (also creates a user in the 'users' table)
router.post("/tidak-tetap", createDonasiTidakTetap);

router.post("/payment", paymentDonasi);

router.put("/:id", updateStatusDonasi);



export default router;
