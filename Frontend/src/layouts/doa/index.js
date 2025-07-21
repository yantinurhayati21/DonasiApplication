import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
import CircularProgress from "@mui/material/CircularProgress";

function Doa() {
  const [doaList, setDoaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDoaId, setSelectedDoaId] = useState(null);
  const [newDoa, setNewDoa] = useState({ nama_doa: "", isi_doa: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterText, setFilterText] = useState("");

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

  const handleOpen = (doa = null) => {
    if (doa) {
      setNewDoa({ nama_doa: doa.nama_doa, isi_doa: doa.isi_doa });
      setSelectedDoaId(doa.id_doa);
    } else {
      setNewDoa({ nama_doa: "", isi_doa: "" });
      setSelectedDoaId(null);
    }
    setOpen(true);
  };

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
    const request = selectedDoaId
      ? axios.put(`http://localhost:3000/api/doa/${selectedDoaId}`, newDoa) // Edit existing Doa
      : axios.post("http://localhost:3000/api/doa", newDoa); // Add new Doa

    request
      .then((response) => {
        if (selectedDoaId) {
          setDoaList(doaList.map((doa) => (doa.id_doa === selectedDoaId ? response.data : doa)));
        } else {
          setDoaList([...doaList, response.data]);
        }
        handleClose();
      })
      .catch((error) => console.error("Error adding/editing doa:", error));
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredDoaList = doaList.filter(
    (doa) =>
      doa.nama_doa.toLowerCase().includes(filterText.toLowerCase()) ||
      doa.isi_doa.toLowerCase().includes(filterText.toLowerCase())
  );

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
        <MDTypography variant="h4" fontWeight="bold" color="#3f51b5">
          Daftar Doa
        </MDTypography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon sx={{ color: "#ffffff" }} />}
          onClick={() => handleOpen()}
          sx={{
            fontSize: "16px",
            padding: "10px 20px",
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: "#3f51b5",
            "&:hover": {
              backgroundColor: "#303f9f",
            },
          }}
        >
          Tambah Doa
        </Button>
      </MDBox>

      <MDBox
        p={4}
        bgcolor="#ffffff"
        borderRadius={2}
        boxShadow={3}
        sx={{ maxWidth: "100%", overflow: "auto" }}
      >
        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : error ? (
          <MDTypography variant="h6" color="error">
            Terjadi kesalahan: {error}
          </MDTypography>
        ) : (
          <MDBox component="div" sx={{ marginBottom: 3 }}>
            {/* Filter Input */}
            <TextField
              label="Filter by Nama or Isi"
              variant="outlined"
              fullWidth
              onChange={(e) => setFilterText(e.target.value)}
              value={filterText}
              sx={{ mb: 2 }}
            />

            {/* Table Header */}
            <MDBox
              component="div"
              sx={{
                display: "flex",
                backgroundColor: "#f1f1f1",
                padding: "12px",
                borderRadius: 1,
                fontWeight: "bold",
                color: "#3f51b5",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Nama Doa</MDBox>
              <MDBox sx={{ flex: 2, padding: "8px 16px" }}>Isi Doa</MDBox>
              <MDBox sx={{ flex: 1, padding: "8px 16px" }}>Aksi</MDBox>
            </MDBox>

            {/* Table Rows */}
            {filteredDoaList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((doa, index) => (
                <MDBox
                  key={doa.id_doa}
                  component="div"
                  sx={{
                    display: "flex",
                    padding: "12px 16px",
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                    borderRadius: 1,
                    boxShadow: 1,
                    marginBottom: 1,
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <MDBox sx={{ flex: 1, padding: "8px 16px" }}>{doa.nama_doa}</MDBox>
                  <MDBox sx={{ flex: 2, padding: "8px 16px" }}>{doa.isi_doa}</MDBox>
                  <MDBox sx={{ flex: 1, padding: "8px 16px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpen(doa)}
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleOpenDelete(doa.id_doa)}
                    >
                      Hapus
                    </Button>
                  </MDBox>
                </MDBox>
              ))}

            {/* Pagination Controls */}
            <MDBox sx={{ display: "flex", justifyContent: "flex-end", paddingTop: 2 }}>
              <Button
                onClick={(e) => handleChangePage(e, page - 1)}
                disabled={page === 0}
                variant="outlined"
                sx={{ marginRight: 1 }}
              >
                Previous
              </Button>
              <Button
                onClick={(e) => handleChangePage(e, page + 1)}
                disabled={page >= Math.ceil(filteredDoaList.length / rowsPerPage) - 1}
                variant="outlined"
              >
                Next
              </Button>
            </MDBox>
          </MDBox>
        )}
      </MDBox>

      {/* Add/Edit Doa Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle variant="h5" fontWeight="bold" textAlign="center">
          {selectedDoaId ? "Edit Doa" : "Tambah Doa"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Doa"
            name="nama_doa"
            fullWidth
            margin="dense"
            onChange={handleChange}
            value={newDoa.nama_doa}
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
            value={newDoa.isi_doa}
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
            {selectedDoaId ? "Perbarui" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Doa Confirmation */}
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle variant="h6" fontWeight="bold" textAlign="center">
          Konfirmasi Hapus
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <MDTypography variant="body1" textAlign="center" sx={{ mb: 2 }}>
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
