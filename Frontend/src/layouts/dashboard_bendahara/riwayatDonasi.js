import React, { useEffect, useState } from "react";
import {
  Card,
  TablePagination,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DonasiBendahara() {
  const [donasiList, setDonasiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Input filter state (sementara)
  const [inputSelectedApproval, setInputSelectedApproval] = useState("");
  const [inputFilterDate, setInputFilterDate] = useState("");
  const [inputFilterKodeTransaksi, setInputFilterKodeTransaksi] = useState("");
  const [inputFilterNamaDonatur, setInputFilterNamaDonatur] = useState("");

  // Filter yang diterapkan (hanya berubah saat Search)
  const [filterSelectedApproval, setFilterSelectedApproval] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterKodeTransaksi, setFilterKodeTransaksi] = useState("");
  const [filterNamaDonatur, setFilterNamaDonatur] = useState("");

  useEffect(() => {
    fetchDonasi();
  }, []);

  const fetchDonasi = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/donasi/laporan/bendahara");
      setDonasiList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat data donasi", error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    setFilterSelectedApproval(inputSelectedApproval);
    setFilterDate(inputFilterDate);
    setFilterKodeTransaksi(inputFilterKodeTransaksi);
    setFilterNamaDonatur(inputFilterNamaDonatur);
    setPage(0);
  };

  const handleClearFilters = () => {
    setInputSelectedApproval("");
    setInputFilterDate("");
    setInputFilterKodeTransaksi("");
    setInputFilterNamaDonatur("");
    setFilterSelectedApproval("");
    setFilterDate("");
    setFilterKodeTransaksi("");
    setFilterNamaDonatur("");
    setPage(0);
  };

  const filteredData = donasiList.filter((item) => {
    const isKodeTransaksiMatch = item.order_id
      .toLowerCase()
      .includes((filterKodeTransaksi || "").toLowerCase());
    const isNamaDonaturMatch = item.nama
      .toLowerCase()
      .includes((filterNamaDonatur || "").toLowerCase());

    // Convert item.tanggal_donasi to Date object
    const itemTanggal = new Date(item.tanggal_donasi).toLocaleDateString("id-ID");
    const isTanggalMatch = filterDate
      ? itemTanggal === new Date(filterDate).toLocaleDateString("id-ID")
      : true;

    const isStatusMatch = filterSelectedApproval
      ? item.status_pengajuan === filterSelectedApproval
      : true;

    return isKodeTransaksiMatch && isNamaDonaturMatch && isTanggalMatch && isStatusMatch;
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Card sx={{ p: 3, mt: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Data Donasi Bendahara
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {/* Filter by Kode Transaksi */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Filter Kode Transaksi"
              variant="outlined"
              size="small"
              fullWidth
              value={inputFilterKodeTransaksi}
              onChange={(e) => setInputFilterKodeTransaksi(e.target.value)}
            />
          </Grid>

          {/* Filter by Nama Donatur */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Filter Nama Donatur"
              variant="outlined"
              size="small"
              fullWidth
              value={inputFilterNamaDonatur}
              onChange={(e) => setInputFilterNamaDonatur(e.target.value)}
            />
          </Grid>

          {/* Filter by Tanggal Pengajuan */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Filter Tanggal Pengajuan"
              variant="outlined"
              size="small"
              type="date"
              fullWidth
              value={inputFilterDate}
              onChange={(e) => setInputFilterDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        {/* Search and Clear Buttons */}
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
        </Grid>

        {/* Table */}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <MDBox component="div" sx={{ overflowX: "auto", marginBottom: 3, maxHeight: "600px" }}>
              <MDBox
                sx={{
                  display: "flex",
                  backgroundColor: "#f1f1f1",
                  padding: "12px",
                  borderRadius: 1,
                }}
              >
                <MDBox sx={{ flex: 1.5 }}>Kode Transaksi</MDBox>
                <MDBox sx={{ flex: 1 }}>Nama Donatur</MDBox>
                <MDBox sx={{ flex: 1 }}>Jenis Donatur</MDBox>
                <MDBox sx={{ flex: 1 }}>Tanggal Donasi</MDBox>
                <MDBox sx={{ flex: 1 }}>Nominal</MDBox>
                <MDBox sx={{ flex: 2 }}>List Doa</MDBox>
                <MDBox sx={{ flex: 2 }}>Doa Spesifik</MDBox>
              </MDBox>

              {filteredData.length === 0 ? (
                <MDBox sx={{ padding: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="textSecondary">
                    Data tidak ditemukan
                  </Typography>
                </MDBox>
              ) : (
                filteredData
                  .filter((item) => {
                    const role = localStorage.getItem("role");
                    const nama = localStorage.getItem("nama");
                    if (role === "Donatur") {
                      console.log("Filtering for Donatur with ID:", item.nama);
                      return item.nama === nama && item;
                    }
                    return item; // untuk selain Donatur, tampilkan semua
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <MDBox
                      key={index}
                      sx={{
                        display: "flex",
                        padding: "12px",
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <MDBox sx={{ flex: 1.5 }}>{item.order_id}</MDBox>
                      <MDBox sx={{ flex: 1 }}>{item.nama}</MDBox>
                      <MDBox sx={{ flex: 1 }}>{item.jenis_donatur}</MDBox>
                      <MDBox sx={{ flex: 1 }}>
                        {new Date(item.tanggal_donasi).toLocaleDateString("id-ID")}
                      </MDBox>
                      <MDBox sx={{ flex: 1 }}>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(item.nominal)}
                      </MDBox>
                      <MDBox sx={{ flex: 2 }}>{item.list_doa}</MDBox>
                      <MDBox sx={{ flex: 2 }}>{item.doa_spesific}</MDBox>
                    </MDBox>
                  ))
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
          </>
        )}
      </Card>

      <Footer />
    </DashboardLayout>
  );
}

export default DonasiBendahara;
