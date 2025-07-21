import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const SnapPayment = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // if (token) {
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
    // }
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Cek tipe donatur (tetap atau tidak) dari localStorage atau state lain
    const tipeDonatur = localStorage.getItem("tipeDonatur"); // misal: "tetap" atau "tidak"

    if (tipeDonatur === "Tetap") {
      navigate("/dashboard-donatur");
    } else {
      navigate("/dashboard");
    }
  };

  if (!token) {
    return <div>Token belum tersedia. Harap coba lagi.</div>;
  }

  // if (!loading) {
  //   return <div>Memuat pembayaran...</div>;
  // }

  return (
    <div>
      {isDone ? (
        <>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Terima Kasih!</DialogTitle>
            <DialogContent>Pembayaran donasi Anda telah berhasil.</DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} autoFocus>
                Tutup
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <>
          <h3>Menunggu pembayaran...</h3>
        </>
      )}
    </div>
  );
};

export default SnapPayment;
