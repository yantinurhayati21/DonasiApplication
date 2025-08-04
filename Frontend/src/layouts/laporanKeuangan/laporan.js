import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getLaporanKeuangan } from "services/laporanService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const LaporanDonasi = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [laporan, setLaporan] = useState(null);
  const [error, setError] = useState(null);

  const isAwalBulan = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date.getDate() === 1;
  };

  const isAkhirBulan = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return date.getDate() === lastDay;
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError("Silakan pilih rentang tanggal terlebih dahulu.");
      return;
    }
    if (!isAwalBulan(startDate)) {
      setError("Tanggal mulai harus di awal bulan (tanggal 1).");
      return;
    }
    if (!isAkhirBulan(endDate)) {
      setError("Tanggal akhir harus di akhir bulan.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getLaporanKeuangan(startDate, endDate);
      setLaporan(data);
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data laporan");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value, prefix = "") => `${prefix}Rp ${value.toLocaleString("id-ID")}`;

  const handleDownloadPDF = () => {
    const input = document.getElementById("laporan-keuangan-pdf");
    if (!input) return;

    setTimeout(() => {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        if (canvas.width === 0 || canvas.height === 0) return;
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("laporan-keuangan.pdf");
      });
    }, 100);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarMonthIcon sx={{ fontSize: 36, color: "#1976d2", mr: 2 }} />
                <Typography variant="h4" fontWeight="bold" color="primary">
                  Laporan Keuangan
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
                <TextField
                  label="Tanggal Mulai (Awal Bulan)"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Tanggal Akhir (Akhir Bulan)"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                >
                  Cari Laporan
                </Button>
                {laporan && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleDownloadPDF}
                    sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                  >
                    Download PDF
                  </Button>
                )}
              </Box>
              {loading && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              )}
              {error && (
                <Typography color="error" sx={{ mt: 3, fontWeight: "bold" }}>
                  {error}
                </Typography>
              )}
              {laporan && (
                <Box id="laporan-keuangan-pdf" sx={{ mt: 4 }}>
                  <Card sx={{ mb: 3, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Pemasukan
                      </Typography>
                      {["tetap", "tidakTetap"].map((key, i) => (
                        <Box
                          key={i}
                          sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                        >
                          <Typography>
                            Donasi {key === "tetap" ? "Tetap" : "Tidak Tetap"}
                          </Typography>
                          <Typography fontWeight="bold">
                            {formatRupiah(laporan.totalPemasukan[key], "+ ")}
                          </Typography>
                        </Box>
                      ))}
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography>Total Pemasukan</Typography>
                        <Typography fontWeight="bold">
                          {formatRupiah(
                            laporan.totalPemasukan.tetap + laporan.totalPemasukan.tidakTetap,
                            "+ "
                          )}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{ mb: 3, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Pengeluaran
                      </Typography>
                      {laporan.laporanPengeluaran.map((item, idx) => {
                        const tgl = item["Tanggal pengeluaran"]
                          ? new Date(item["Tanggal pengeluaran"])
                          : null;
                        const tanggalStr = tgl
                          ? `${tgl.getDate().toString().padStart(2, "0")}/${(tgl.getMonth() + 1)
                              .toString()
                              .padStart(2, "0")}/${tgl.getFullYear()}`
                          : "-";
                        return (
                          <Box
                            key={idx}
                            sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                          >
                            <Box>
                              <Typography fontWeight="bold">{item["Item Aktual"]}</Typography>
                              <Typography variant="body2">
                                Kategori: {item["Kategori"]} | Tanggal: {tanggalStr}
                              </Typography>
                            </Box>
                            <Typography fontWeight="bold" color="error">
                              {item["Harga Aktual"]
                                ? formatRupiah(item["Harga Aktual"], "– ")
                                : "-"}
                            </Typography>
                          </Box>
                        );
                      })}
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography fontWeight="bold">Total Pengeluaran</Typography>
                        <Typography fontWeight="bold" color="error">
                          {formatRupiah(
                            laporan.laporanPengeluaran.reduce(
                              (acc, item) => acc + (item["Harga Aktual"] || 0),
                              0
                            ),
                            "– "
                          )}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Ringkasan Saldo
                      </Typography>
                      {(() => {
                        const pemasukanTotal =
                          laporan.totalPemasukan.tetap + laporan.totalPemasukan.tidakTetap;
                        const pengeluaranTotal = laporan.laporanPengeluaran.reduce(
                          (acc, item) => acc + (item["Harga Aktual"] || 0),
                          0
                        );
                        const saldoAkhir = pemasukanTotal - pengeluaranTotal;
                        const totalSaldoAkhir = laporan.saldoAwal + saldoAkhir;

                        return (
                          <>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography>Saldo Awal</Typography>
                              <Typography fontWeight="bold">
                                {formatRupiah(laporan.saldoAwal)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography>Total Pemasukan</Typography>
                              <Typography fontWeight="bold">
                                {formatRupiah(pemasukanTotal, "+ ")}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography>Total Pengeluaran</Typography>
                              <Typography fontWeight="bold" color="error">
                                {formatRupiah(pengeluaranTotal, "– ")}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography>Saldo Akhir</Typography>
                              <Typography fontWeight="bold">
                                {formatRupiah(saldoAkhir, "= ")}
                              </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography>Total Saldo Akhir</Typography>
                              <Typography fontWeight="bold" color="success.main">
                                {formatRupiah(totalSaldoAkhir, "= ")}
                              </Typography>
                            </Box>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default LaporanDonasi;
