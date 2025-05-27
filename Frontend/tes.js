import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Grid from "@mui/material/Grid";
import { useState } from "react";

function DoaCard({ title, description, author, onEdit, onDelete }) {
  return (
    <Card
      sx={{
        minHeight: "250px",
        maxHeight: "250px",
        overflow: "hidden",
        borderRadius: 4,
        boxShadow: 5,
        transition: "0.3s",
        "&:hover": { boxShadow: 8 },
      }}
    >
      <CardContent sx={{ overflow: "auto", maxHeight: "180px" }}>
        <MDBox mb={2} textAlign="center">
          <MDTypography variant="h5" fontWeight="bold" color="primary">
            {title}
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="textSecondary" sx={{ fontStyle: "italic" }}>
          {description}
        </MDTypography>
        <MDTypography
          variant="caption"
          color="textSecondary"
          display="block"
          mt={2}
          sx={{ fontWeight: "bold" }}
        >
          Oleh: {author}
        </MDTypography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <IconButton
          color="primary"
          onClick={onEdit}
          sx={{ bgcolor: "primary.light", color: "white", "&:hover": { bgcolor: "primary.dark" } }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={onDelete}
          sx={{ bgcolor: "error.light", color: "white", "&:hover": { bgcolor: "error.dark" } }}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

function DoaList({ doas = [], onAdd, onEdit, onDelete }) {
  console.log("Data doas:", doas); // Debugging, cek data yang diterima

  return (
    <MDBox p={2}>
      <Grid container spacing={4}>
        {doas.length > 0 ? (
          doas.map((doa) => (
            <Grid item xs={12} md={6} xl={3} key={doa.id_doa}>
              <DoaCard
                title={doa.nama_doa}
                description={doa.isi_doa}
                author="Pengurus Pesantren"
                onEdit={() => onEdit(doa.id_doa)}
                onDelete={() => onDelete(doa.id_doa)}
              />
            </Grid>
          ))
        ) : (
          <MDTypography variant="body1" color="textSecondary" textAlign="center" width="100%">
            Tidak ada doa yang tersedia.
          </MDTypography>
        )}
      </Grid>
    </MDBox>
  );
}

// ✅ Tambahkan PropTypes untuk validasi props
DoaCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

DoaList.propTypes = {
  doas: PropTypes.arrayOf(PropTypes.object),
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DoaList;
