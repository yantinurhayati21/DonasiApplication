import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  IconButton,
  TextField,
  TablePagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DaftarDoa() {
  const [doaList, setDoaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState(""); // Filter by Name
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // Add/Edit dialog open state
  const [selectedDoa, setSelectedDoa] = useState(null); // To hold the data for editing
  const [doaName, setDoaName] = useState(""); // Store doa name for add/edit
  const [doaContent, setDoaContent] = useState(""); // Store doa content for add/edit
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State untuk membuka dialog konfirmasi
  const [selectedDoaId, setSelectedDoaId] = useState(null); // Menyimpan ID doa yang akan dihapus

  useEffect(() => {
    fetchDoa();
  }, []);

  const fetchDoa = () => {
    axios
      .get("http://localhost:3000/api/doa")
      .then((response) => {
        setDoaList(response.data);
        setFilteredData(response.data); // Initially, show all data
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setFilteredData([]);

    const filteredDataWithSearch = doaList.filter((doa) => {
      return (
        doa.nama_doa.toLowerCase().includes(filterText.toLowerCase()) ||
        doa.isi_doa.toLowerCase().includes(filterText.toLowerCase())
      );
    });

    setFilteredData(filteredDataWithSearch);
  };

  const handleClearFilters = () => {
    setFilterText("");
    setFilteredData(doaList); // Reset to original data
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Open Dialog for Add/Edit
  const handleOpenDialog = (doa = null) => {
    if (doa) {
      // Editing mode
      setSelectedDoa(doa);
      setDoaName(doa.nama_doa);
      setDoaContent(doa.isi_doa);
    } else {
      // Add mode
      setSelectedDoa(null);
      setDoaName("");
      setDoaContent("");
    }
    setOpenDialog(true);
  };

  // Handle Close Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDoaName("");
    setDoaContent("");
  };

  // Handle Save (Add/Edit)
  const handleSaveDoa = async () => {
    if (!doaName || !doaContent) {
      alert("Nama Doa dan Isi Doa wajib diisi!");
      return; // Hentikan proses penyimpanan jika ada yang kosong
    }

    if (selectedDoa) {
      // Edit existing doa
      try {
        const response = await axios.put(`http://localhost:3000/api/doa/${selectedDoa.id_doa}`, {
          nama_doa: doaName,
          isi_doa: doaContent,
        });
        const updatedDoaList = doaList.map((doa) =>
          doa.id_doa === selectedDoa.id_doa
            ? { ...doa, nama_doa: doaName, isi_doa: doaContent }
            : doa
        );
        setDoaList(updatedDoaList);
        setFilteredData(updatedDoaList);
        setOpenDialog(false);
      } catch (error) {
        console.error("Error updating doa:", error);
        alert("Terjadi kesalahan saat mengedit doa.");
      }
    } else {
      // Add new doa
      try {
        const response = await axios.post("http://localhost:3000/api/doa", {
          nama_doa: doaName,
          isi_doa: doaContent,
        });
        setDoaList([...doaList, response.data]);
        setFilteredData([...doaList, response.data]);
        setOpenDialog(false);
      } catch (error) {
        console.error("Error adding doa:", error);
        alert("Terjadi kesalahan saat menambah doa.");
      }
    }
  };

  // Fungsi untuk membuka dialog konfirmasi delete
  const handleDeleteDialogOpen = (doaId) => {
    setSelectedDoaId(doaId); // Set ID doa yang dipilih
    setOpenDeleteDialog(true); // Buka dialog konfirmasi
  };

  // Fungsi untuk menutup dialog konfirmasi
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Menutup dialog
    setSelectedDoaId(null); // Reset ID doa
  };

  // Fungsi untuk menghapus doa
  const handleDeleteConfirm = async () => {
    try {
      // Menggunakan selectedDoaId untuk ID doa yang akan dihapus
      await axios.delete(`http://localhost:3000/api/doa/${selectedDoaId}`);

      // Menghapus doa dari daftar setelah berhasil
      const updatedDoaList = doaList.filter((doa) => doa.id_doa !== selectedDoaId);

      // Update state setelah penghapusan
      setDoaList(updatedDoaList);
      setFilteredData(updatedDoaList);

      // Menutup dialog setelah penghapusan
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting doa:", error);
      alert("Terjadi kesalahan saat menghapus doa.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        pt={3}
        px={3}
        lineHeight={1.25}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#f5f5f5"
        borderRadius={2}
        p={2}
        boxShadow={3}
      ></MDBox>

      <Card
        sx={{
          padding: 4,
          marginTop: 2,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "#ffffff",
          marginBottom: 4,
        }}
      >
        <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
          {/* Filter: Nama Doa */}
          <Grid item xs={12} sm={8} md={9}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 2 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", minWidth: "110px", whiteSpace: "nowrap" }}
              >
                Nama Doa
              </Typography>
              <TextField
                label="Masukkan Nama Doa"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                sx={{ maxWidth: 350, flex: 1 }}
              />
            </Box>
          </Grid>

          {/* Button Add Doa */}
          <Grid item xs={12} sm={4} md={3}>
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#64b5f6",
                  color: "#fff",
                  padding: "12px 36px",
                  minWidth: 140,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  textTransform: "none",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#64b5f6",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                  },
                  "&:active": {
                    backgroundColor: "#303f9f",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                  },
                }}
                startIcon={<AddIcon sx={{ color: "#ffffff" }} />}
                onClick={() => handleOpenDialog(null)}
              >
                Tambah Doa
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Tombol Search dan Clear */}
        <Grid container spacing={2} sx={{ pl: { xs: 0, sm: 2 }, mt: 1, mb: 3 }}>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#90caf9",
                color: "#fff",
                padding: "10px 32px",
                minWidth: 140,
                fontSize: "0.95rem",
                fontWeight: "bold",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#64b5f6",
                },
              }}
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                padding: "10px 32px",
                minWidth: 140,
                fontSize: "0.95rem",
                fontWeight: "bold",
                borderRadius: "8px",
                textTransform: "none",
                color: "#666",
                borderColor: "#aaa",
                "&:hover": {
                  borderColor: "#666",
                },
              }}
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        {loading && (
          <MDTypography variant="h6" color="textSecondary">
            Loading...
          </MDTypography>
        )}
        {error && (
          <MDTypography variant="h6" color="error">
            Terjadi kesalahan: {error}
          </MDTypography>
        )}

        <MDBox
          component="div"
          sx={{ overflowX: "auto", marginBottom: 3, overflowY: "auto", maxHeight: "600px" }}
        >
          <MDBox
            component="div"
            sx={{
              display: "flex",
              backgroundColor: "#f1f1f1",
              padding: "12px",
              borderRadius: 1,
              fontWeight: "bold",
              color: "#3f51b5",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <MDBox sx={{ flex: 0.5, padding: "8px 16px" }}>No</MDBox>
            <MDBox sx={{ flex: 2, padding: "8px 16px" }}>Nama Doa</MDBox>
            <MDBox sx={{ flex: 5.3, padding: "8px 16px" }}>Isi Doa</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Aksi</MDBox>
          </MDBox>

          {filteredData.length > 0 ? (
            filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((doa, index) => {
                const globalIndex = page * rowsPerPage + index;
                return (
                  <MDBox
                    key={doa.id_doa}
                    component="div"
                    sx={{
                      display: "flex",
                      padding: "12px 16px",
                      backgroundColor: globalIndex % 2 === 0 ? "#f9f9f9" : "#fff",
                      borderRadius: 1,
                      boxShadow: 1,
                      marginBottom: 1,
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <MDBox sx={{ flex: 0.5 }}>{index + 1}</MDBox>
                    <MDBox sx={{ flex: 1.5, padding: "8px 16px" }}>{doa.nama_doa}</MDBox>
                    <MDBox sx={{ flex: 3.5, padding: "8px 16px" }}>{doa.isi_doa}</MDBox>
                    <MDBox
                      sx={{
                        flex: 1,
                        padding: "8px 16px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {/* Icon for Edit */}
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(doa)}
                        sx={{ marginRight: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteDialogOpen(doa.id_doa)}>
                        <DeleteIcon />
                      </IconButton>
                    </MDBox>
                  </MDBox>
                );
              })
          ) : (
            <MDBox
              component="div"
              sx={{ display: "flex", padding: "12px 16px", justifyContent: "center" }}
            >
              <MDTypography variant="body2" color="text.secondary">
                Tidak ada data doa
              </MDTypography>
            </MDBox>
          )}
        </MDBox>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        sx={{ borderRadius: "8px", overflow: "hidden" }}
      >
        <DialogTitle
          sx={{
            textAlign: "left",
            color: "#333",
            fontSize: "1.25rem",
            fontWeight: "bold",
            paddingBottom: 1,
            borderBottom: "2px solid #f1f1f1", // Garis pemisah
          }}
        >
          Konfirmasi Hapus
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "24px",
            color: "#333",
            fontSize: "1rem",
            lineHeight: 1.5,
            backgroundColor: "#f9f9f9", // Warna latar belakang lebih terang
          }}
        >
          <p style={{ marginTop: "6px" }}>Apakah Anda yakin ingin menghapus doa ini?</p>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px",
            backgroundColor: "#f5f5f5", // Latar belakang tombol dialog lebih terang
            display: "flex",
            justifyContent: "space-between", // Menjaga tombol 'Tidak' dan 'Ya' terpisah
          }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
            color="secondary"
            variant="outlined"
            sx={{
              padding: "12px 32px",
              minWidth: 100,
              fontSize: "0.95rem",
              fontWeight: "600",
              borderRadius: "8px",
              color: "#303f9f",
              borderColor: "#303f9f",
              textTransform: "none",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#303f9f",
                color: "#fff",
              },
            }}
          >
            Tidak
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="secondary"
            variant="outlined"
            sx={{
              padding: "12px 32px",
              minWidth: 100,
              borderRadius: "8px", // Lebih bulat
              fontWeight: "600",
              borderColor: "#ff4081",
              color: "#ff4081",
              textTransform: "none",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#ff4081", // Warna latar belakang saat hover
                color: "#fff",
              },
            }}
          >
            Ya
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle
          variant="h5"
          fontWeight="bold"
          textAlign="left"
          sx={{ color: "#333", fontSize: "1.25rem", paddingBottom: 2 }}
        >
          {selectedDoa ? "Edit Doa" : "Tambah Doa"}
        </DialogTitle>

        <DialogContent sx={{ padding: "24px", backgroundColor: "#f9f9f9" }}>
          {/* Nama Doa */}
          <TextField
            label="Nama Doa"
            fullWidth
            value={doaName}
            onChange={(e) => setDoaName(e.target.value)}
            margin="dense"
            required
            sx={{
              mb: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              "& .MuiInputBase-root": {
                borderRadius: 2,
              },
            }}
          />

          {/* Isi Doa */}
          <TextField
            label="Isi Doa"
            fullWidth
            multiline
            rows={4}
            value={doaContent}
            onChange={(e) => setDoaContent(e.target.value)}
            margin="dense"
            required
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              "& .MuiInputBase-root": {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
            backgroundColor: "#f1f1f1",
          }}
        >
          {/* Tombol Batal (kiri) */}
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: "#f73378",
              color: "#fff",
              padding: "10px 32px",
              minWidth: 150,
              fontSize: "0.95rem",
              fontWeight: "bold",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#ff5c8d",
              },
            }}
          >
            Batal
          </Button>

          {/* Tombol Simpan (kanan) */}
          <Button
            onClick={handleSaveDoa}
            color="primary"
            variant="contained"
            sx={{
              backgroundColor: "#303f9f",
              color: "#fff",
              padding: "10px 32px",
              minWidth: 150,
              fontSize: "0.95rem",
              fontWeight: "bold",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#64b5f6",
              },
            }}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}

export default DaftarDoa;
