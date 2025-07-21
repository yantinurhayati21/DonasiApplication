import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"; // Ganti dengan URL API Anda

export const getLaporanKeuangan = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/laporan/keuangan`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching laporan keuangan:", error);
    throw error;
  }
};
