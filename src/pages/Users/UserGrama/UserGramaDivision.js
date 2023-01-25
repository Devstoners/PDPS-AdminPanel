import React from "react";
import {
    Container,
        Row,
        Col,
        Card,
        CardBody,
        CardTitle,
        Input,
        FormGroup,
        Label,
        Button,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";


const PagesStarter = () => {

    //meta title
    document.title="Admin | PDPS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Grama Niladari" breadcrumbItem="Division" />
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <CardTitle className="mb-4">Add Grama Niladari Divisions</CardTitle>
                            <form className="outer-repeater">
                                <div data-repeater-list="outer-group" className="outer">
                                    <div data-repeater-item className="outer">
                                        <FormGroup className="mb-4" row>
                                            <Label
                                                htmlFor="divisionid"
                                                className="col-form-label col-lg-2"
                                            >
                                                Division ID
                                            </Label>
                                            <Col lg="10">
                                                <Input
                                                    id="divid"
                                                    name="divid"
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Division ID..."
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup className="mb-4" row>
                                            <Label className="col-form-label col-lg-2">
                                                Division Name
                                            </Label>
                                            <Col lg="10">
                                                <Input
                                                    id="divname"
                                                    name="divname"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Division Name..."
                                                />
                                            </Col>
                                        </FormGroup>
                                    </div>
                                </div>
                            </form>
                            <Row className="justify-content-end">
                                <Col lg="10">
                                    <Button type="submit" color="primary">
                                        Add
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PagesStarter;
