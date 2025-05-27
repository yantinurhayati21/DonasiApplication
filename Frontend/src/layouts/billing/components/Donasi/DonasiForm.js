import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import axios from "axios";

const DonasiForm = () => {
  const [jenisDonatur, setJenisDonatur] = useState("Tidak Tetap");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [nominal, setNominal] = useState("");
  const [password, setPassword] = useState(""); // Tambahkan state untuk password
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nominal || isNaN(nominal) || nominal <= 0) {
      setErrorMessage("Nominal donasi tidak valid");
      return;
    }
    if (jenisDonatur !== "Tetap" && jenisDonatur !== "Tidak Tetap") {
      setErrorMessage("Jenis donatur tidak valid");
      return;
    }
    const donasiData = {
      jenis_donatur: jenisDonatur,
      nama: nama,
      email: email,
      alamat: alamat,
      no_telepon: noTelepon,
      nominal: nominal,
      tanggal_donasi: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post("http://localhost:3000/api/donasi/payment", donasiData, {
        withCredentials: true,
      });
      setToken(response.data.data.token);
      localStorage.setItem("donasiData", JSON.stringify(donasiData));
      location.href = "/payment/" + response.data.data.token;
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating transaction", error);
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Form Donasi
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Jenis Donatur */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Jenis Donatur</InputLabel>
              <Select
                value={jenisDonatur}
                onChange={(e) => setJenisDonatur(e.target.value)}
                label="Jenis Donatur"
                required
              >
                <MenuItem value="Tetap">Donatur Tetap</MenuItem>
                <MenuItem value="Tidak Tetap">Donatur Tidak Tetap</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Nama */}
          {jenisDonatur === "Tidak Tetap" && (
            <Grid item xs={12}>
              <TextField
                label="Nama"
                variant="outlined"
                fullWidth
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </Grid>
          )}

          {/* Email */}
          {jenisDonatur === "Tidak Tetap" && (
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
          )}

          {/* Alamat */}
          {jenisDonatur === "Tidak Tetap" && (
            <Grid item xs={12}>
              <TextField
                label="Alamat"
                variant="outlined"
                fullWidth
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                required
              />
            </Grid>
          )}

          {/* No Telepon */}
          {jenisDonatur === "Tidak Tetap" && (
            <Grid item xs={12}>
              <TextField
                label="No Telepon"
                variant="outlined"
                fullWidth
                value={noTelepon}
                onChange={(e) => setNoTelepon(e.target.value)}
                required
              />
            </Grid>
          )}

          {/* Password - Hanya tampil jika Donatur Tetap */}
          {jenisDonatur === "Tetap" && (
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
          )}

          {/* Nominal Donasi */}
          <Grid item xs={12}>
            <TextField
              label="Nominal"
              variant="outlined"
              fullWidth
              type="number"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              required
            />
          </Grid>

          {/* Tombol Kirim */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ padding: "10px" }}
            >
              Kirim
            </Button>
          </Grid>
        </Grid>

        {/* Menampilkan Pesan Error */}
        {errorMessage && (
          <Typography color="error" align="center">
            {errorMessage}
          </Typography>
        )}
      </form>
    </Container>
  );
};

export default DonasiForm;
