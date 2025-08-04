import React, { useState } from "react";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Donasi Application React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    alamat: "",
    no_telepon: "",
    statusAktif: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.statusAktif) {
      setErrorMessage("Anda harus menyetujui Syarat dan Ketentuan.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/donatur/register", formData);
      alert("Pendaftaran berhasil!");
      location.href = "/authentication/sign-in";
    } catch (error) {
      setErrorMessage("Gagal mendaftar, coba lagi.");
      console.error("Error during registration:", error);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Daftar Donatur Tetap
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Masukkan informasi Anda untuk mendaftar jadi donatur tetap
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nama"
                name="nama"
                fullWidth
                required
                value={formData.nama}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Alamat"
                name="alamat"
                fullWidth
                required
                value={formData.alamat}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nomor Telepon"
                name="no_telepon"
                fullWidth
                required
                value={formData.no_telepon}
                onChange={handleChange}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox
                checked={formData.statusAktif}
                onChange={(e) => setFormData({ ...formData, statusAktif: e.target.checked })}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Saya setuju dengan&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
                onClick={() => setShowTermsModal(true)}
              >
                Syarat dan Ketentuan
              </MDTypography>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Daftar
              </MDButton>
            </MDBox>

            {errorMessage && (
              <MDTypography variant="button" color="error" align="center" mt={2}>
                {errorMessage}
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      </Card>

      {/* Pop-up Syarat dan Ketentuan */}
      <Dialog
        open={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Syarat dan Ketentuan</DialogTitle>
        <DialogContent dividers>
          <MDTypography variant="h6" style={{ color: "#000", marginBottom: "8px" }}>
            Informasi Program Donatur Tetap
          </MDTypography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Program Donatur Tetap adalah inisiatif yang memungkinkan individu berkontribusi secara berkala setiap bulan untuk mendukung berbagai kegiatan sosial dan kemanusiaan."
                primaryTypographyProps={{ style: { color: "#000" } }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Dengan menjadi Donatur Tetap, Anda turut berperan aktif dalam menjaga keberlangsungan program bantuan yang berkelanjutan."
                primaryTypographyProps={{ style: { color: "#000" } }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Donatur akan menerima laporan penggunaan dana dan transparansi kegiatan secara berkala."
                primaryTypographyProps={{ style: { color: "#000" } }}
              />
            </ListItem>
          </List>

          <MDTypography
            variant="h6"
            style={{ color: "#000", marginTop: "16px", marginBottom: "8px" }}
          >
            Syarat dan Ketentuan
          </MDTypography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Donatur wajib memberikan data pribadi yang benar dan dapat dipertanggungjawabkan."
                primaryTypographyProps={{ style: { color: "#000" } }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Dana yang diberikan bersifat sukarela dan tidak dapat dikembalikan."
                primaryTypographyProps={{ style: { color: "#000" } }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Donatur setuju untuk berdonasi secara berkala setiap bulan sebagai bentuk komitmen mendukung program."
                primaryTypographyProps={{ style: { color: "#000" } }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Donatur yang aktif akan mendapatkan akses ke laporan keuangan dan laporan penggunaan donasi setiap bulan."
                primaryTypographyProps={{ style: { color: "#000" } }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Data pribadi donatur akan dilindungi sesuai dengan kebijakan privasi yang berlaku."
                primaryTypographyProps={{ style: { color: "#000" } }}
              />
            </ListItem>
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowTermsModal(false)} color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </CoverLayout>
  );
}

export default Cover;
