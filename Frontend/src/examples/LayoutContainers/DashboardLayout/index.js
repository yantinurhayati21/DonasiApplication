/**
=========================================================
* Donasi Application React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com
=========================================================
*/

// React & Router
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// Donasi Application React components
import MDBox from "components/MDBox";

// Donasi Application React context
import { useMaterialUIController, setLayout } from "context";

// Navbar & Footer
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        padding: pxToRem(24),
        position: "relative",
        marginLeft: breakpoints.up("xl") ? (miniSidenav ? pxToRem(120) : pxToRem(274)) : 0,
        transition: transitions.create(["margin-left", "margin-right"], {
          easing: transitions.easing.easeInOut,
          duration: transitions.duration.standard,
        }),
      })}
    >
      {/* Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <MDBox component="main" flex="1" mt={2}>
        {children}
      </MDBox>

      {/* Footer stays at the bottom */}
      <Footer />
    </MDBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
