/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import team1 from "assets/images/team-1.jpeg";
import team2 from "assets/images/team-2.jpeg";
import team3 from "assets/images/team-3.jpeg";
import team4 from "assets/images/team-4.jpeg";

// Import PropTypes for validation
import PropTypes from "prop-types";

export default function OrdersOverview() {
  const avatars = (members) =>
    members.map(([image, name]) => (
      <Tooltip key={name} title={name} placeholder="bottom">
        <MDAvatar
          src={image}
          alt="name"
          size="xs"
          sx={{
            border: ({ borders: { borderWidth }, palette: { white } }) =>
              `${borderWidth[2]} solid ${white.main}`,
            cursor: "pointer",
            position: "relative",
            "&:not(:first-of-type)": { ml: -1.25 },
            "&:hover, &:focus": { zIndex: "10" },
          }}
        />
      </Tooltip>
    ));

  // Company Component with PropTypes validation
  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  // PropTypes validation for the Company component
  Company.propTypes = {
    image: PropTypes.string.isRequired, // image should be a string (URL of the image)
    name: PropTypes.string.isRequired, // name should be a string
  };

  return {
    columns: [
      { Header: "kegiatan", accessor: "companies", width: "45%", align: "left" },
      { Header: "anggota", accessor: "members", width: "10%", align: "left" },
      { Header: "anggaran", accessor: "budget", align: "center" },
      { Header: "selesai", accessor: "completion", align: "center" },
    ],

    rows: [
      {
        companies: <Company image={team1} name="Pembelajaran Quran" />,
        members: (
          <MDBox display="flex" py={1}>
            {avatars([
              [team1, "Santri A"],
              [team2, "Santri B"],
              [team3, "Santri C"],
            ])}
          </MDBox>
        ),
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Rp 14.000.000
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={60} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company image={team2} name="Pemberdayaan Ekonomi Santri" />,
        members: (
          <MDBox display="flex" py={1}>
            {avatars([[team4, "Santri D"]])}
          </MDBox>
        ),
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Rp 3.000.000
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={100} color="success" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company image={team3} name="Renovasi Masjid" />,
        members: (
          <MDBox display="flex" py={1}>
            {avatars([
              [team1, "Santri E"],
              [team3, "Santri F"],
            ])}
          </MDBox>
        ),
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            Rp 5.000.000
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={30} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
    ],
  };
}
