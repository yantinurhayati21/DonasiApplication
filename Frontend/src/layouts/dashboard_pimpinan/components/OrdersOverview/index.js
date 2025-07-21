// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Donasi Application React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Donasi Application React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium" color="text.secondary">
          Laporan Kegiatan Pesantren
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon="book"
          title="Pembelajaran kitab kuning"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="error"
          icon="church"
          title="Sholat berjamaah di masjid"
          dateTime="21 DEC 11 PM"
        />
        <TimelineItem
          color="info"
          icon="assignment_turned_in"
          title="Penyerahan donasi zakat"
          dateTime="21 DEC 9:34 PM"
        />
        <TimelineItem
          color="warning"
          icon="library_books"
          title="Ujian tahfiz Quran"
          dateTime="20 DEC 2:20 AM"
        />
        <TimelineItem
          color="primary"
          icon="school"
          title="Pendaftaran santri baru"
          dateTime="18 DEC 4:54 AM"
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
