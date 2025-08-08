import express from "express";
import {
  getAllDonatur,
  getByUserId,
  createDonatur,
  updateDonatur,
  updateDonaturStatus,
  sendReminderToAllDonaturTetap
} from "../controllers/donaturController.js"; 

const router = express.Router();

// Route to get all Donatur records
router.get("/", getAllDonatur);

// Route to get a specific Donatur by ID
router.get("/:id", getByUserId);

// Route to create a new Donatur (also creates a user in the 'users' table)
router.post("/register", createDonatur);

// Route to update a Donatur by ID
router.put("/:id", updateDonatur);

// Route to update the status of a Donatur
router.patch("/status/:id", updateDonaturStatus);

router.post("/sendReminderAll", sendReminderToAllDonaturTetap);


export default router;
