import { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DonaturCard from "../../examples/Cards/DonaturCard";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Donatur() {
  const [donaturList, setDonaturList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedDonaturId, setSelectedDonaturId] = useState(null);
  const [selectedDonatur, setSelectedDonatur] = useState(null);
  const [newDonatur, setNewDonatur] = useState({
    email: "",
    password: "",
    role: "Donatur", // Default role set to "Donatur"
    nama: "",
    no_rekening: "",
    alamat: "",
    no_telepon: "",
    jenis_donatur: "",
    status_aktif: true,
  });

  useEffect(() => {
    fetchDonatur();
  }, []);

  const fetchDonatur = () => {
    axios
      .get("http://localhost:3000/api/donatur")
      .then((response) => {
        setDonaturList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching donatur data:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewDonatur({ ...newDonatur, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!newDonatur.email || !newDonatur.password || !newDonatur.nama || !newDonatur.no_telepon) {
      alert("Please fill in all required fields");
      return;
    }

    if (!newDonatur.role) {
      newDonatur.role = "Donatur"; // Default role if not provided
    }

    axios
      .post("http://localhost:3000/api/donatur", newDonatur)
      .then((response) => {
        setDonaturList([...donaturList, response.data]);
        handleClose();
      })
      .catch((error) => console.error("Error adding donatur:", error));
  };

  const handleEdit = (id) => {
    axios
      .get(`http://localhost:3000/api/donatur/${id}`)
      .then((response) => {
        setSelectedDonatur(response.data); // Set data donatur yang dipilih untuk diedit
        setNewDonatur(response.data); // Isi form dengan data yang dipilih
        setSelectedDonaturId(id); // Set ID untuk update
        handleOpen(); // Buka dialog untuk edit
      })
      .catch((error) => console.error("Error fetching donatur for edit:", error));
  };

  const handleUpdate = () => {
    // Destructure untuk menghapus password dari data yang akan dikirim
    const { password, ...donaturDataToUpdate } = newDonatur;

    // Pastikan role ada
    if (!donaturDataToUpdate.role) {
      donaturDataToUpdate.role = "Donatur"; // Default role jika tidak disediakan
    }

    // Jika password kosong, gunakan password lama
    if (!newDonatur.password) {
      donaturDataToUpdate.password = selectedDonatur.password; // Gunakan password lama
    }

    // Kirimkan data yang sudah diperbarui tanpa password kosong
    axios
      .put(`http://localhost:3000/api/donatur/${selectedDonaturId}`, donaturDataToUpdate)
      .then(() => {
        fetchDonatur();
        handleClose(); // Tutup dialog setelah update
      })
      .catch((error) => console.error("Error updating donatur:", error));
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3000/api/donatur/${selectedDonaturId}`)
      .then(() => {
        fetchDonatur();
        handleClose(); // Close dialog after delete
      })
      .catch((error) => console.error("Error deleting donatur:", error));
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
          Daftar Donatur
        </MDTypography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ fontSize: "16px", padding: "10px 20px", borderRadius: 3, boxShadow: 3 }}
        >
          Tambah Donatur
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

        <DonaturCard
          donaturList={donaturList} // Kirimkan daftar donatur ke DonaturCard
          onEdit={handleEdit} // Kirimkan fungsi edit ke DonaturCard
          onDelete={handleDelete} // Kirimkan fungsi delete ke DonaturCard
        />
      </MDBox>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle variant="h5" fontWeight="bold" textAlign="center">
          {selectedDonatur ? "Edit Donatur" : "Tambah Donatur"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nama"
            name="nama"
            fullWidth
            margin="dense"
            value={newDonatur.nama}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="dense"
            value={newDonatur.email}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          {!selectedDonatur && (
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="dense"
              value={newDonatur.password}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            label="No Rekening"
            name="no_rekening"
            fullWidth
            margin="dense"
            value={newDonatur.no_rekening}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="No Telepon"
            name="no_telepon"
            fullWidth
            margin="dense"
            value={newDonatur.no_telepon}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Jenis Donatur"
            name="jenis_donatur"
            fullWidth
            margin="dense"
            value={newDonatur.jenis_donatur}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            <MenuItem value="Tetap">Tetap</MenuItem>
            <MenuItem value="Tidak Tetap">Tidak Tetap</MenuItem>
          </TextField>
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
            onClick={selectedDonatur ? handleUpdate : handleSubmit}
            color="primary"
            variant="contained"
            sx={{ padding: "8px 20px", borderRadius: 3 }}
          >
            {selectedDonatur ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Donatur;
