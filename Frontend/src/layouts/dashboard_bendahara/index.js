import React, { useEffect, useState } from "react";
import { Grid, Card, Button, Typography, Box, Container, Badge } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import io from "socket.io-client";
import MDSnackbar from "components/MDSnackbar"; // Sesuaikan dengan folder komponen

const BendaharaDashboard = () => {
  const [notifikasi, setNotifikasi] = useState([]);
  const [infoSB, setInfoSB] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5000");

    // Mendengarkan notifikasi untuk Bendahara
    socket.on("new-pengajuan-bendahara", (data) => {
      setMessage(data.pesan);
      setNotifikasi((prevNotifikasi) => [...prevNotifikasi, data]);
      setInfoSB(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const closeInfoSB = () => setInfoSB(false);

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
    <Container>
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Dashboard Bendahara
        </Typography>

        <Grid container spacing={3}>
          {/* Section for Notifikasi */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box p={3}>
                <Typography variant="h6" color="textSecondary">
                  Notifikasi Pengajuan
                </Typography>
                {notifikasi.length === 0 ? (
                  <Typography variant="body1">Tidak ada pengajuan baru.</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {notifikasi.map((item, index) => (
                      <Grid item xs={12} key={index}>
                        <Card sx={{ padding: 2, border: "1px solid #ddd", borderRadius: 1 }}>
                          <Typography variant="body2">
                            <strong>{item.pesan}</strong> (ID Pengajuan: {item.id_pengajuan})
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Section for Simulate New Pengajuan */}
          <Grid item xs={12} md={6}>
            <Card>
              <Box p={3} display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h6" color="textSecondary">
                  Simulasikan Pengajuan Baru
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  onClick={() => {
                    // Men-trigger pengajuan baru dan notifikasi untuk Bendahara
                    setMessage("Ada pengajuan baru yang perlu disetujui.");
                    setNotifikasi([
                      ...notifikasi,
                      {
                        pesan: "Pengajuan dengan ID 123 memerlukan persetujuan Bendahara.",
                        id_pengajuan: 123,
                      },
                    ]);
                    setInfoSB(true); // Simulasikan notifikasi info
                  }}
                >
                  Simulasikan Pengajuan Baru
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Menambahkan ikon lonceng dengan badge */}
      <Box sx={{ position: "absolute", top: 10, right: 10 }}>
        <Badge
          badgeContent={notifikasi.length} // Menampilkan jumlah notifikasi
          color="error"
        >
          <NotificationsIcon fontSize="large" />
        </Badge>
      </Box>

      {renderInfoSB}
    </Container>
  );
};

export default BendaharaDashboard;
