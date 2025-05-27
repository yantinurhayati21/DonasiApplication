import React from "react";
import { Grid, Typography, Button, Container, Box, Stack, Link } from "@mui/material";
import Footer from "examples/Footer";
import Slider from "react-slick";

const Dashboard = () => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header with Login / Sign Up */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          px: 4,
          py: 2,
          bgcolor: "white",
          boxShadow: 1,
        }}
      >
        <Stack direction="row" spacing={3}>
          <Link
            href="/authentication/sign-in"
            underline="none"
            sx={{ fontWeight: "bold", color: "primary.main", fontSize: "1rem" }}
          >
            Login
          </Link>
          <Link
            href="/authentication/sign-up"
            underline="none"
            sx={{ fontWeight: "bold", color: "primary.main", fontSize: "1rem" }}
          >
            Sign Up
          </Link>
        </Stack>
      </Box>

      {/* Hero Banner */}
      <Box
        sx={{
          backgroundImage: "url('/images/hero-donasi.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
          py: { xs: 12, md: 18 },
          px: 4,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
          }}
        />
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          >
            Bantu Masa Depan Mereka
          </Typography>
          <Typography variant="h6" mb={5} sx={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}>
            Donasi Anda berarti harapan baru untuk anak yatim dan dhuafa. Mari bersama kita wujudkan
            pesantren mandiri dan berdaya.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#ff7043",
              color: "#fff",
              borderRadius: "8px",
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1.1rem",
              ":hover": {
                backgroundColor: "#ff5722",
              },
            }}
            href="/donasi"
          >
            Donasi Sekarang
          </Button>
        </Container>
      </Box>

      {/* Pembukaan Penerimaan Donasi */}
      <Box sx={{ bgcolor: "#fff3e0", py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" textAlign="center" fontWeight="medium" mb={3} color="primary">
            Pembukaan Penerimaan Donasi
          </Typography>
          <Typography variant="body1" textAlign="center" mb={3} px={{ xs: 2, md: 8 }}>
            Saat ini kami membuka kesempatan bagi Anda untuk ikut berpartisipasi dalam program
            donasi untuk membangun fasilitas pendidikan dan kesejahteraan anak yatim. Donasi Anda
            sangat berarti dan akan langsung kami salurkan secara transparan.
          </Typography>
          <Box textAlign="center">
            <Button
              variant="outlined"
              size="large"
              href="/donasi"
              sx={{ borderColor: "primary.main", color: "primary.main", fontWeight: "bold" }}
            >
              Info Donasi Lengkap
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Tentang Program */}
      <Box sx={{ backgroundColor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" fontWeight="medium" mb={6}>
            Tentang Program Kami
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box p={4} borderRadius={3} boxShadow={3} textAlign="center" height="100%">
                <Typography variant="h5" color="primary" gutterBottom>
                  Pesantren Berdaya
                </Typography>
                <Typography variant="body2" mt={1}>
                  Fasilitasi pendidikan dan kewirausahaan untuk menciptakan pesantren yang mandiri
                  dan berdaya saing.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box p={4} borderRadius={3} boxShadow={3} textAlign="center" height="100%">
                <Typography variant="h5" color="primary" gutterBottom>
                  Anak Yatim & Dhuafa
                </Typography>
                <Typography variant="body2" mt={1}>
                  Pemberian bantuan untuk kebutuhan pokok, pendidikan, dan pembinaan karakter bagi
                  mereka yang membutuhkan.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box p={4} borderRadius={3} boxShadow={3} textAlign="center" height="100%">
                <Typography variant="h5" color="primary" gutterBottom>
                  Transparansi Dana
                </Typography>
                <Typography variant="body2" mt={1}>
                  Kami memberikan laporan rutin agar Anda dapat melihat dampak nyata dari setiap
                  kontribusi Anda.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Kegiatan Pesantren */}
      <Box sx={{ bgcolor: "#e3f2fd", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" color="primary" textAlign="center" mb={5} fontWeight="medium">
            Kegiatan-Kegiatan Pesantren
          </Typography>
          <Slider {...carouselSettings}>
            <Box p={3} bgcolor="white" borderRadius={3} boxShadow={2} textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                Pendidikan Agama & Umum
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pembelajaran intensif Al-Qur’an, fiqh, serta pelajaran umum untuk membentuk karakter
                unggul.
              </Typography>
            </Box>
            <Box p={3} bgcolor="white" borderRadius={3} boxShadow={2} textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                Pelatihan Kewirausahaan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Program pengembangan keterampilan usaha agar santri dapat mandiri secara ekonomi.
              </Typography>
            </Box>
            <Box p={3} bgcolor="white" borderRadius={3} boxShadow={2} textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                Kegiatan Sosial & Pengabdian
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aksi sosial dan pelayanan masyarakat sebagai bentuk pengamalan ilmu dan kepedulian
                sosial.
              </Typography>
            </Box>
          </Slider>
        </Container>
      </Box>

      {/* Profil Pesantren */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" color="primary" textAlign="center" mb={4} fontWeight="medium">
            Profil Pesantren
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="justify" mb={3}>
            Pesantren kami berdiri sejak tahun 1995 dengan visi menciptakan generasi muda yang
            berakhlak mulia, mandiri, dan berdaya saing. Kami mengutamakan pendidikan agama yang
            kuat serta pengembangan keterampilan hidup yang aplikatif.
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="justify">
            Dengan dukungan para donatur dan masyarakat, pesantren terus berkembang menjadi pusat
            pendidikan dan pengembangan karakter yang mampu menjawab tantangan zaman serta membantu
            anak-anak yatim dan dhuafa meraih masa depan lebih cerah.
          </Typography>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Dashboard;
