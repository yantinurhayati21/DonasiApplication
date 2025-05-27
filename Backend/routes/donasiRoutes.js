import express from "express";
import {
    getAllDonasi,
    getDonasiById,
    createDonasi,
    paymentDonasi
} from "../controllers/donasiController.js"; 
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Route to get all Donatur records
router.get("/", getAllDonasi);

// Route to get a specific Donatur by ID
router.get("/:id", getDonasiById);

// Route to create a new Donatur (also creates a user in the 'users' table)
router.post("/", createDonasi);

router.post("/payment", paymentDonasi);


export default router;
