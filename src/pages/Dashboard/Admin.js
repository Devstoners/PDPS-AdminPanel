import React from "react"
import { Container, Row } from "reactstrap"

//import component
import CardUser from "./CardUser"
import Settings from "./Settings"
import Posts from "./Posts"
import Comments from "./Comments"
import TapVisitors from "./TapVisitors"


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const admin = () => {
  //meta title
  document.title = "Admin | PDPS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Dashboard" breadcrumbItem="Dashboard" />
          <Row>
            {/* card user */}
            <CardUser dataColors='["--bs-primary", "--bs-warning"]' />
            <Settings />
          </Row>
          <Row>
            <TapVisitors />
            <Posts />
            <Comments />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default admin
