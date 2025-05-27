import Kategori from "../models/kategoriModel.js";

const getAllKategori = async (req, res) => {
  try {
    const data = await Kategori.getAll();
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error fetching kategori:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data kategori",
    });
  }
};

export { getAllKategori };
