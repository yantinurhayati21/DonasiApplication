import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function AddDoa({ open, handleClose, refreshData }) {
  const [newDoa, setNewDoa] = useState({ nama_doa: "", isi_doa: "" });

  const handleChange = (e) => {
    setNewDoa({ ...newDoa, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/api/doa", newDoa)
      .then(() => {
        refreshData(); // Memperbarui daftar doa setelah menambah
        handleClose();
      })
      .catch((error) => console.error("Error adding doa:", error));
  };

  return (
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
  );
}

AddDoa.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
};

export default AddDoa;
