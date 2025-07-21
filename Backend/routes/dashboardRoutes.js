import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js'; // Correct import path

const router = express.Router();

// Mendefinisikan route untuk dashboard
router.get('/', getDashboardData);

export default router; // Use export default instead of module.exports
