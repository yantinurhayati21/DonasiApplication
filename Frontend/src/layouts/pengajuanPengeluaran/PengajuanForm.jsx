import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import axios from "axios";

const PengajuanForm = () => {
  const [tanggal, setTanggal] = useState("");
  const [nominalPengajuan, setNominalPengajuan] = useState("");
  const [daftarPengeluaran, setDaftarPengeluaran] = useState([
    { nama_item: "", id_kategori: "", total_harga: "" },
  ]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Ambil data kategori dari API saat komponen mount
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/kategori");
        setKategoriOptions(response.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data kategori:", err);
      }
    };
    fetchKategori();
  }, []);

  const handlePengeluaranChange = (index, field, value) => {
    const list = [...daftarPengeluaran];
    list[index][field] = value;
    setDaftarPengeluaran(list);
  };

  const handleAddRow = () => {
    setDaftarPengeluaran([
      ...daftarPengeluaran,
      { nama_item: "", id_kategori: "", total_harga: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    const list = [...daftarPengeluaran];
    list.splice(index, 1);
    setDaftarPengeluaran(list);
  };

  const validateForm = () => {
    if (!tanggal) {
      setError("Tanggal pengajuan wajib diisi");
      return false;
    }
    if (!nominalPengajuan || Number(nominalPengajuan) <= 0) {
      setError("Nominal pengajuan harus lebih dari 0");
      return false;
    }
    for (const item of daftarPengeluaran) {
      if (
        !item.nama_item ||
        !item.id_kategori ||
        !item.total_harga ||
        Number(item.total_harga) <= 0
      ) {
        setError("Semua kolom detail pengeluaran harus diisi dengan benar");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        id_pengurus: 1, // Contoh statis, sesuaikan dengan user login Anda
        tanggal,
        nominal_pengajuan: Number(nominalPengajuan),
        daftar_pengeluaran: daftarPengeluaran.map((item) => ({
          nama_item: item.nama_item,
          id_kategori: Number(item.id_kategori),
          total_harga: Number(item.total_harga),
        })),
      };

      const response = await axios.post("http://localhost:3000/api/pengajuan", payload);

      setSuccessMsg("Pengajuan berhasil dibuat dengan ID: " + response.data.data.id_pengajuan);
      setTanggal("");
      setNominalPengajuan("");
      setDaftarPengeluaran([{ nama_item: "", id_kategori: "", total_harga: "" }]);
    } catch (error) {
      setError("Terjadi kesalahan saat membuat pengajuan");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Form Pembuatan Pengajuan
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tanggal Pengajuan"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nominal Pengajuan"
              type="number"
              fullWidth
              value={nominalPengajuan}
              onChange={(e) => setNominalPengajuan(e.target.value)}
              required
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Daftar Pengeluaran
        </Typography>

        {daftarPengeluaran.map((item, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Nama Item"
                  value={item.nama_item}
                  onChange={(e) => handlePengeluaranChange(index, "nama_item", e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel id={`kategori-label-${index}`}>Kategori</InputLabel>
                  <Select
                    labelId={`kategori-label-${index}`}
                    value={item.id_kategori}
                    label="Kategori"
                    onChange={(e) => handlePengeluaranChange(index, "id_kategori", e.target.value)}
                  >
                    {kategoriOptions.map((kategori) => (
                      <MenuItem key={kategori.id_kategori} value={kategori.id_kategori}>
                        {kategori.nama_kategori}
                      </MenuItem>
                    ))}
                  </Select>
                  {!item.id_kategori && <FormHelperText error>Pilih kategori</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Total Harga"
                  type="number"
                  value={item.total_harga}
                  onChange={(e) => handlePengeluaranChange(index, "total_harga", e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                {daftarPengeluaran.length > 1 && (
                  <IconButton color="error" onClick={() => handleRemoveRow(index)}>
                    <RemoveCircleOutline />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Box sx={{ mb: 3 }}>
          <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={handleAddRow}>
            Tambah Item
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {successMsg && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {successMsg}
          </Typography>
        )}

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Kirim Pengajuan
        </Button>
      </form>
    </Container>
  );
};

export default PengajuanForm;
