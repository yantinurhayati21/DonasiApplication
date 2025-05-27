import React, { useState, useEffect } from "react";
import { 
  Card, CardHeader, CardBody, Table, TableBody, TableCell, TableRow, TableHead, 
  Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions 
} from "@mui/material";
import { getAllDoa, createDoa, updateDoa, deleteDoa } from "../api/doaApi";

export default function Doa() {
  const [doas, setDoas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDoa, setSelectedDoa] = useState(null);

  // Fetch doa data
  useEffect(() => {
    fetchDoas();
  }, []);

  const fetchDoas = async () => {
    const data = await getAllDoa();
    setDoas(data);
  };

  // Handle open/close dialog
  const handleDialogOpen = (doa) => {
    setSelectedDoa(doa);
    setIsOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedDoa(null);
    setIsOpen(false);
  };

  // Submit form
  const handleSubmit = async () => {
    if (selectedDoa?.id_doa) {
      await updateDoa(selectedDoa.id_doa, selectedDoa);
    } else {
      await createDoa(selectedDoa);
    }
    handleDialogClose();
    fetchDoas();
  };

  // Delete doa
  const handleDelete = async (id) => {
    await deleteDoa(id);
    fetchDoas();
  };

  return (
    <Card>
      <CardHeader title="Manajemen Doa" />
      <CardBody>
        <Button color="primary" variant="contained" onClick={() => handleDialogOpen(null)}>
          Tambah Doa
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama Doa</TableCell>
              <TableCell>Isi Doa</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doas.map((doa, index) => (
              <TableRow key={doa.id_doa}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{doa.nama_doa}</TableCell>
                <TableCell>{doa.isi_doa}</TableCell>
                <TableCell>
                  <Button color="secondary" onClick={() => handleDialogOpen(doa)}>
                    Edit
                  </Button>
                  <Button color="error" onClick={() => handleDelete(doa.id_doa)}>
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>

      <Dialog open={isOpen} onClose={handleDialogClose}>
        <DialogTitle>{selectedDoa?.id_doa ? "Edit Doa" : "Tambah Doa"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nama Doa"
            value={selectedDoa?.nama_doa || ""}
            onChange={(e) =>
              setSelectedDoa({ ...selectedDoa, nama_doa: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Isi Doa"
            value={selectedDoa?.isi_doa || ""}
            onChange={(e) =>
              setSelectedDoa({ ...selectedDoa, isi_doa: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Batal
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
