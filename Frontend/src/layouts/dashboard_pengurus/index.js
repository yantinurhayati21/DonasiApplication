import { useState, useEffect } from "react";
import axios from "axios";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";

// Donasi Application React components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Dashboard components
import Projects from "layouts/dashboard_pengurus/components/Projects";
import OrdersOverview from "layouts/dashboard_pengurus/components/OrdersOverview";

function PengurusDashboard() {
  // State untuk menyimpan data dari backend
  const [dashboardData, setDashboardData] = useState({
    donaturTetap: 0,
    totalDonasi: 0,
    totalPengeluaran: 0,
    saldo: 0,
  });

  // Ambil data dari backend saat komponen di-mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Ganti dengan URL API backend Anda
        const response = await axios.get("http://localhost:3000/api/dashboard");

        // Perbarui state dengan data yang diterima
        setDashboardData({
          donaturTetap: response.data.donaturTetap,
          totalDonasi: response.data.totalDonasi,
          totalPengeluaran: response.data.totalPengeluaran,
          saldo: response.data.saldo,
        });
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Statistik Donatur Tetap */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon={<PeopleIcon />}
                title="Donatur Tetap"
                count={dashboardData.donaturTetap}
                percentage={{
                  color: "success",
                }}
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  padding: 2,
                  backgroundColor: "#333",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "#444",
                  },
                }}
              />
            </MDBox>
          </Grid>

          {/* Statistik Total Donasi */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon={<AttachMoneyIcon />}
                title="Total Donasi"
                count={formatRupiah(dashboardData.totalDonasi)} // Format Rp
                percentage={{
                  color: "success",
                }}
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  padding: 2,
                  backgroundColor: "#1e88e5",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "#1565c0",
                  },
                }}
              />
            </MDBox>
          </Grid>

          {/* Statistik Total Pengeluaran */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<MonetizationOnIcon />}
                title="Total Pengeluaran"
                count={formatRupiah(dashboardData.totalPengeluaran)} // Format Rp
                percentage={{
                  color: "success",
                }}
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  padding: 2,
                  backgroundColor: "#28a745",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "#218838",
                  },
                }}
              />
            </MDBox>
          </Grid>

          {/* Statistik Saldo Sekarang */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<AccountBalanceIcon />}
                title="Saldo Sekarang"
                count={formatRupiah(dashboardData.saldo)} // Format Rp
                percentage={{
                  color: "success",
                }}
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  padding: 2,
                  backgroundColor: "#ff9800",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                    backgroundColor: "#fb8c00",
                  },
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* Bagian lain dari dashboard */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default PengurusDashboard;
