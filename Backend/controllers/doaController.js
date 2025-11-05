import Doa from "../models/doaModel.js";

export const getAllDoa = async (req, res) => {
  try {
    const doa = await Doa.getAll();
    res.json(doa);
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
};

export const getDoaById = async (req, res) => {
  try {
    const doa = await Doa.getById(req.params.id);
    if (!doa) return res.status(404).json({ message: "Doa not found" });
    res.json(doa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDoa = async (req, res) => {
  try {
    const { nama_doa, isi_doa } = req.body;
    const newDoa = await Doa.create(nama_doa, isi_doa);
    res.status(201).json(newDoa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDoa = async (req, res) => {
  try {
    const { nama_doa, isi_doa } = req.body;
    const updatedDoa = await Doa.update(req.params.id, nama_doa, isi_doa);
    res.json(updatedDoa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDoa = async (req, res) => {
  try {
    await Doa.delete(req.params.id);
    res.json({ message: "Doa deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
