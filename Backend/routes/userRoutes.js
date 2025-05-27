import express from "express";
import {
  getAllUsers,
  getBendahara,
  getPimpinan,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/bendahara", getBendahara);
router.get("/pimpinan", getPimpinan);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);

export default router;
