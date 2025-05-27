import express from "express";
import {
  getAllDonatur,
  getDonaturById,
  createDonatur,
  updateDonatur,
  deleteDonatur
} from "../controllers/donaturController.js"; 

const router = express.Router();

// Route to get all Donatur records
router.get("/", getAllDonatur);

// Route to get a specific Donatur by ID
router.get("/:id", getDonaturById);

// Route to create a new Donatur (also creates a user in the 'users' table)
router.post("/", createDonatur);

// Route to update an existing Donatur (also updates the corresponding user in the 'users' table)
router.put("/:id", updateDonatur);

// Route to delete a Donatur (also deletes the associated user due to the foreign key constraint)
router.delete("/:id", deleteDonatur);

export default router;
