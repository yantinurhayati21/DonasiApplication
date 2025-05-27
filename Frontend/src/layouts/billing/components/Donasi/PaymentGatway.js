/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SnapPayment = () => {
  const param = useParams();
  const token = param.token;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (token) {
      // Load Midtrans Snap API script
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", "SB-Mid-client-I98qkLjSbupoiE_R");
      document.body.appendChild(script);

      script.onload = () => {
        setLoading(true);
        // Inisialisasi Snap untuk pembayaran
        window.snap.pay(token, {
          onSuccess: async function (result) {
            // alert("Pembayaran berhasil: " + JSON.stringify(result));
            const data = JSON.parse(localStorage.getItem("donasiData"));
            const res = await axios.post("http://localhost:3000/api/donasi", data);
            console.log(res);
            location.href = "/";
          },
          onPending: function (result) {
            alert("Pembayaran dalam proses: " + JSON.stringify(result));
          },
          onError: function (result) {
            alert("Pembayaran gagal: " + JSON.stringify(result));
          },
        });
      };
    }
  }, [token]);

  if (!token) {
    return <div>Token belum tersedia. Harap coba lagi.</div>;
  }

  if (!loading) {
    return <div>Memuat pembayaran...</div>;
  }

  return (
    <div>
      <h3>Menunggu pembayaran...</h3>
      {/* Kamu bisa menambahkan UI seperti tombol atau progress */}
    </div>
  );
};

export default SnapPayment;
