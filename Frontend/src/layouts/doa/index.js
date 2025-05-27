import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DoaCard from "../../examples/Cards/DoaCard";

function Doa() {
  const [doaList, setDoaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDoaId, setSelectedDoaId] = useState(null);
  const [newDoa, setNewDoa] = useState({ nama_doa: "", isi_doa: "" });

  useEffect(() => {
    fetchDoa();
  }, []);

  const fetchDoa = () => {
    axios
      .get("http://localhost:3000/api/doa")
      .then((response) => {
        setDoaList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching doa data:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDelete = (id) => {
    setSelectedDoaId(id);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const handleChange = (e) => {
    setNewDoa({ ...newDoa, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/api/doa", newDoa)
      .then((response) => {
        setDoaList([...doaList, response.data]);
        handleClose();
      })
      .catch((error) => console.error("Error adding doa:", error));
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3000/api/doa/${selectedDoaId}`)
      .then(() => {
        fetchDoa();
        handleCloseDelete();
      })
      .catch((error) => console.error("Error deleting doa:", error));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        pt={3}
        px={3}
        lineHeight={1.25}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#f5f5f5"
        borderRadius={2}
        p={2}
        boxShadow={3}
      >
        <MDTypography variant="h4" fontWeight="bold" color="primary">
          Daftar Doa
        </MDTypography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ fontSize: "16px", padding: "10px 20px", borderRadius: 3, boxShadow: 3 }}
        >
          Tambah Doa
        </Button>
      </MDBox>

      <MDBox p={4} bgcolor="#ffffff" borderRadius={2} boxShadow={3}>
        {loading && (
          <MDTypography variant="h6" color="textSecondary">
            Loading...
          </MDTypography>
        )}
        {error && (
          <MDTypography variant="h6" color="error">
            Terjadi kesalahan: {error}
          </MDTypography>
        )}

        {!loading && !error && (
          <Grid container spacing={4} justifyContent="center">
            {doaList.map((doa) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={doa.id_doa}>
                <DoaCard
                  title={doa.nama_doa}
                  description={doa.isi_doa}
                  author="Pengurus Pesantren"
                  onDelete={() => handleOpenDelete(doa.id_doa)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </MDBox>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle variant="h5" fontWeight="bold" textAlign="center">
          Tambah Doa
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Doa"
            name="nama_doa"
            fullWidth
            margin="dense"
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Isi Doa"
            name="isi_doa"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            onChange={handleChange}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
          <Button
            onClick={handleClose}
            color="secondary"
            variant="outlined"
            sx={{ padding: "8px 20px", borderRadius: 3 }}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            sx={{ padding: "8px 20px", borderRadius: 3 }}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle variant="h6" fontWeight="bold" textAlign="center">
          Konfirmasi Hapus
        </DialogTitle>
        <DialogContent>
          <MDTypography variant="body1" textAlign="center">
            Apakah Anda yakin ingin menghapus doa ini?
          </MDTypography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
          <Button
            onClick={handleCloseDelete}
            color="secondary"
            variant="outlined"
            sx={{ padding: "8px 20px", borderRadius: 3 }}
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            sx={{ padding: "8px 20px", borderRadius: 3 }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Doa;
