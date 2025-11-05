import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  IconButton,
  TextField,
  TablePagination,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DaftarKategori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState(""); // Filter by Name / Content
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [kategoriName, setKategoriName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedKategoriId, setSelectedKategoriId] = useState(null);

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = () => {
    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:3000/api/kategori")
      .then(({ data }) => {
        // NORMALISASI: ambil array dari data.data (atau langsung data jika backend nanti ubah ke array)
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

        setKategoriList(list);
        setFilteredData(list);
        console.log("Kategori fetched (normalized):", list);
      })
      .catch((err) => {
        setError(err.message || "Gagal memuat data");
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = () => {
    setFilteredData([]);

    const filteredDataWithSearch = kategoriList.filter((kategori) => {
      return kategori.nama_kategori.toLowerCase().includes(filterText.toLowerCase());
    });

    setFilteredData(filteredDataWithSearch);
  };

  const handleClearFilters = () => {
    setFilterText("");
    setFilteredData(kategoriList); // tetap dalam kategori yang sama
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (kategori = null) => {
    if (kategori) {
      setSelectedKategori(kategori);
      setKategoriName(kategori.nama_kategori);
    } else {
      setSelectedKategori(null);
      setKategoriName("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setKategoriName("");
  };

  const handleSaveKategori = async () => {
    if (!kategoriName) {
      alert("Nama Kategori wajib diisi!");
      return;
    }

    if (selectedKategori) {
      try {
        // UPDATE
        const response = await axios.put(
          `http://localhost:3000/api/kategori/${selectedKategori.id_kategori}`,
          {
            nama_kategori: kategoriName,
          }
        );
        const updated = kategoriList.map((kategori) =>
          kategori.id_kategori === selectedKategori.id_kategori
            ? { ...kategori, nama_kategori: kategoriName }
            : kategori
        );
        setKategoriList(updated);
        setFilteredData(updated);
        setOpenDialog(false);
      } catch (error) {
        console.error("Error updating kategori:", error);
        alert("Terjadi kesalahan saat memperbarui data.");
      }
    } else {
      try {
        const respons = await axios.post("http://localhost:3000/api/kategori", {
          nama_kategori: kategoriName,
        });
        setKategoriList([...kategoriList, respons.data]);
        setFilteredData([...kategoriList, respons.data]);
        setOpenDialog(false);
      } catch (error) {
        console.error("Error saving kategori:", error);
        alert("Terjadi kesalahan saat menyimpan data.");
      }
    }
  };

  const handleDeleteDialogOpen = (kategoriId) => {
    setSelectedKategoriId(kategoriId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedKategoriId(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/kategori/${selectedKategoriId}`);
      const updated = kategoriList.filter((d) => d.id_kategori !== selectedKategoriId);
      setKategoriList(updated);
      setFilteredData(updated);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting kategori:", error);
      alert("Terjadi kesalahan saat menghapus kategori.");
    }
  };

  // ---- UI / Layout: TIDAK DIUBAH ----
  return (
    <DashboardLayout>
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
          <Grid item xs={12} sm={8} md={9}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 2 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", minWidth: "110px", whiteSpace: "nowrap" }}
              >
                Nama Kategori
              </Typography>
              <TextField
                label="Masukkan Nama Kategori"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                sx={{ maxWidth: 350, flex: 1 }}
              />
            </Box>
          </Grid>

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
                Tambah Kategori
              </Button>
            </Box>
          </Grid>
        </Grid>

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
                "&:hover": { backgroundColor: "#64b5f6" },
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
                "&:hover": { borderColor: "#666" },
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
            <MDBox sx={{ flex: 6.5, padding: "8px 30px" }}>Nama Kategori</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Aksi</MDBox>
          </MDBox>

          {filteredData.length > 0 ? (
            filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((kategori, index) => {
                const globalIndex = page * rowsPerPage + index;
                return (
                  <MDBox
                    key={kategori.id_kategori}
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
                    <MDBox sx={{ flex: 3.5, padding: "8px 16px" }}>{kategori.nama_kategori}</MDBox>
                    <MDBox
                      sx={{
                        flex: 1,
                        padding: "8px 16px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(kategori)}
                        sx={{ marginRight: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteDialogOpen(kategori.id_kategori)}
                      >
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
                Tidak ada data kategori yang ditemukan.
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
            borderBottom: "2px solid #f1f1f1",
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
            backgroundColor: "#f9f9f9",
          }}
        >
          <p style={{ marginTop: "6px" }}>Apakah Anda yakin ingin menghapus kategori ini?</p>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px",
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
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
              "&:hover": { backgroundColor: "#303f9f", color: "#fff" },
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
              borderRadius: "8px",
              fontWeight: "600",
              borderColor: "#ff4081",
              color: "#ff4081",
              textTransform: "none",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": { backgroundColor: "#ff4081", color: "#fff" },
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
          {selectedKategori ? "Edit Kategori" : "Tambah Kategori"}
        </DialogTitle>

        <DialogContent sx={{ padding: "24px", backgroundColor: "#f9f9f9" }}>
          <TextField
            label="Nama Kategori"
            fullWidth
            value={kategoriName}
            onChange={(e) => setKategoriName(e.target.value)}
            margin="dense"
            required
            sx={{
              mb: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              "& .MuiInputBase-root": { borderRadius: 2 },
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
              "&:hover": { backgroundColor: "#ff5c8d" },
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleSaveKategori}
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
              "&:hover": { backgroundColor: "#64b5f6" },
            }}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default DaftarKategori;
