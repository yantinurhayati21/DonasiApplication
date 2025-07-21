import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress, Container } from "@mui/material";
import { getLaporanKeuangan } from "services/laporanService"; // Assuming you have a service to fetch laporan data

const LaporanDonasi = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [laporan, setLaporan] = useState(null);
  const [error, setError] = useState(null);

  // Handle the form submission for search
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError("Silakan pilih rentang tanggal terlebih dahulu.");
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

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Laporan Keuangan Donasi
        </Typography>

        {/* Input form for Date Filter */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Tanggal Mulai"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Tanggal Akhir"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </Box>

        {/* Button to trigger search */}
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Cari Laporan
        </Button>

        {/* Display loading spinner */}
        {loading && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {/* Display error */}
        {error && (
          <Typography color="error" sx={{ mt: 3 }}>
            {error}
          </Typography>
        )}

        {/* Display laporan data */}
        {laporan && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Laporan Pemasukan
            </Typography>
            <Typography variant="body1">
              Donasi Tetap: Rp {laporan.totalPemasukan.tetap.toLocaleString("id-ID")}
            </Typography>
            <Typography variant="body1">
              Donasi Tidak Tetap: Rp {laporan.totalPemasukan.tidakTetap.toLocaleString("id-ID")}
            </Typography>
            <Typography variant="body1">
              Total Pemasukan: Rp{" "}
              {(laporan.totalPemasukan.tetap + laporan.totalPemasukan.tidakTetap).toLocaleString(
                "id-ID"
              )}
            </Typography>

            <Typography variant="h5" sx={{ mt: 4 }} gutterBottom>
              Laporan Pengeluaran
            </Typography>
            {laporan.laporanPengeluaran.length > 0 ? (
              <Box>
                {laporan.laporanPengeluaran.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      {item["Nama Barang"]}:{" "}
                      {item["Harga Aktual"]
                        ? `Rp ${item["Harga Aktual"].toLocaleString("id-ID")}`
                        : "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Kategori: {item["Kategori"]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Tidak ada pengeluaran untuk periode ini.
              </Typography>
            )}

            <Typography variant="h5" sx={{ mt: 4 }} gutterBottom>
              Saldo Awal dan Saldo Akhir
            </Typography>
            <Typography variant="body1">
              Saldo Awal: Rp {laporan.saldoAwal.toLocaleString("id-ID")}
            </Typography>
            <Typography variant="body1">
              Saldo Akhir: Rp {laporan.saldoAkhir.toLocaleString("id-ID")}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default LaporanDonasi;
