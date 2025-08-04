// Footer.js

// @mui material components
import Icon from "@mui/material/Icon";

// Donasi components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Base styles
import typography from "assets/theme/base/typography";

function Footer() {
  const { size } = typography;

  return (
    <MDBox
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={1.5}
      py={2}
      mt="auto"
    >
      <MDTypography
        variant="button"
        fontWeight="regular"
        color="text"
        fontSize={size.sm}
        textAlign="center"
      >
        &copy; {new Date().getFullYear()} Donasi Application. Istana Yatim Dhuafa{" "}
        <Icon fontSize="inherit" color="error">
          favorite
        </Icon>
      </MDTypography>
    </MDBox>
  );
}

export default Footer;
