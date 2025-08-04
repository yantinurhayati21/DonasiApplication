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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@mui/material";
import { InfoOutlined, CheckCircleOutline } from "@mui/icons-material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const PengajuanForm = () => {
  const [tanggal, setTanggal] = useState("");
  const [nominalPengajuan, setNominalPengajuan] = useState("");
  const [daftarPengeluaran, setDaftarPengeluaran] = useState([
    { nama_item: "", id_kategori: "", total_harga: "" },
  ]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // State untuk dialog konfirmasi dan sukses
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

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

  // Hitung otomatis nominalPengajuan setiap kali daftarPengeluaran berubah
  useEffect(() => {
    const total = daftarPengeluaran.reduce((sum, item) => {
      const harga = Number(item.total_harga);
      return sum + (isNaN(harga) ? 0 : harga);
    }, 0);
    setNominalPengajuan(total);
  }, [daftarPengeluaran]);

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

  // Handler untuk tombol submit: buka dialog konfirmasi
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setOpenConfirm(true);
  };

  // Handler untuk konfirmasi submit
  const handleConfirmSubmit = async () => {
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
      setOpenConfirm(false);
      setOpenSuccess(true);
    } catch (error) {
      setError("Terjadi kesalahan saat membuat pengajuan");
      setOpenConfirm(false);
      console.error(error);
    }
  };

  // Handler untuk tutup dialog sukses
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    setSuccessMsg("");
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card sx={{ p: 3, boxShadow: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#3f51b5", fontWeight: "bold" }}>
            Form Pembuatan Pengajuan
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                  Tanggal Pengajuan
                </Typography>
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
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                  Nominal Pengajuan
                </Typography>
                <TextField
                  label="Nominal Pengajuan"
                  type="number"
                  fullWidth
                  value={nominalPengajuan}
                  InputProps={{ readOnly: true }}
                  required
                  sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
                  helperText="Nominal otomatis dijumlahkan dari seluruh total harga item pengeluaran"
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
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                      Nama Item
                    </Typography>
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
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                      Kategori
                    </Typography>
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
                        sx={{
                          padding: "10px 12px",
                          fontSize: "1rem",
                          backgroundColor: "#f4f4f9",
                          borderRadius: "8px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          "& .MuiSelect-icon": {
                            fontSize: "2rem",
                          },
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
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
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                      Total Harga
                    </Typography>
                    <TextField
                      label="Total Harga"
                      type="number"
                      value={item.total_harga}
                      onChange={(e) =>
                        handlePengeluaranChange(index, "total_harga", e.target.value)
                      }
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
            {/* Dialog Konfirmasi Sebelum Submit */}
            <Dialog
              open={openConfirm}
              onClose={() => setOpenConfirm(false)}
              TransitionComponent={Slide}
              keepMounted
            >
              <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#ff9800" }}>
                <InfoOutlined sx={{ fontSize: 32, color: "#ff9800" }} />
                Konfirmasi Pengajuan
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1" sx={{ mb: 2, color: "#333", fontWeight: "500" }}>
                  Pengajuan yang sudah dibuat{" "}
                  <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                    tidak bisa diubah atau dihapus
                  </span>
                  .<br />
                  Apakah Anda yakin ingin mengirim pengajuan ini?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenConfirm(false)} color="secondary" variant="outlined">
                  Batal
                </Button>
                <Button onClick={handleConfirmSubmit} color="primary" variant="contained">
                  Ya, Kirim
                </Button>
              </DialogActions>
            </Dialog>

            {/* Dialog Sukses Setelah Submit */}
            <Dialog
              open={openSuccess}
              onClose={handleCloseSuccess}
              TransitionComponent={Slide}
              keepMounted
            >
              <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#4caf50" }}>
                <CheckCircleOutline sx={{ fontSize: 32, color: "#4caf50" }} />
                Pengajuan Berhasil
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1" sx={{ mb: 2, color: "#333", fontWeight: "500" }}>
                  {successMsg || "Pengajuan berhasil dibuat."}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseSuccess} color="primary" variant="contained">
                  Tutup
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default PengajuanForm;
