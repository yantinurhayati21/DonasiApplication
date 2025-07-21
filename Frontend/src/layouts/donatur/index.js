import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  IconButton,
  TextField,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import select from "assets/theme/components/form/select";

function Donatur() {
  const [donaturList, setDonaturList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState(""); // Filter by Name
  const [selectedJenisDonatur, setSelectedJenisDonatur] = useState(""); // Filter by Jenis Donatur
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedDonaturIdForDelete, setSelectedDonaturIdForDelete] = useState(null);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchDonatur();
  }, []);

  const fetchDonatur = () => {
    axios
      .get("http://localhost:3000/api/donatur")
      .then((response) => {
        setDonaturList(response.data);
        setFilteredData(response.data); // Initially, show all data
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleOpenConfirmDialog = (id) => {
    setSelectedDonaturIdForDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedDonaturIdForDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedDonaturIdForDelete) {
      alert("ID Donatur tidak valid!");
      return;
    }

    const id = parseInt(selectedDonaturIdForDelete, 10);

    if (isNaN(id)) {
      alert("ID Donatur harus berupa angka!");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/api/donatur/${id}`);
      setDonaturList(donaturList.filter((donatur) => donatur.id_donatur !== id));
      handleCloseConfirmDialog(); // Close dialog after deletion
    } catch (error) {
      console.error("Error deleting donatur:", error);
      alert("Terjadi kesalahan saat menghapus donatur.");
    }
  };

  const handleSearch = () => {
    setFilteredData([]);
    const filteredDataWithSearch = donaturList.filter((donatur) => {
      const matchesName = donatur.nama.toLowerCase().includes(filterText.toLowerCase());
      const matchesJenisDonatur =
        !selectedJenisDonatur || donatur.jenis_donatur === selectedJenisDonatur;

      return matchesName && matchesJenisDonatur;
    });
    console.log(filteredDataWithSearch);
    setFilteredData(filteredDataWithSearch);
  };

  const handleClearFilters = () => {
    setFilterText("");
    setSelectedJenisDonatur("");
    setFilteredData([]);
    setFilteredData(donaturList); // Reset to original data
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      >
        <MDTypography variant="h4" fontWeight="bold" color="3f51b5">
          Daftar Donatur
        </MDTypography>
      </MDBox>

      <Card sx={{ padding: 4, marginTop: 2, boxShadow: 3, borderRadius: 2, bgcolor: "#ffffff" }}>
        {/* Filter Inputs (side by side) */}
        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ marginBottom: 1, fontWeight: "bold" }}>
              Nama Donatur
            </Typography>
            <TextField
              label="Filter by Name"
              fullWidth
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="body1"
              sx={{ marginBottom: 2, fontWeight: "bold", fontSize: "1.1rem" }}
            >
              Jenis Donatur
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Jenis Donatur</InputLabel>
              <Select
                value={selectedJenisDonatur}
                onChange={(e) => setSelectedJenisDonatur(e.target.value)}
                label="Jenis Donatur"
                sx={{
                  padding: "12px 16px",
                  fontSize: "1.2rem",
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
              >
                <MenuItem value="">Semua</MenuItem>
                <MenuItem value="Tetap">Donatur Tetap</MenuItem>
                <MenuItem value="Tidak Tetap">Donatur Tidak Tetap</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid container spacing={2} sx={{ marginTop: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  padding: "12px 24px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{
                  padding: "12px 24px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            </Grid>
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
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Nama</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Email</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>No Telepon</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Jenis Donatur</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Status</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Aksi</MDBox>
          </MDBox>

          {filteredData.length > 0 ? (
            filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((donatur, index) => {
                const globalIndex = page * rowsPerPage + index;
                return (
                  <>
                    <MDBox
                      key={donatur.id_user}
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
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{donatur.nama}</MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{donatur.email}</MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{donatur.no_telepon}</MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{donatur.jenis_donatur}</MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>
                        {donatur.status_aktif ? "Aktif" : "Tidak Aktif"}
                      </MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>
                        <IconButton
                          onClick={() => handleOpenConfirmDialog(donatur.id_donatur)}
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </MDBox>
                    </MDBox>
                  </>
                );
              })
          ) : (
            <MDBox
              component="div"
              sx={{ display: "flex", padding: "12px 16px", justifyContent: "center" }}
            >
              <MDTypography variant="body2" color="text.secondary">
                Tidak ada data donatur
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Apakah Anda yakin ingin menghapus donatur ini? Tindakan ini tidak bisa dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Batal
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Donatur;
