import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  Button,
  Typography,
  Box,
  Container,
  Badge,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  TextField,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Margin,
} from "@mui/icons-material";
import io from "socket.io-client";
import MDSnackbar from "components/MDSnackbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

const ListPengajuanBendahara = () => {
  const [notifikasi, setNotifikasi] = useState([]);
  const [infoSB, setInfoSB] = useState(false);
  const [message, setMessage] = useState("");
  const [pengajuanList, setPengajuanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [pengeluaranList, setPengeluaranList] = useState([]);
  const [loadingPengeluaran, setLoadingPengeluaran] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");

  const API_BASE_URL = "http://localhost:3000/api";
  const role = localStorage.getItem("role");

  // Handle Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle Rows per Page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Filter Text change
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  // Filtered Data for Table
  const filteredData = pengajuanList.filter((pengajuan) => {
    return (
      String(pengajuan.id_pengajuan).toLowerCase().includes(filterText.toLowerCase()) || // Ensure it is a string
      new Date(pengajuan.tanggal).toLocaleDateString().includes(filterText.toLowerCase()) ||
      pengajuan.status_pengajuan.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  const fetchPengajuan = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/pengajuan`);
      setPengajuanList(res.data.data || []);
      const notif = await axios.get(`${API_BASE_URL}/pengajuan/notifikasi`);
      console.log(notif);
      setNotifikasi(
        notif.data.filter(
          (notifikasi) =>
            notifikasi.status === "unread" &&
            notifikasi.id_user === parseInt(localStorage.getItem("id_user"))
        ) || []
      );
    } catch (error) {
      console.error("Gagal fetch data pengajuan:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPengajuanList([]);
    fetchPengajuan();

    const socket = io("http://localhost:3000");

    socket.on("new-pengajuan-bendahara", (data) => {
      console.log("Pengajuan baru:", data);
      setMessage(data.pesan);
      setNotifikasi((prev) => [...prev, data]);
      setPengajuanList(data.data || []);
      setInfoSB(true);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const closeInfoSB = () => setInfoSB(false);

  const handleOpenDetail = async (pengajuan) => {
    setSelectedPengajuan(null);
    setPengeluaranList([]);
    setOpenDetail(true);
    setLoadingPengeluaran(true);

    try {
      // Fetch both pengajuan and categories in parallel
      const [pengajuanRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/pengajuan/${pengajuan.id_pengajuan}`),
        axios.get("http://localhost:3000/api/kategori"),
      ]);

      const dataPengajuan = pengajuanRes.data.data;
      const categories = categoriesRes.data.data;

      console.log(dataPengajuan);

      setSelectedPengajuan(dataPengajuan);

      // Map id_kategori to category name
      const mappedPengeluaran = dataPengajuan.detail_pengeluaran.map((pengeluaran) => {
        const category = categories.find((cat) => cat.id_kategori === pengeluaran.id_kategori);
        return {
          ...pengeluaran,
          nama_kategori: category ? category.nama_kategori : "Kategori Tidak Ditemukan",
        };
      });

      setPengeluaranList(mappedPengeluaran || []);
    } catch (error) {
      console.error("Gagal fetch detail pengajuan:", error);
      setSelectedPengajuan(pengajuan);
      setPengeluaranList([]);
    } finally {
      setLoadingPengeluaran(false);
    }
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedPengajuan(null);
    setPengeluaranList([]);
  };
  // Handle perubahan status approval
  const handleApprovalChange = async (id_pengajuan, status) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/pengajuan/bendahara/${id_pengajuan}`, {
        status,
      });
      console.log(res);
      if (res.data.status === "success") {
        // Setelah berhasil, update status pengajuan di frontend
        setPengajuanList([]);
        fetchPengajuan();
        alert("Status pengajuan berhasil diperbarui");
      }
    } catch (error) {
      console.error("Error updating pengajuan status:", error);
      alert("Gagal memperbarui status pengajuan");
    }
  };

  const renderInfoSB = (
    <MDSnackbar
      icon={<NotificationsIcon />}
      title="Notifikasi Pengajuan"
      content={message}
      dateTime="Just now"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  return (
    <Container sx={{ pb: 6 }} maxWidth="xl">
      {/* Your top content */}
      <MDBox sx={{ pt: 2, pb: 2, textAlign: "center" }}>
        <Badge badgeContent={notifikasi.length} color="error" sx={{ mb: 1 }}>
          <NotificationsIcon fontSize="large" />
        </Badge>
        <MDTypography variant="h4" gutterBottom>
          Dashboard Bendahara
        </MDTypography>
      </MDBox>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <MDTypography variant="h6" mb={2} sx={{ color: "#3f51b5", fontWeight: "bold" }}>
              Daftar Pengajuan
            </MDTypography>

            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : pengajuanList.length === 0 ? (
              <MDTypography variant="body2" color="textSecondary">
                Belum ada pengajuan yang dibuat.
              </MDTypography>
            ) : (
              <>
                {/* Filter Input */}
                <TextField
                  label="Filter"
                  variant="outlined"
                  size="small"
                  sx={{ marginBottom: 2, width: "100%" }}
                  value={filterText}
                  onChange={handleFilterChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Table Content */}
                <MDBox component="div" sx={{ overflowX: "auto", marginBottom: 3 }}>
                  {/* Header */}
                  <MDBox
                    component="div"
                    sx={{
                      display: "flex",
                      backgroundColor: "#f1f1f1",
                      padding: "12px",
                      borderRadius: 1,
                    }}
                  >
                    <MDBox
                      sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold", color: "#3f51b5" }}
                    >
                      ID Pengajuan
                    </MDBox>
                    <MDBox
                      sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold", color: "#3f51b5" }}
                    >
                      Tanggal Pengajuan
                    </MDBox>
                    <MDBox
                      sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold", color: "#3f51b5" }}
                    >
                      Nominal Pengajuan
                    </MDBox>
                    <MDBox
                      sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold", color: "#3f51b5" }}
                    >
                      Status Pengajuan
                    </MDBox>
                    {role === "Bendahara" && (
                      <MDBox
                        sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold", color: "#3f51b5" }}
                      >
                        Status Approval Bendahara
                      </MDBox>
                    )}
                    <MDBox
                      sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold", color: "#3f51b5" }}
                    >
                      Status Approval Pimpinan
                    </MDBox>
                    <MDBox
                      sx={{
                        flex: 1,
                        padding: "8px 16px",
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#3f51b5",
                      }}
                    >
                      Detail Pengeluaran
                    </MDBox>
                  </MDBox>

                  {/* Data Rows */}
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((pengajuan) => {
                      const isCurrentApproval =
                        selectedApproval?.id_pengajuan === pengajuan.id_pengajuan;
                      return (
                        <MDBox
                          component="div"
                          sx={{
                            display: "flex",
                            padding: "12px 16px",
                            backgroundColor: "#fff",
                            borderRadius: 1,
                            marginBottom: 1,
                            boxShadow: 1,
                            "&:hover": { backgroundColor: "#f9f9f9" },
                          }}
                          key={pengajuan.id_pengajuan}
                        >
                          <MDBox sx={{ flex: 1 }}>{pengajuan.id_pengajuan}</MDBox>
                          <MDBox sx={{ flex: 1 }}>
                            {new Date(pengajuan.tanggal).toLocaleDateString()}
                          </MDBox>
                          <MDBox sx={{ flex: 1 }}>
                            Rp {Number(pengajuan.nominal_pengajuan).toLocaleString("id-ID")}
                          </MDBox>
                          <MDBox sx={{ flex: 1 }}>
                            <MDBadge
                              badgeContent={pengajuan.status_pengajuan.replace(/_/g, " ")}
                              color={
                                pengajuan.status_pengajuan === "diterima"
                                  ? "success"
                                  : pengajuan.status_pengajuan === "ditolak"
                                  ? "error"
                                  : "default"
                              }
                              variant="gradient"
                              size="sm"
                            />
                          </MDBox>
                          {role === "Bendahara" && (
                            <MDBox sx={{ flex: 1 }}>
                              {pengajuan.status_pengajuan === "menunggu_bendahara" ? (
                                <FormControl fullWidth size="small">
                                  <InputLabel>Status Approval</InputLabel>
                                  <Select
                                    label="Status Approval"
                                    value={isCurrentApproval ? selectedApproval.value : ""}
                                    onChange={(e) => {
                                      setSelectedApproval({
                                        id_pengajuan: pengajuan.id_pengajuan,
                                        value: e.target.value,
                                      });
                                      handleApprovalChange(pengajuan.id_pengajuan, e.target.value);
                                    }}
                                  >
                                    <MenuItem value="diterima">Diterima</MenuItem>
                                    <MenuItem value="ditolak">Ditolak</MenuItem>
                                  </Select>
                                </FormControl>
                              ) : (
                                <MDTypography>{pengajuan.approved_from_bendahara}</MDTypography>
                              )}
                            </MDBox>
                          )}
                          <MDBox sx={{ flex: 1 }}>{pengajuan.approval_from_pimpinan}</MDBox>
                          <MDBox sx={{ flex: 1, textAlign: "center" }}>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                padding: "6px 16px",
                                border: "2px solid #3f51b5",
                                color: "#3f51b5",
                                fontWeight: "bold",
                                fontSize: "14px",
                                "&:hover": {
                                  backgroundColor: "#3f51b5",
                                  color: "#fff",
                                  borderColor: "#3f51b5",
                                },
                                "&:active": {
                                  backgroundColor: "#303f9f",
                                  color: "#fff",
                                },
                              }}
                              onClick={() => handleOpenDetail(pengajuan)}
                            >
                              Detail
                            </Button>
                          </MDBox>
                        </MDBox>
                      );
                    })}
                </MDBox>

                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[10]}
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
        </Grid>
      </Grid>

      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            position: "relative",
            paddingRight: 4,
            backgroundColor: "#3f51b5",
            color: "#fff",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            padding: "16px", // Menambahkan padding lebih agar tampak lebih nyaman
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Menambahkan bayangan halus untuk kedalaman
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "20px", letterSpacing: "0.5px", color: "#fff" }}
          >
            Detail Pengajuan - ID: {selectedPengajuan?.id_pengajuan}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDetail}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#fff",
              "&:hover": { backgroundColor: "transparent", color: "#ff4081" },
              transition: "color 0.3s ease",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ backgroundColor: "#fafafa", borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
        >
          {loadingPengeluaran ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress size={30} sx={{ color: "#3f51b5" }} />
            </Box>
          ) : (
            <Box sx={{ padding: 3, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
              {selectedPengajuan && (
                <>
                  <MDTypography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: "#3f51b5",
                      fontWeight: "bold",
                      marginBottom: 3,
                      padding: "12px 16px",
                      borderRadius: 2,
                      backgroundColor: "#e3f2fd",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Data Pengeluaran
                  </MDTypography>

                  <MDTypography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      marginBottom: 4,
                      fontSize: "16px",
                      color: "#333",
                      lineHeight: 1.6,
                      fontWeight: "500",
                    }}
                  >
                    Nominal Pengajuan:{" "}
                    <span style={{ fontWeight: "bold", color: "#3f51b5" }}>
                      Rp {Number(selectedPengajuan?.nominal_pengajuan).toLocaleString("id-ID")}
                    </span>
                  </MDTypography>

                  {/* Tabel Data Pengeluaran */}
                  <MDBox component="div" sx={{ overflowX: "auto", marginBottom: 3 }}>
                    <MDBox
                      component="div"
                      sx={{
                        display: "flex",
                        backgroundColor: "#f1f1f1",
                        padding: "12px",
                        borderRadius: 1,
                      }}
                    >
                      <MDBox
                        sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold", color: "#3f51b5" }}
                      >
                        Nama Item
                      </MDBox>
                      <MDBox
                        sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold", color: "#3f51b5" }}
                      >
                        Nama Kategori
                      </MDBox>
                      <MDBox
                        sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold", color: "#3f51b5" }}
                      >
                        Total Harga
                      </MDBox>
                    </MDBox>

                    {/* Data Rows */}
                    {pengeluaranList && pengeluaranList.length > 0 ? (
                      pengeluaranList.map((pengeluaran, index) => (
                        <MDBox
                          key={index}
                          component="div"
                          sx={{
                            display: "flex",
                            padding: "12px 16px",
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                            borderRadius: 1,
                            boxShadow: 1,
                            marginBottom: 1,
                            "&:hover": { backgroundColor: "#e3f2fd" },
                          }}
                        >
                          <MDBox sx={{ flex: 1, padding: "8px 16px" }}>
                            {pengeluaran?.nama_item}
                          </MDBox>
                          <MDBox sx={{ flex: 1, padding: "8px 16px" }}>
                            {pengeluaran?.nama_kategori}
                          </MDBox>
                          <MDBox sx={{ flex: 1, padding: "8px 16px" }}>
                            Rp {Number(pengeluaran?.total_harga).toLocaleString("id-ID")}
                          </MDBox>
                        </MDBox>
                      ))
                    ) : (
                      <MDBox
                        component="div"
                        sx={{ display: "flex", padding: "12px 16px", justifyContent: "center" }}
                      >
                        <MDTypography variant="body2" color="text.secondary">
                          Tidak ada data pengeluaran
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
      {renderInfoSB}
    </Container>
  );
};

export default ListPengajuanBendahara;
