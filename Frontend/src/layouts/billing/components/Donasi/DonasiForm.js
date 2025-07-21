import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormHelperText,
  Alert,
  Stack,
} from "@mui/material";
import axios from "axios";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
const schemaTidakTetap = yup.object().shape({
  nama: yup.string().required("Nama wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  alamat: yup.string().required("Alamat wajib diisi"),
  noTelepon: yup.string().required("No telepon wajib diisi"),
  nominal: yup
    .number()
    .typeError("Nominal harus angka")
    .positive("Nominal harus positif")
    .required("Nominal wajib diisi"),
  doaPilihan: yup.array().min(1, "Pilih minimal satu doa").required("Doa wajib diisi"),
  doaSpesific: yup.string(),
});

const schemaTetap = yup.object().shape({
  nominal: yup
    .number()
    .typeError("Nominal harus angka")
    .positive("Nominal harus positif")
    .required("Nominal wajib diisi"),
  doaPilihan: yup.array().min(1, "Pilih minimal satu doa").required("Doa wajib diisi"),
  doaSpesific: yup.string(),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function DonationForm() {
  const [isDonaturTetap, setIsDonaturTetap] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [nominal, setNominal] = useState("");
  const [doaList, setDoaList] = useState([]);
  const [doaPilihan, setDoaPilihan] = useState([]);
  const [doaSpesific, setDoaSpesific] = useState("");
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Cek token dan decode untuk cek donatur tetap
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token payload:", decoded);
        if (decoded.id_user) setIsDonaturTetap(true);
      } catch {
        setIsDonaturTetap(false);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch doa dari API
    axios
      .get("http://localhost:3000/api/doa") // sesuaikan url backend-mu
      .then((res) => setDoaList(res.data))
      .catch(() => setDoaList([]));
  }, []);

  const validate = async () => {
    try {
      if (isDonaturTetap) {
        await schemaTetap.validate(
          { nominal: Number(nominal), doaPilihan, doaSpesific },
          { abortEarly: false }
        );
      } else {
        await schemaTidakTetap.validate(
          {
            nama,
            email,
            alamat,
            noTelepon,
            nominal: Number(nominal),
            doaPilihan,
            doaSpesific,
          },
          { abortEarly: false }
        );
      }
      setErrors({});
      return true;
    } catch (err) {
      const formErrors = {};
      err.inner.forEach((e) => {
        formErrors[e.path] = e.message;
      });
      setErrors(formErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate();
    if (!isValid) return;

    const payload = isDonaturTetap
      ? {
          jenis_donatur: "Tetap",
          nominal: Number(nominal),
          doa_pilihan: doaPilihan,
          doa_spesific: doaSpesific,
        }
      : {
          jenis_donatur: "Tidak Tetap",
          nama,
          email,
          alamat,
          no_telepon: noTelepon,
          nominal: Number(nominal),
          doa_pilihan: doaPilihan,
          doa_spesific: doaSpesific,
        };

    try {
      const url = isDonaturTetap
        ? "http://localhost:3000/api/donasi"
        : "http://localhost:3000/api/donasi/tidak-tetap";

      const headers = {};
      if (isDonaturTetap) {
        const token = localStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.post(url, payload, { headers });
      console.log("Response from server:", res.data);
      localStorage.setItem("donasiId", res.data.data.donasiId);
      localStorage.setItem("tipeDonatur", res.data.data.jenisDonatur);
      console.log("Jenis Donatur:", res.data.data.jenisDonatur);

      setSubmitStatus({ success: true, message: "Donasi berhasil dibuat!" });
      // Reset form jika ingin
      setNominal("");
      setDoaPilihan([]);
      setDoaSpesific("");
      if (!isDonaturTetap) {
        setNama("");
        setEmail("");
        setAlamat("");
        setNoTelepon("");
      }
      window.location.href = "/payment/" + res.data.data.token;
    } catch (error) {
      console.error(error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || "Terjadi kesalahan saat submit donasi.",
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 600,
          margin: "auto",
          padding: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
        }}
        noValidate
      >
        <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
          Form Donasi
        </Typography>

        {!isDonaturTetap && (
          <>
            <TextField
              label="Nama"
              fullWidth
              margin="normal"
              value={nama}
              required
              onChange={(e) => setNama(e.target.value)}
              error={Boolean(errors.nama)}
              helperText={errors.nama}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <TextField
              label="Alamat"
              fullWidth
              margin="normal"
              multiline
              required
              minRows={2}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              error={Boolean(errors.alamat)}
              helperText={errors.alamat}
            />
            <TextField
              label="No Telepon"
              fullWidth
              margin="normal"
              required
              value={noTelepon}
              onChange={(e) => setNoTelepon(e.target.value)}
              error={Boolean(errors.noTelepon)}
              helperText={errors.noTelepon}
            />
          </>
        )}

        <TextField
          label="Nominal Donasi"
          type="number"
          fullWidth
          required
          margin="normal"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
          error={Boolean(errors.nominal)}
          helperText={errors.nominal}
        />

        <FormControl fullWidth margin="normal" error={Boolean(errors.doaPilihan)}>
          <InputLabel id="doa-pilihan-label">Pilih Doa</InputLabel>
          <Select
            labelId="doa-pilihan-label"
            multiple
            required
            value={doaPilihan}
            onChange={(e) =>
              setDoaPilihan(
                typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value
              )
            }
            input={<OutlinedInput label="Daftar Doa Pilihan" />}
            renderValue={(selected) =>
              doaList
                .filter((doa) => selected.includes(doa.id_doa))
                .map((doa) => doa.nama_doa)
                .join(", ")
            }
            MenuProps={MenuProps}
          >
            {doaList.map((doa) => (
              <MenuItem key={doa.id_doa} value={doa.id_doa}>
                <Checkbox checked={doaPilihan.indexOf(doa.id_doa) > -1} />
                <ListItemText primary={doa.nama_doa} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.doaPilihan}</FormHelperText>
        </FormControl>

        <TextField
          label="Doa Khusus (Opsional)"
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          value={doaSpesific}
          onChange={(e) => setDoaSpesific(e.target.value)}
        />

        <Stack mt={3} spacing={2}>
          <Button variant="contained" type="submit" size="large" fullWidth>
            Kirim Donasi
          </Button>

          {submitStatus && (
            <Alert severity={submitStatus.success ? "success" : "error"}>
              {submitStatus.message}
            </Alert>
          )}
        </Stack>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}
