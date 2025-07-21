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
  Card,
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
        id_user: 1,
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
      <Card sx={{ p: 3, boxShadow: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#3f51b5", fontWeight: "bold" }}>
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
                sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
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
                sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5", fontWeight: "bold" }}>
            Daftar Pengeluaran
          </Typography>

          {daftarPengeluaran.map((item, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 3, mb: 2, boxShadow: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Nama Item"
                    value={item.nama_item}
                    onChange={(e) => handlePengeluaranChange(index, "nama_item", e.target.value)}
                    fullWidth
                    required
                    sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    required
                    sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
                  >
                    <InputLabel id={`kategori-label-${index}`}>Kategori</InputLabel>
                    <Select
                      labelId={`kategori-label-${index}`}
                      value={item.id_kategori}
                      label="Kategori"
                      onChange={(e) =>
                        handlePengeluaranChange(index, "id_kategori", e.target.value)
                      }
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
                    sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
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
            <Button
              variant="outlined"
              startIcon={<AddCircleOutline />}
              onClick={handleAddRow}
              sx={{
                color: "#3f51b5",
                border: "2px solid #3f51b5",
                "&:hover": {
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                },
              }}
            >
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

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              padding: "12px",
              fontWeight: "bold",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            Kirim Pengajuan
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default PengajuanForm;
