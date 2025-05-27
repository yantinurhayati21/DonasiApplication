import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function EditDoa({ open, handleClose, doaId, refreshData }) {
  const [editedDoa, setEditedDoa] = useState({ nama_doa: "", isi_doa: "" });

  useEffect(() => {
    if (doaId) {
      axios
        .get(`http://localhost:3000/api/doa/${doaId}`)
        .then((response) => {
          setEditedDoa(response.data);
        })
        .catch((error) => console.error("Error fetching doa:", error));
    }
  }, [doaId]);

  const handleChange = (e) => {
    setEditedDoa({ ...editedDoa, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    axios
      .put(`http://localhost:3000/api/doa/${doaId}`, editedDoa)
      .then(() => {
        refreshData();
        handleClose();
      })
      .catch((error) => console.error("Error updating doa:", error));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle variant="h5" fontWeight="bold" textAlign="center">
        Edit Doa
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Nama Doa"
          name="nama_doa"
          fullWidth
          margin="dense"
          value={editedDoa.nama_doa}
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
          value={editedDoa.isi_doa}
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
          Simpan Perubahan
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditDoa.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  doaId: PropTypes.number,
  refreshData: PropTypes.func.isRequired,
};

export default EditDoa;
