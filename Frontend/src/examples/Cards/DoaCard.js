import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

function DoaCard({ title, description, author, onEdit, onDelete }) {
  return (
    <Card
      sx={{
        minHeight: "280px",
        maxHeight: "280px",
        overflow: "hidden",
        borderRadius: 4,
        boxShadow: 4,
        transition: "0.3s",
        background: "linear-gradient(to bottom, #ffffff, #f9f9f9)",
        "&:hover": { boxShadow: 10, transform: "scale(1.02)" },
      }}
    >
      <CardContent sx={{ overflow: "auto", maxHeight: "200px", padding: 3 }}>
        <MDBox mb={2} textAlign="center">
          <MDTypography variant="h5" fontWeight="bold" color="primary">
            {title}
          </MDTypography>
        </MDBox>
        <MDTypography
          variant="body2"
          color="textSecondary"
          sx={{
            fontStyle: "italic",
            textAlign: "justify",
            maxHeight: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4, // Membatasi jumlah baris sebelum "..."
          }}
        >
          {description}
        </MDTypography>
        <MDTypography
          variant="caption"
          color="textSecondary"
          display="block"
          mt={2}
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Oleh: {author}
        </MDTypography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", padding: 2 }}>
        <IconButton
          color="primary"
          onClick={onEdit}
          sx={{
            bgcolor: "primary.light",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
            padding: 1.5,
            boxShadow: 2,
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={onDelete}
          sx={{
            bgcolor: "error.light",
            color: "white",
            "&:hover": { bgcolor: "error.dark" },
            padding: 1.5,
            boxShadow: 2,
          }}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
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

export default DoaCard;
