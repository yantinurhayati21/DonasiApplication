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
export const getDataKategori = async (req, res) => {
  try {
    const kategori = await Kategori.getAllKategori();
    res.json(kategori);
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
};

export const getKategoriById = async (req, res) => {
  try {
    const data = await Kategori.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Kategori not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createKategori = async (req, res) => {
  try {
    const { nama_kategori } = req.body;
    const created = await Kategori.create(nama_kategori);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateKategori = async (req, res) => {
  try {
    const { nama_kategori } = req.body;
    const updated = await Kategori.update(req.params.id, nama_kategori);
    if (!updated) return res.status(404).json({ message: "Kategori not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteKategori = async (req, res) => {
  try {
    await Kategori.delete(req.params.id);
    res.json({ message: "Kategori deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getAllKategori };
