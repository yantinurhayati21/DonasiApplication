import React, { useEffect } from "react";
import { Grid, Typography, Button, Container, Box, Stack, Link } from "@mui/material";
import Footer from "examples/Footer";
import Slider from "react-slick";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
    afterChange: (current) => setCurrentSlide(current),
  };

  const slides = [
    {
      img: "/images/pendidikan-agama.jpeg",
      title: "Pendidikan Agama & Umum",
      desc: "Pembelajaran intensif Al-Qur’an, fiqh, serta pelajaran umum untuk membentuk karakter unggul.",
    },
    {
      img: "/images/pelatihan-kewirausahaan.jpeg",
      title: "Pelatihan Kewirausahaan",
      desc: "Program pengembangan keterampilan usaha agar santri dapat mandiri secara ekonomi.",
    },
    {
      img: "/images/kegiatan-sosial.jpeg",
      title: "Kegiatan Sosial & Pengabdian",
      desc: "Aksi sosial dan pelayanan masyarakat sebagai bentuk pengamalan ilmu dan kepedulian sosial.",
    },
  ];

  // currentSlide state sudah dipindahkan ke atas agar afterChange bekerja benar

  useEffect(() => {
    // Check token and decode to check donor status
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Redirect to donor dashboard if the user is a donor
        if (decoded.id_user) window.location.href = "/dashboard-donatur";
      } catch {
        console.error("Invalid token: id_user not found");
      }
    }
  }, []);

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header with Login */}
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
        </Stack>
      </Box>

      {/* Hero Banner */}
      <Box
        sx={{
          backgroundImage: "url('/images/background-donasi.jpg')",
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

      {/* Profil Pesantren */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" color="primary" textAlign="center" mb={4} fontWeight="medium">
            Profil Pesantren
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="justify" mb={3}>
            Istana Yatim Dhuafa berdiri sejak 2013 di Sariwangi, Bandung Barat, sebagai tempat untuk
            anak-anak yatim dan dhuafa yang membutuhkan kasih sayang dan pendidikan. Dengan
            fasilitas sederhana, pesantren ini memberikan pendidikan dari SD hingga SMA,
            mengutamakan pengembangan akhlak dan karakter.
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="justify" mb={3}>
            Dengan dukungan para mujahid dan donatur, Istana Yatim Dhuafa terus berupaya memberikan
            harapan bagi masa depan anak-anak yang terpinggirkan. Setiap kontribusi menjadi bagian
            penting dalam membangun masa depan yang lebih cerah bagi mereka.
          </Typography>

          {/* Call-to-Action for Donatur Tetap */}
          <Box textAlign="center" mt={5}>
            <Typography variant="h6" color="text.primary" mb={3}>
              Bergabunglah menjadi Donatur Tetap dan berikan harapan bagi masa depan anak yatim dan
              dhuafa. Dengan donasi berkala, Anda tidak hanya memberikan bantuan, tetapi juga
              menciptakan perubahan yang lebih berarti bagi kehidupan mereka.
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
              href="/authentication/sign-up"
            >
              Daftar Donatur Tetap
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Kegiatan Pesantren with images */}
      <Box sx={{ bgcolor: "#e3f2fd", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" color="primary" textAlign="center" mb={5} fontWeight="medium">
            Kegiatan-Kegiatan Pesantren
          </Typography>
          <Slider {...carouselSettings}>
            {slides.map((slide, idx) => {
              // Mapping visual position: left, center, right
              let pos = "hidden";
              if (slides.length === 1) {
                pos = "center";
              } else if (slides.length === 2) {
                pos = idx === currentSlide ? "center" : "right";
              } else {
                // react-slick centerMode: currentSlide is always the center
                if (idx === currentSlide) {
                  pos = "center";
                } else if (idx === (currentSlide - 1 + slides.length) % slides.length) {
                  pos = "left";
                } else if (idx === (currentSlide + 1) % slides.length) {
                  pos = "right";
                }
              }
              return (
                <Box
                  key={slide.title}
                  p={2}
                  bgcolor="white"
                  borderRadius={3}
                  boxShadow={2}
                  textAlign="center"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: pos === "hidden" ? 0.3 : 1,
                    // Semua gambar sama besar, tidak ada transform scale
                    transition: "all 0.4s cubic-bezier(.4,2,.6,1)",
                    boxShadow: 2,
                    zIndex: pos === "center" ? 2 : 1,
                    mx: 1,
                    textAlign: "center",
                  }}
                >
                  <img
                    src={slide.img}
                    alt={slide.title}
                    style={{
                      width: "90%",
                      maxWidth: "400px",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                      objectFit: "cover",
                      filter: "none",
                      boxShadow: "0 8px 24px #bbb",
                      transition: "all 0.4s cubic-bezier(.4,2,.6,1)",
                    }}
                  />
                  {pos === "center" && (
                    <>
                      <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                        {slide.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {slide.desc}
                      </Typography>
                    </>
                  )}
                </Box>
              );
            })}
          </Slider>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Dashboard;
