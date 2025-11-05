import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  TablePagination,
  Dialog,
  IconButton,
} from "@mui/material";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import CloseIcon from "@mui/icons-material/Close";
function DonasiPribadi() {
  const [donasiList, setDonasiList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [kodeTransaksi, setKodeTransaksi] = useState("");
  const [tanggalDonasi, setTanggalDonasi] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [openDoaDialog, setOpenDoaDialog] = useState(false);
  const [selectedDoa, setSelectedDoa] = useState({ list_doa: "", doa_spesific: "" });

  const namaDonatur = localStorage.getItem("nama");

  useEffect(() => {
    fetchDonasi();
  }, []);

  const fetchDonasi = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/donasi/laporan/bendahara");
      const data = response.data.data.filter((item) => item.nama === namaDonatur);
      setDonasiList(data);
      setFilteredList(data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal memuat data donasi", error);
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const filtered = donasiList.filter((item) => {
      const isKodeMatch = item.order_id.toLowerCase().includes(kodeTransaksi.toLowerCase());
      const isTanggalMatch = tanggalDonasi
        ? new Date(item.tanggal_donasi).toLocaleDateString("id-ID") ===
          new Date(tanggalDonasi).toLocaleDateString("id-ID")
        : true;
      return isKodeMatch && isTanggalMatch;
    });
    setFilteredList(filtered);
    setPage(0);
  };

  const handleClear = () => {
    setKodeTransaksi("");
    setTanggalDonasi("");
    setFilteredList(donasiList);
    setPage(0);
  };

  return (
    <DashboardLayout>
      <Card sx={{ p: 3, mt: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Riwayat Donasi Saya
        </Typography>

        {/* Filter Inputs */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Kode Transaksi"
              value={kodeTransaksi}
              onChange={(e) => setKodeTransaksi(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tanggal Donasi"
              type="date"
              value={tanggalDonasi}
              onChange={(e) => setTanggalDonasi(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
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
              onClick={handleFilter}
            >
              Search
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
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
              onClick={handleClear}
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
            <MDBox component="div" sx={{ overflowX: "auto", marginBottom: 3 }}>
              <MDBox
                sx={{
                  display: "flex",
                  backgroundColor: "#f1f1f1",
                  padding: "12px",
                  borderRadius: 1,
                  fontWeight: "bold",
                }}
              >
                <MDBox sx={{ flex: 1.5 }}>Kode Transaksi</MDBox>
                <MDBox sx={{ flex: 1 }}>Nama Donatur</MDBox>
                <MDBox sx={{ flex: 1 }}>Jenis Donatur</MDBox>
                <MDBox sx={{ flex: 1 }}>Tanggal Donasi</MDBox>
                <MDBox sx={{ flex: 1 }}>Nominal</MDBox>
                <MDBox sx={{ flex: 1, textAlign: "center" }}>Action</MDBox>
              </MDBox>

              {filteredList.length === 0 ? (
                <MDBox sx={{ padding: 4, textAlign: "center" }}>
                  <Typography variant="body2">Data tidak ditemukan</Typography>
                </MDBox>
              ) : (
                filteredList
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
                        alignItems: "center",
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
                      <MDBox sx={{ flex: 1, textAlign: "center" }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            background: "linear-gradient(90deg, #64b5f6 0%, #90caf9 100%)",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(100,181,246,0.15)",
                            textTransform: "none",
                            transition: "0.2s",
                            "&:hover": {
                              background: "linear-gradient(90deg, #42a5f5 0%, #64b5f6 100%)",
                            },
                          }}
                          onClick={() => {
                            setSelectedDoa({
                              list_doa: item.list_doa,
                              doa_spesific: item.doa_spesific,
                            });
                            setOpenDoaDialog(true);
                          }}
                        >
                          Detail Doa
                        </Button>
                      </MDBox>
                    </MDBox>
                  ))
              )}
            </MDBox>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />

            {/* Dialog Doa */}
            {/* Pop up dialog untuk detail doa */}
            <Box>
              <Dialog
                open={openDoaDialog}
                onClose={() => setOpenDoaDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
                    boxShadow: "0 8px 32px rgba(100,181,246,0.18)",
                    position: "relative", // Posisi relative untuk penempatan ikon
                  },
                }}
              >
                <Box sx={{ p: 4, textAlign: "left" }}>
                  <Typography variant="h6" fontWeight="bold" fontSize={24} gutterBottom>
                    Detail Doa
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      mb: 2,
                      p: 2,
                      background: "#f5faff",
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(100,181,246,0.08)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="secondary"
                      gutterBottom
                    >
                      List Doa Pilihan:
                    </Typography>
                    {/* Menampilkan list doa */}
                    <Box sx={{ mb: 2 }}>
                      {selectedDoa.list_doa ? (
                        <ul style={{ paddingLeft: "20px", margin: 0 }}>
                          {selectedDoa.list_doa.split(",").map((doa, index) => (
                            <li key={index} style={{ marginBottom: "8px" }}>
                              <Typography variant="body1" color="textPrimary">
                                {doa.trim()}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Typography variant="body1" color="textPrimary">
                          -
                        </Typography>
                      )}
                    </Box>

                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="secondary"
                      gutterBottom
                    >
                      Doa Khusus:
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                      {selectedDoa.doa_spesific || "-"}
                    </Typography>
                  </Box>

                  {/* Ikon Close di kanan atas */}
                  <IconButton
                    sx={{
                      position: "absolute", // Posisi absolute untuk menempatkan ikon di sudut kanan atas
                      top: 16, // Jarak dari atas
                      right: 16, // Jarak dari kanan
                      color: "#64b5f6",
                      fontSize: "24px",
                      "&:hover": {
                        background: "transparent",
                        color: "#42a5f5",
                      },
                    }}
                    onClick={() => setOpenDoaDialog(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Dialog>
            </Box>
          </>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default DonasiPribadi;
