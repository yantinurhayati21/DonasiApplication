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
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ToggleOn, ToggleOff } from "@mui/icons-material"; // Ikon untuk status aktif/tidak aktif

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Donatur() {
  const [donaturList, setDonaturList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState(""); // Filter by Name
  const [selectedJenisDonatur, setSelectedJenisDonatur] = useState("");
  const [selectedStatusDonatur, setSelectedStatusDonatur] = useState("");
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [loadingReminder, setLoadingReminder] = useState(false);
  // State untuk pop up konfirmasi
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState(null);
  const [pendingStatusValue, setPendingStatusValue] = useState(null);

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

  const handleSearch = () => {
    const filteredDataWithSearch = donaturList.filter((donatur) => {
      const matchesName = donatur.nama.toLowerCase().includes(filterText.toLowerCase());
      const matchesJenisDonatur =
        !selectedJenisDonatur || donatur.jenis_donatur === selectedJenisDonatur;
      const matchesStatusDonatur =
        selectedStatusDonatur === "" || donatur.status_aktif === JSON.parse(selectedStatusDonatur);
      return matchesName && matchesJenisDonatur && matchesStatusDonatur;
    });
    setFilteredData(filteredDataWithSearch);
  };

  const handleClearFilters = () => {
    setFilterText("");
    setSelectedJenisDonatur("");
    setSelectedStatusDonatur("");
    setFilteredData(donaturList); // Reset to original data
  };

  // Handler untuk membuka dialog konfirmasi
  const handleStatusChange = (id, currentStatus) => {
    setPendingStatusId(id);
    setPendingStatusValue(currentStatus === true ? false : true);
    setOpenConfirm(true);
  };

  // Handler untuk konfirmasi update status
  const handleConfirmStatusChange = async () => {
    if (pendingStatusId == null) return;
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/donatur/status/${pendingStatusId}`,
        {
          status_aktif: pendingStatusValue,
        }
      );
      const updatedDonaturList = donaturList.map((donatur) =>
        donatur.id_donatur === pendingStatusId
          ? { ...donatur, status_aktif: pendingStatusValue }
          : donatur
      );
      setDonaturList(updatedDonaturList);
      setFilteredData(updatedDonaturList);
      setOpenConfirm(false);
      setPendingStatusId(null);
      setPendingStatusValue(null);
    } catch (error) {
      console.error("Error updating donatur status:", error);
      alert("Terjadi kesalahan saat mengubah status donatur.");
      setOpenConfirm(false);
      setPendingStatusId(null);
      setPendingStatusValue(null);
    }
  };

  // Handler untuk batal
  const handleCancelStatusChange = () => {
    setOpenConfirm(false);
    setPendingStatusId(null);
    setPendingStatusValue(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSendReminderToAll = async () => {
    setLoadingReminder(true); // Menandakan bahwa pengiriman sedang berlangsung
    try {
      const response = await axios.post("http://localhost:3000/api/donatur/sendReminderAll");
      alert(response.data.message); // Menampilkan pesan sukses
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("Terjadi kesalahan saat mengirim pengingat.");
    } finally {
      setLoadingReminder(false); // Menyelesaikan proses dan menonaktifkan loading
    }
  };

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
          marginBottom: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
          {/* Filter: Nama Donatur */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", minWidth: "110px", whiteSpace: "nowrap" }}
              >
                Nama Donatur
              </Typography>
              <TextField
                label="Filter by Name"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                sx={{ maxWidth: 220, flex: 1 }}
              />
            </Box>
          </Grid>

          {/* Filter: Jenis Donatur */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", minWidth: "110px", whiteSpace: "nowrap" }}
              >
                Jenis Donatur
              </Typography>
              <FormControl sx={{ maxWidth: 250, flex: 1 }}>
                <InputLabel>Jenis Donatur</InputLabel>
                <Select
                  value={selectedJenisDonatur}
                  onChange={(e) => setSelectedJenisDonatur(e.target.value)}
                  label="Jenis Donatur"
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
                >
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="Tetap">Donatur Tetap</MenuItem>
                  <MenuItem value="Tidak Tetap">Donatur Tidak Tetap</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Filter: Status Donatur */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", minWidth: "110px", whiteSpace: "nowrap" }}
              >
                Status Donatur
              </Typography>
              <FormControl sx={{ maxWidth: 220, flex: 1 }}>
                <InputLabel>Status Donatur</InputLabel>
                <Select
                  value={selectedStatusDonatur}
                  onChange={(e) => setSelectedStatusDonatur(e.target.value)}
                  label="Status Donatur"
                  sx={{
                    padding: "10px 12px",
                    fontSize: "1rem",
                    backgroundColor: "#f4f4f9",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="true">Aktif</MenuItem>
                  <MenuItem value="false">Tidak Aktif</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        {/* ignore prettier */}
        {/* Row 2: Tombol di kiri (sejajar bawah Nama Donatur) */}
        <Grid
          container
          spacing={2}
          sx={{
            pl: { xs: 0, sm: 2 },
            mt: 1,
            mb: 3,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid item sx={{ display: "flex", gap: 2 }}>
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
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                padding: "10px 32px",
                color: "#666",
                minWidth: 140,
                fontSize: "0.95rem",
                fontWeight: "bold",
                borderRadius: "8px",
                textTransform: "none",
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
          <Grid item sx={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4caf50", // Warna tombol hijau
                color: "#fff",
                padding: "10px 32px",
                minWidth: 140,
                fontSize: "0.95rem",
                fontWeight: "bold",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#388e3c", // Warna tombol saat hover
                },
                cursor: loading ? "not-allowed" : "pointer", // Disable cursor if loading
              }}
              onClick={handleSendReminderToAll}
              disabled={loadingReminder} // Disable the button while loading
            >
              {loadingReminder ? "Mengirim..." : "Kirim Pengingat"}{" "}
              {/* Show loading text if loading */}
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
            <MDBox sx={{ flex: 0.25, padding: "8px 16px" }}>No</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Nama</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Email</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>No Telepon</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Jenis Donatur</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Status</MDBox>
            <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Alamat</MDBox>
          </MDBox>

          {filteredData.length > 0 ? (
            filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((donatur, index) => {
                const globalIndex = page * rowsPerPage + index;
                return (
                  <>
                    <MDBox
                      key={donatur.id_donatur}
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
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{donatur.nama}</MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{donatur.email}</MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{donatur.no_telepon}</MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{donatur.jenis_donatur}</MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>
                        {donatur.status_aktif ? "Aktif" : "Non-Aktif"}
                      </MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{donatur.alamat}</MDBox>
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
    </DashboardLayout>
  );
}

export default Donatur;
