import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Donasi Application React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Donasi Application React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard_pimpinan/components/Projects/data";

function Projects() {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Lihat Kegiatan</MenuItem>
      <MenuItem onClick={closeMenu}>Tambahkan Kegiatan</MenuItem>
      <MenuItem onClick={closeMenu}>Laporan</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Daftar Kegiatan Pesantren
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon sx={{ fontWeight: "bold", color: "#388E3C", mt: -0.5 }}>book</Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>30 kegiatan</strong> bulan ini
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

export default Projects;
