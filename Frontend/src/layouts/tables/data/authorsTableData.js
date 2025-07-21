/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Donasi Application React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Donasi Application React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function data() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "author", accessor: "author", width: "25%", align: "left" },
      { Header: "email", accessor: "email", align: "left" },
      { Header: "function", accessor: "function", align: "left" },
      { Header: "role desc", accessor: "roleDesc", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "status color", accessor: "statusColor", align: "center" },
      { Header: "employed", accessor: "employed", align: "center" },
      { Header: "join year", accessor: "joinYear", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
        email: "john@creative-tim.com",
        function: <Job title="Manager" description="Organization" />,
        roleDesc: "Supervises internal structure",
        status: <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />,
        statusColor: "Green",
        employed: <MDTypography variant="caption">23/04/18</MDTypography>,
        joinYear: "2018",
        action: <MDTypography variant="caption">Edit</MDTypography>,
      },
      {
        author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
        email: "alexa@creative-tim.com",
        function: <Job title="Programmer" description="Developer" />,
        roleDesc: "Front-end specialist",
        status: <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />,
        statusColor: "Gray",
        employed: <MDTypography variant="caption">11/01/19</MDTypography>,
        joinYear: "2019",
        action: <MDTypography variant="caption">Edit</MDTypography>,
      },
      {
        author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
        email: "laurent@creative-tim.com",
        function: <Job title="Executive" description="Projects" />,
        roleDesc: "Leads strategic projects",
        status: <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />,
        statusColor: "Green",
        employed: <MDTypography variant="caption">19/09/17</MDTypography>,
        joinYear: "2017",
        action: <MDTypography variant="caption">Edit</MDTypography>,
      },
      {
        author: <Author image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
        email: "michael@creative-tim.com",
        function: <Job title="Programmer" description="Developer" />,
        roleDesc: "Backend development",
        status: <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />,
        statusColor: "Green",
        employed: <MDTypography variant="caption">24/12/08</MDTypography>,
        joinYear: "2008",
        action: <MDTypography variant="caption">Edit</MDTypography>,
      },
      {
        author: <Author image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
        email: "richard@creative-tim.com",
        function: <Job title="Manager" description="Executive" />,
        roleDesc: "Manages top-level decisions",
        status: <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />,
        statusColor: "Gray",
        employed: <MDTypography variant="caption">04/10/21</MDTypography>,
        joinYear: "2021",
        action: <MDTypography variant="caption">Edit</MDTypography>,
      },
      {
        author: <Author image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
        email: "miriam@creative-tim.com",
        function: <Job title="Programmer" description="Developer" />,
        roleDesc: "Code optimization",
        status: <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />,
        statusColor: "Gray",
        employed: <MDTypography variant="caption">14/09/20</MDTypography>,
        joinYear: "2020",
        action: <MDTypography variant="caption">Edit</MDTypography>,
      },
    ],
  };
}
