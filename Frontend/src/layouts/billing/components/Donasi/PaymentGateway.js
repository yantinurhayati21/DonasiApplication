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

  const [isDone, setIsDone] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isTetap, setIsTetap] = useState(false);

  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-I98qkLjSbupoiE_R");
    document.body.appendChild(script);

    const donasiId = localStorage.getItem("donasiId");

    script.onload = () => {
      window.snap.pay(token, {
        onSuccess: async function () {
          try {
            // Update status donasi ke backend
            await axios.put(`http://localhost:3000/api/donasi/${donasiId}`, {
              status_donasi: "Done",
            });

            setIsDone(true);
            localStorage.removeItem("donasiId");

            const tipeDonatur = localStorage.getItem("tipeDonatur"); // "Tetap" atau "Tidak Tetap"
            setIsTetap(tipeDonatur === "Tetap");
            setOpenDialog(true);
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

    // optional cleanup
    return () => {
      document.body.removeChild(script);
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

  const handleDaftarTetap = () => {
    navigate("/authentication/sign-up");
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
        p: 3,
      }}
    >
      {isDone ? (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>Terima Kasih!</DialogTitle>
          <DialogContent>
            <Typography variant="h6" align="center" color="textPrimary">
              Pembayaran donasi Anda telah berhasil.
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary" sx={{ mt: 2 }}>
              Terima kasih atas donasi Anda yang sangat berarti. Kami akan segera memprosesnya.
            </Typography>

            {!isTetap && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" align="center">
                  Supaya dampak kebaikan Anda berkelanjutan, yuk bergabung menjadi{" "}
                  <strong>Donatur Tetap</strong> 🌟
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", gap: 1, pb: 3 }}>
            {!isTetap && (
              <Button
                variant="contained"
                onClick={handleDaftarTetap}
                sx={{
                  background: "linear-gradient(45deg, #42a5f5, #1e88e5)", // gradasi biru
                  color: "#fff",
                  fontWeight: "bold",
                  px: 3,
                  "&:hover": {
                    background: "linear-gradient(45deg, #64b5f6, #2196f3)",
                  },
                }}
              >
                Daftar Donatur Tetap
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              sx={{
                backgroundColor: "white",
                color: "#1e88e5",
                border: "2px solid #42a5f5",
                fontWeight: "bold",
                px: 3,
                "&:hover": {
                  backgroundColor: "#e3f2fd", // biru muda soft saat hover
                },
              }}
            >
              {isTetap ? "Tutup" : "Nanti Saja"}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" color="textSecondary" gutterBottom>
            Menunggu pembayaran...
          </Typography>
          <CircularProgress size={60} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default SnapPayment;
