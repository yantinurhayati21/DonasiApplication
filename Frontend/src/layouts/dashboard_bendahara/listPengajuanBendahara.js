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
  DialogContent as MuiDialogContent,
  DialogContentText,
} from "@mui/material";
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
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";

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
  // Sudah dideklarasikan di atas, hapus duplikat
  const [successApproval, setSuccessApproval] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingApproval, setPendingApproval] = useState({ id_pengajuan: null, value: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [inputFilterDate, setInputFilterDate] = useState("");
  const [inputSelectedApproval, setInputSelectedApproval] = useState("");
  const API_BASE_URL = "http://localhost:3000/api";
  const role = localStorage.getItem("role");
  // const [statusBukti, setStatusBukti] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusBukti, setStatusBukti] = useState("menunggu"); // Menunggu sebagai default

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
    // Filter berdasarkan Tanggal Pengajuan
    const matchesDate = filterDate
      ? new Date(pengajuan.tanggal).toLocaleDateString() ===
        new Date(filterDate).toLocaleDateString()
      : true;

    // Filter berdasarkan Status Pengajuan
    let approvalValue = selectedApproval;
    if (selectedApproval && typeof selectedApproval === "object" && selectedApproval.value) {
      approvalValue = selectedApproval.value;
    }
    const matchesStatus =
      !approvalValue || pengajuan.status_pengajuan.toLowerCase() === approvalValue.toLowerCase();

    return matchesDate && matchesStatus;
  });
  // Saat tombol Search diklik, terapkan filter dari input
  const handleSearch = () => {
    setFilterDate(inputFilterDate);
    setSelectedApproval(inputSelectedApproval);
    setPage(0); // Reset pagination
  };

  // Saat tombol Clear diklik, reset semua input dan filter
  const handleClearFilters = () => {
    setInputSelectedApproval("");
    setInputFilterDate("");
    setSelectedApproval("");
    setFilterDate("");
    setPage(0); // Reset pagination
  };

  const fetchPengajuan = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/pengajuan`);
      setPengajuanList(res.data.data || []);
      const notif = await axios.get(`${API_BASE_URL}/pengajuan/notifikasi`);
      console.log(notif);
      // fetvj prngajuanList
      localStorage.setItem(
        "notifikasi",
        JSON.stringify(
          notif.data.filter(
            (notifikasi) =>
              notifikasi.status === "unread" &&
              notifikasi.id_user === parseInt(localStorage.getItem("id_user"))
          ) || []
        )
      );
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
      localStorage.setItem("notifikasi", JSON.stringify([...notifikasi, data])); // socket
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
      const [pengajuanRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/pengajuan/${pengajuan.id_pengajuan}`),
        axios.get("http://localhost:3000/api/kategori"),
      ]);

      const dataPengajuan = pengajuanRes.data.data;
      const categories = categoriesRes.data.data;

      setSelectedPengajuan(dataPengajuan);

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
  // Handler untuk perubahan combobox, tampilkan dialog konfirmasi
  const handleApprovalSelect = (id_pengajuan, value) => {
    setPendingApproval({ id_pengajuan, value });
    setOpenConfirmDialog(true);
  };

  // Handler konfirmasi update status
  const handleConfirmApproval = async () => {
    setOpenConfirmDialog(false);
    const { id_pengajuan, value } = pendingApproval;
    try {
      const res = await axios.put(`${API_BASE_URL}/pengajuan/bendahara/${id_pengajuan}`, {
        status: value,
      });
      if (res.data.status === "success") {
        setPengajuanList([]);
        fetchPengajuan();
        setSelectedApproval("");
        setInputSelectedApproval("");
        setSuccessApproval({ status: value });
      }
    } catch (error) {
      alert("Gagal memperbarui status pengajuan");
    }
    setPendingApproval({ id_pengajuan: null, value: "" });
  };

  // Handler batal konfirmasi
  const handleCancelApproval = () => {
    setOpenConfirmDialog(false);
    setPendingApproval({ id_pengajuan: null, value: "" });
  };

  // Handler tutup dialog sukses
  const handleCloseSuccessApproval = () => {
    setSuccessApproval(null);
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

  const handleUpdateStatusBukti = async (statusBukti, id_pengajuan) => {
    console.log("Updating status bukti:", statusBukti);

    try {
      const res = await axios.put(`${API_BASE_URL}/pengajuan/update-status-bukti/${id_pengajuan}`, {
        status_bukti: statusBukti,
      });
      console.log("Response from update status bukti:", res);
      alert("Status bukti pengeluaran berhasil diperbarui");
    } catch (error) {
      console.error("Error updating status bukti:", error);
      alert("Gagal memperbarui status bukti pengeluaran");
    }
  };

  return (
    <DashboardLayout>
      <Container sx={{ pb: 6 }} maxWidth="xl">
        {/* Your top content */}
        <MDBox sx={{ pt: 2, pb: 2, textAlign: "center" }}>
          {/* <Badge badgeContent={notifikasi.length} color="error" sx={{ mb: 1 }}>
            <NotificationsIcon fontSize="large" />
          </Badge> */}
        </MDBox>

        <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
          {/* Filter by Status Pengajuan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", minWidth: "140px", whiteSpace: "nowrap" }}
              >
                Status Pengajuan
              </Typography>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Status Pengajuan</InputLabel>
                <Select
                  value={inputSelectedApproval}
                  onChange={(e) => setInputSelectedApproval(e.target.value)}
                  label="Status Pengajuan"
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
                  <MenuItem value="menunggu_bendahara">Menunggu Bendahara</MenuItem>
                  <MenuItem value="menunggu_pimpinan">Menunggu Pimpinan</MenuItem>
                  <MenuItem value="diterima">Diterima</MenuItem>
                  <MenuItem value="ditolak_bendahara">Ditolak Bendahara</MenuItem>
                  <MenuItem value="ditolak_pimpinan">Ditolak Pimpinan</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Filter by Tanggal Pengajuan */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", minWidth: "180px", whiteSpace: "nowrap" }}
              >
                Tanggal Pengajuan
              </Typography>
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
                sx={{
                  backgroundColor: "#f4f4f9",
                  borderRadius: "8px",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Search and Clear Buttons */}
        <Grid container spacing={2} sx={{ pl: { xs: 0, sm: 2 }, mt: 1, mb: 3 }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
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
        <Grid container spacing={2} sx={{ width: "100%", maxWidth: "100%" }}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, width: "100%" }}>
              <MDTypography variant="h6" mb={2} sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
                Daftar Pengajuan dan Pengeluaran
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
                        sx={{
                          flex: 0.25,
                          padding: "8px 16px",
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >
                        No
                      </MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold" }}>
                        Tanggal Pengajuan
                      </MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold" }}>
                        Nominal Pengajuan
                      </MDBox>
                      <MDBox sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold" }}>
                        Status Pengajuan
                      </MDBox>
                      {role === "Bendahara" && (
                        <MDBox
                          sx={{
                            flex: 1,
                            padding: "8px 16px",
                            fontWeight: "bold",
                          }}
                        >
                          Persetujuan Bendahara
                        </MDBox>
                      )}
                      <MDBox sx={{ flex: 1, padding: "8px 16px", fontWeight: "bold" }}>
                        Persetujuan Pimpinan
                      </MDBox>
                      <MDBox
                        sx={{
                          flex: 1,
                          padding: "8px 16px",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        Detail Pengeluaran
                      </MDBox>
                    </MDBox>

                    {/* Data Rows */}
                    {filteredData.length === 0 ? (
                      <MDTypography
                        variant="body2"
                        color="textSecondary"
                        sx={{ textAlign: "center", margin: "32px 0" }}
                      >
                        Data Tidak Ditemukan
                      </MDTypography>
                    ) : (
                      filteredData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((pengajuan, index) => {
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
                              <MDBox sx={{ flex: 0.5 }}>{index + 1}</MDBox>
                              <MDBox sx={{ flex: 1 }}>
                                {new Intl.DateTimeFormat("id-ID", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }).format(new Date(pengajuan.tanggal))}
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
                                      <InputLabel>Pilih Status</InputLabel>
                                      <Select
                                        label="Pilih Status"
                                        value={isCurrentApproval ? selectedApproval.value : ""}
                                        onChange={(e) => {
                                          handleApprovalSelect(
                                            pengajuan.id_pengajuan,
                                            e.target.value
                                          );
                                        }}
                                        sx={{
                                          padding: "6px 5px",
                                          fontSize: "1rem",
                                          backgroundColor: "#f4f4f9",
                                          borderRadius: "7px",
                                          "& .MuiOutlinedInput-root": {
                                            borderRadius: "7px",
                                          },
                                          width: "120px",
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
                        })
                    )}
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
              padding: "16px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "20px", color: "#fff" }}>
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

          <DialogContent dividers sx={{ backgroundColor: "#fafafa", padding: 3 }}>
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
                          sx={{
                            flex: 1,
                            padding: "8px 16px",
                            fontWeight: "bold",
                            color: "#3f51b5",
                          }}
                        >
                          Nama Item
                        </MDBox>
                        <MDBox
                          sx={{
                            flex: 1,
                            padding: "8px 16px",
                            fontWeight: "bold",
                            color: "#3f51b5",
                          }}
                        >
                          Nama Kategori
                        </MDBox>
                        <MDBox
                          sx={{
                            flex: 1,
                            padding: "8px 16px",
                            fontWeight: "bold",
                            color: "#3f51b5",
                          }}
                        >
                          Total Harga
                        </MDBox>
                        {selectedPengajuan?.file_bukti && (
                          <>
                            <MDBox
                              sx={{
                                flex: 1,
                                padding: "8px 16px",
                                fontWeight: "bold",
                                color: "#3f51b5",
                              }}
                            >
                              Item Aktual
                            </MDBox>
                            <MDBox
                              sx={{
                                flex: 1,
                                padding: "8px 16px",
                                fontWeight: "bold",
                                color: "#3f51b5",
                              }}
                            >
                              Harga Aktual
                            </MDBox>
                          </>
                        )}
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

                            {selectedPengajuan?.file_bukti && (
                              <>
                                <MDBox sx={{ flex: 1, padding: "8px 16px" }}>
                                  {pengeluaran?.nama_item_act}
                                </MDBox>
                                <MDBox sx={{ flex: 1, padding: "8px 16px" }}>
                                  Rp{" "}
                                  {parseInt(pengeluaran?.total_harga_act).toLocaleString("id-ID")}
                                </MDBox>
                              </>
                            )}
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

                    {/* Jika Ada File Bukti Pengeluaran */}
                    {selectedPengajuan?.file_bukti && (
                      <>
                        <MDTypography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            marginTop: 1,
                            color: "#3f51b5",
                            // marginBottom: 1,
                          }}
                        >
                          Pengeluaran Aktual
                        </MDTypography>

                        <MDTypography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "16px" }}
                        >
                          {selectedPengajuan?.pengeluaran_actual
                            ? `Rp ${Number(selectedPengajuan.pengeluaran_actual).toLocaleString(
                                "id-ID"
                              )}`
                            : "Tidak ada keterangan tersedia."}
                        </MDTypography>
                        {/* Keterangan */}
                        <MDTypography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "#3f51b5",
                          }}
                        >
                          Catatan
                        </MDTypography>

                        <MDTypography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "16px" }}
                        >
                          {selectedPengajuan?.deskripsi || "Tidak ada Catatan tersedia."}
                        </MDTypography>
                        <MDTypography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "#3f51b5",
                          }}
                        >
                          Status Bukti Pengeluaran
                        </MDTypography>
                        {selectedPengajuan?.status_bukti_pengeluaran === "menunggu" ? (
                          <MDBox sx={{ marginTop: 2, maxWidth: 350 }}>
                            <FormControl fullWidth sx={{ minWidth: 200 }}>
                              <InputLabel id="status-bukti-label">Pilih Status</InputLabel>
                              <Select
                                labelId="status-bukti-label"
                                id="status_bukti"
                                value={statusBukti || "menunggu"} // Pastikan menunggu adalah default value jika statusBukti kosong
                                label="Pilih Status"
                                onChange={(e) => {
                                  setSelectedStatus(e.target.value);
                                  setConfirmDialogOpen(true); // Buka dialog konfirmasi saat status dipilih
                                }}
                                sx={{
                                  backgroundColor: "#fff",
                                  borderRadius: 2,
                                  fontWeight: "bold",
                                  fontSize: "1.1rem",
                                  boxShadow: 1,
                                }}
                                displayEmpty
                              >
                                <MenuItem value="menunggu" disabled>
                                  <span style={{ color: "#888" }}>Menunggu</span>
                                </MenuItem>
                                <MenuItem value="diterima">
                                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <CheckCircleOutline sx={{ color: "#4caf50", fontSize: 22 }} />
                                    <span style={{ color: "#4caf50", fontWeight: 600 }}>
                                      Diterima
                                    </span>
                                  </span>
                                </MenuItem>
                                <MenuItem value="ditolak">
                                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <CancelOutlined sx={{ color: "#d32f2f", fontSize: 22 }} />
                                    <span style={{ color: "#d32f2f", fontWeight: 600 }}>
                                      Ditolak
                                    </span>
                                  </span>
                                </MenuItem>
                              </Select>
                              <Typography variant="caption" sx={{ mt: 1, color: "#666" }}>
                                Pilih status bukti pengeluaran sesuai hasil verifikasi Anda.
                              </Typography>
                            </FormControl>
                          </MDBox>
                        ) : (
                          selectedPengajuan?.status_bukti_pengeluaran
                        )}

                        {/* Button untuk membuka bukti */}
                        <Box sx={{ marginTop: 4, textAlign: "center" }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              padding: "8px 20px",
                              fontSize: "16px",
                              color: "#3f51b5",
                              "&:hover": {
                                backgroundColor: "#3f51b5",
                                color: "#fff",
                                borderColor: "#3f51b5",
                              },
                            }}
                            onClick={() =>
                              window.open(
                                `http://localhost:3000${selectedPengajuan?.file_bukti}`,
                                "_blank"
                              )
                            }
                          >
                            Buka Bukti Pengeluaran
                          </Button>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {renderInfoSB}
        {/* Dialog Konfirmasi Approval */}
        <Dialog open={openConfirmDialog} onClose={handleCancelApproval} keepMounted>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#ff9800" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Margin sx={{ fontSize: 32, color: "#ff9800" }} />
              Konfirmasi Status Pengajuan
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2, color: "#333", fontWeight: "500" }}>
              Apakah Anda yakin ingin{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: pendingApproval.value === "diterima" ? "#4caf50" : "#d32f2f",
                }}
              >
                {pendingApproval.value === "diterima" ? "menerima" : "menolak"}
              </span>{" "}
              pengajuan ini?
              <br />
              <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                Data yang sudah dipilih tidak bisa diubah.
              </span>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelApproval}
              color="secondary"
              variant="outlined"
              sx={{ color: "#333" }} // Mengatur warna tulisan menjadi hitam
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmApproval}
              color="primary"
              variant="contained"
              sx={{ color: "#fff" }} // Mengatur warna tulisan menjadi putih
            >
              Ya
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Sukses Setelah Approval */}
        <Dialog open={!!successApproval} onClose={handleCloseSuccessApproval} keepMounted>
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: successApproval?.status === "diterima" ? "#4caf50" : "#d32f2f",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {successApproval?.status === "diterima" ? (
                <CheckCircleOutline sx={{ fontSize: 32, color: "#4caf50" }} />
              ) : (
                <CancelOutlined sx={{ fontSize: 32, color: "#d32f2f" }} />
              )}
              {successApproval?.status === "diterima" ? "Pengajuan Diterima" : "Pengajuan Ditolak"}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2, color: "#333", fontWeight: "500" }}>
              {successApproval?.status === "diterima"
                ? "Pengajuan berhasil diterima. Data tidak dapat diubah kembali."
                : "Pengajuan berhasil ditolak. Data tidak dapat diubah kembali."}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccessApproval} color="primary" variant="contained">
              Tutup
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
          <DialogTitle>Konfirmasi Perubahan Status</DialogTitle>
          <MuiDialogContent>
            <DialogContentText>
              Apakah Anda yakin ingin mengubah status bukti pengeluaran menjadi{" "}
              <strong>{selectedStatus === "diterima" ? "Diterima" : "Ditolak"}</strong>?
            </DialogContentText>
          </MuiDialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
              Batal
            </Button>
            <Button
              onClick={async () => {
                setStatusBukti(selectedStatus); // Update status setelah konfirmasi
                await handleUpdateStatusBukti(selectedStatus, selectedPengajuan?.id_pengajuan);
                setConfirmDialogOpen(false);
              }}
              color="primary"
              variant="contained"
            >
              Ya, Ubah
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
};

export default ListPengajuanBendahara;
