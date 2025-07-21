import React, { useState } from "react";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Donasi Application React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

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
    statusAktif: true, // Status aktif defaultnya true
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/donatur/register", formData);
      // if (response.data.status === "success") {
      // Menyimpan token di localStorage setelah pendaftaran berhasil
      // localStorage.setItem("token", response.data.token);
      alert("Pendaftaran berhasil!");
      // Anda bisa melakukan redirect atau pengalihan setelah sukses
      location.href = "/authentication/sign-in";
      // }
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
            Masukkan informasi Anda untuk mendaftar
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nama"
                variant="standard"
                fullWidth
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Alamat"
                variant="standard"
                fullWidth
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nomor Telepon"
                variant="standard"
                fullWidth
                name="no_telepon"
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
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
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
    </CoverLayout>
  );
}

export default Cover;
