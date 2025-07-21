// Donasi Application React layouts
import Dashboard from "layouts/dashboard";
import DashboardBendahara from "layouts/dashboard_bendahara";
import DashboardPimpinan from "layouts/dashboard_pimpinan";
import DashboardDonatur from "layouts/dashboard_donatur";
import DashboardPengurus from "layouts/dashboard_pengurus";
import ListPengajuan from "layouts/dashboard_pengurus/listPengajuan";
import ListPengajuanPimpinan from "layouts/dashboard_pimpinan/listPengajuanPimpinan";
import ListPengajuanBendahara from "layouts/dashboard_bendahara/listPengajuanBendahara";
import DonasiForm from "layouts/billing/components/Donasi/DonasiForm";
import Donatur from "layouts/donatur";
import PengajuanPengeluaran from "layouts/pengajuanPengeluaran/PengajuanForm";
// import Pengeluaran from "layouts/pengeluaran";
// import LaporanKeuangan from "layouts/laporanKeuangan";
import Doa from "layouts/doa/index";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
// import PaymentGatway from "layouts/billing/components/Donasi/PaymentGatway.js";

// @mui icons
import Icon from "@mui/material/Icon";
import SnapPayment from "layouts/billing/components/Donasi/PaymentGateway";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Dashboard Bendahara",
    key: "dashboard_bendahara",
    icon: <Icon fontSize="small">account_balance_wallet</Icon>,
    route: "/dashboard-bendahara",
    component: <DashboardBendahara />,
  },
  {
    type: "collapse",
    name: "Dashboard Pimpinan",
    key: "dashboard_pimpinan",
    icon: <Icon fontSize="small">business</Icon>,
    route: "/dashboard-pimpinan",
    component: <DashboardPimpinan />,
  },
  {
    type: "collapse",
    name: "Dashboard Pengurus",
    key: "dashboard_pengurus",
    icon: <Icon fontSize="small">supervised_user_circle</Icon>,
    route: "/dashboard-pengurus",
    component: <DashboardPengurus />,
  },
  {
    type: "collapse",
    name: "List Pengajuan Pengeluaran",
    key: "list_pengajuan",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/list-pengajuan",
    component: <ListPengajuan />,
  },
  {
    type: "collapse",
    name: "Dashboard Donatur",
    key: "dashboard_donatur",
    icon: <Icon fontSize="small">favorite</Icon>,
    route: "/dashboard-donatur",
    component: <DashboardDonatur />,
  },
  {
    type: "collapse",
    name: "List Pengajuan Pengeluaran",
    key: "list_pengajuan_pimpinan",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/list-pengajuan-pimpinan",
    component: <ListPengajuanPimpinan />,
  },
  {
    type: "collapse",
    name: "List Pengajuan Pengeluaran",
    key: "list_pengajuan_bendahara",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/list-pengajuan-bendara",
    component: <ListPengajuanBendahara />,
  },
  // {
  //   type: "collapse",
  //   name: "Donatur",
  //   key: "donatur",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/donatur",
  //   component: <Donatur />,
  // },
  // {
  //   type: "collapse",
  //   name: "Pengeluaran",
  //   key: "pengeluaran",
  //   icon: <Icon fontSize="small">pengeluaran</Icon>,
  //   route: "/pengeluaran",
  //   component: <Pengeluaran />,
  // },
  {
    type: "collapse",
    name: "Payment Gateway",
    key: "paymentGateway",
    icon: <Icon fontSize="small">attach_money</Icon>,
    route: "/payment/:token",
    component: <SnapPayment />,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">Tables</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Donasi",
    key: "donasi",
    icon: <Icon fontSize="small">attach_money</Icon>,
    route: "/donasi",
    component: <DonasiForm />,
  },
  {
    type: "collapse",
    name: "Donatur",
    key: "donatur",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/donatur",
    component: <Donatur />,
  },
  {
    type: "collapse",
    name: "Pengajuan Pengeluaran",
    key: "pengajuan-pengeluaran",
    icon: <Icon fontSize="small">request_page</Icon>,
    route: "/pengajuan-pengeluaran",
    component: <PengajuanPengeluaran />,
  },
  // {
  //   type: "collapse",
  //   name: "Pengeluaran",
  //   key: "pengeluaran",
  //   icon: <Icon fontSize="small">money_off</Icon>,
  //   route: "/pengeluaran",
  //   component: <Pengeluaran />,
  // },
  // {
  //   type: "collapse",
  //   name: "Laporan Keuangan",
  //   key: "laporan-keuangan",
  //   icon: <Icon fontSize="small">assessment</Icon>,
  //   route: "/laporan-keuangan",
  //   component: <LaporanKeuangan />,
  // },
  {
    type: "collapse",
    name: "Doa",
    key: "doa",
    icon: <Icon fontSize="small">mosque</Icon>,
    route: "/doa",
    component: <Doa />,
  },
];

export default routes;
