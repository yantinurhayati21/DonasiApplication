// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";

// Donasi Application React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Donasi Application React base styles
import typography from "assets/theme/base/typography";

function Footer({ light }) {
  const { size } = typography;

  return (
    <MDBox position="absolute" width="100%" bottom={0} py={3}>
      <Container>
        <MDBox display="flex" justifyContent="center" alignItems="center">
          <MDTypography
            variant="caption"
            fontSize={size.sm}
            color={light ? "white" : "text"}
            textAlign="center"
          >
            &copy; {new Date().getFullYear()} Istana Yatim Dhuafa. All rights reserved.
          </MDTypography>
        </MDBox>
      </Container>
    </MDBox>
  );
}

// Default props
Footer.defaultProps = {
  light: false,
};

// Prop types
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
