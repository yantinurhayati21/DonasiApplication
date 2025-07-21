import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography } from "@mui/material";

const SnapPayment = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-I98qkLjSbupoiE_R");
    document.body.appendChild(script);

    const donasiId = localStorage.getItem("donasiId");

    script.onload = () => {
      setLoading(true);
      window.snap.pay(token, {
        onSuccess: async function (result) {
          try {
            // Update status donasi ke backend
            await axios.put(`http://localhost:3000/api/donasi/${donasiId}`, {
              status_donasi: "Done",
            });
            setIsDone(true);
            localStorage.removeItem("donasiId");
            setOpenDialog(true); // buka dialog ucapan terima kasih
          } catch (error) {
            alert("Gagal memperbarui status donasi.");
            console.error(error);
          }
        },
        onPending: function (result) {
          alert("Pembayaran dalam proses: " + JSON.stringify(result));
        },
        onError: function (result) {
          alert("Pembayaran gagal: " + JSON.stringify(result));
        },
      });
    };
  }, [token]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    const tipeDonatur = localStorage.getItem("tipeDonatur");

    if (tipeDonatur === "Tetap") {
      navigate("/dashboard-donatur");
    } else {
      navigate("/dashboard");
    }
  };

  if (!token) {
    return <div>Token belum tersedia. Harap coba lagi.</div>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: 3,
      }}
    >
      {isDone ? (
        <>
          {/* Mengubah ukuran dialog dengan width dan height yang lebih besar */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
              Terima Kasih!
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" align="center" color="textPrimary">
                Pembayaran donasi Anda telah berhasil.
              </Typography>
              <Typography variant="body1" align="center" color="textSecondary" sx={{ mt: 2 }}>
                Terima kasih atas donasi Anda yang sangat berarti. Kami akan segera memprosesnya.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Button variant="contained" onClick={handleCloseDialog} color="primary">
                Tutup
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="textSecondary" gutterBottom>
              Menunggu pembayaran...
            </Typography>
            <CircularProgress size={60} color="primary" />
          </Box>
        </>
      )}
    </Box>
  );
};

export default SnapPayment;
