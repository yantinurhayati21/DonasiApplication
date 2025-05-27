import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// DonaturCard hanya menerima donaturList sebagai prop dan menampilkan data dalam bentuk tabel
function DonaturCard({ donaturList, onEdit, onDelete }) {
  return (
    <MDBox p={3} bgcolor="#fff" borderRadius={4} boxShadow={3}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="donatur table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Nama
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Jenis Donatur
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                No Rekening
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donaturList && donaturList.length > 0 ? (
              donaturList.map((donatur) => (
                <TableRow
                  key={donatur.id_donatur}
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell align="center">{donatur.nama}</TableCell>
                  <TableCell align="center">{donatur.email}</TableCell>
                  <TableCell align="center">{donatur.jenis_donatur}</TableCell>
                  <TableCell align="center">{donatur.no_rekening}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => onEdit(donatur.id_donatur)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(donatur.id_donatur)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <MDTypography variant="h6" color="textSecondary">
                    Tidak ada Donatur yang tersedia.
                  </MDTypography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MDBox>
  );
}

DonaturCard.propTypes = {
  donaturList: PropTypes.array.isRequired, // Daftar donatur yang ditampilkan
  onEdit: PropTypes.func.isRequired, // Fungsi edit yang dikirimkan
  onDelete: PropTypes.func.isRequired, // Fungsi delete yang dikirimkan
};

export default DonaturCard;
