import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Button, Card, CardBody, CardTitle, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";

//Import Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const ProjectsCreate = () => {

  //meta title
  document.title = "Create New Project | Skote - React Admin & Dashboard Template";

  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [selectedFiles, setselectedFiles] = useState([]);

  const startDateChange = date => {
    setstartDate(date);
  };

  const endDateChange = date => {
    setendDate(date);
  };

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
      })
    );

    setselectedFiles(files);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Projects" breadcrumbItem="Add New" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Add Project Details </CardTitle>
                  <Form>
                    <div className="mb-5">
                    <FormGroup className="mb-4" row>
                      <Label
                        htmlFor="projectname"
                        className="col-form-label col-lg-2"
                      >
                        Project Name (En)
                      </Label>
                      <Col lg="10">
                        <Input
                          id="projectname"
                          name="projectname"
                          type="text"
                          className="form-control"
                          placeholder="Enter Project Name..."
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-4" row>
                      <Label
                          htmlFor="projectnames"
                          className="col-form-label col-lg-2"
                      >
                        Project Name (Si)
                      </Label>
                      <Col lg="10">
                        <Input
                            id="projectnames"
                            name="projectnames"
                            type="text"
                            className="form-control"
                            placeholder="ව්‍යාපෘතියේ නම ඇතුලත් කරන්න..."
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-4" row>
                      <Label
                          htmlFor="projectnamet"
                          className="col-form-label col-lg-2"
                      >
                        Project Name (Ta)
                      </Label>
                      <Col lg="10">
                        <Input
                            id="projectnamet"
                            name="projectnamet"
                            type="text"
                            className="form-control"
                            placeholder="திட்டத்தின் பெயர் உள்ளிடவும்..."
                        />
                      </Col>
                    </FormGroup>
                    </div>
                    <div className="mb-5">
                    <FormGroup className="mb-4" row>
                      <Label
                        htmlFor="projectdesc"
                        className="col-form-label col-lg-2"
                      >
                        Project Description (En)
                      </Label>
                      <Col lg="10">
                        <textarea
                          className="form-control"
                          id="projectdesc"
                          rows="3"
                          placeholder="Enter Project Description..."
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-4" row>
                      <Label
                          htmlFor="projectdescs"
                          className="col-form-label col-lg-2"
                      >
                        Project Description (Si)
                      </Label>
                      <Col lg="10">
                            <textarea
                                className="form-control"
                                id="projectdescs"
                                rows="3"
                                placeholder="ව්‍යාපෘතියේ විස්තර ඇතුලත් කරන්න..."
                            />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mb-4" row>
                      <Label
                          htmlFor="projectdesct"
                          className="col-form-label col-lg-2"
                      >
                        Project Description (Ta)
                      </Label>
                      <Col lg="10">
                                <textarea
                                    className="form-control"
                                    id="projectdesct"
                                    rows="3"
                                    placeholder="திட்ட விவரங்களை உள்ளிடவும்..."
                                />
                      </Col>
                    </FormGroup>
                  </div>
                  <div className="mb-5">
                  <FormGroup className="mb-4" row>
                    <Label
                        htmlFor="instituteen"
                        className="col-form-label col-lg-2"
                    >
                      Executing Institute (En)
                    </Label>
                    <Col lg="10">
                      <Input
                          id="instituteen"
                          name="instituteen"
                          type="text"
                          className="form-control"
                          placeholder="Executing institute name..."
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup className="mb-4" row>
                    <Label
                        htmlFor="institutesi"
                        className="col-form-label col-lg-2"
                    >
                      Executing Institute (Si)
                    </Label>
                    <Col lg="10">
                      <Input
                          id="institutesi"
                          name="institutesi"
                          type="text"
                          className="form-control"
                          placeholder="ක්‍රියාත්මක කිරීමේ ආයතනය..."
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup className="mb-4" row>
                    <Label
                        htmlFor="instituteta"
                        className="col-form-label col-lg-2"
                    >
                      Executing Institute (Ta)
                    </Label>
                    <Col lg="10">
                      <Input
                          id="instituteta"
                          name="instituteta"
                          type="text"
                          className="form-control"
                          placeholder="செயல்படுத்தும் நிறுவனம்..."
                      />
                    </Col>
                  </FormGroup>
                  </div>
                  <FormGroup className="mb-4" row>
                    <Label className="col-form-label col-lg-2">
                      Project Date (Start & Expected End)
                    </Label>
                    <Col lg="10">
                      <Row>
                        <Col md={6} className="pr-0">
                          <DatePicker
                            className="form-control"
                            selected={startDate}
                            onChange={startDateChange}
                          />
                        </Col>
                        <Col md={6} className="pl-0">
                          <DatePicker
                            className="form-control"
                            selected={endDate}
                            onChange={endDateChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </FormGroup>
                  <FormGroup className="mb-4" row>
                    <label
                      htmlFor="projectbudget"
                      className="col-form-label col-lg-2"
                    >
                      Budget
                    </label>
                    <Col lg="10">
                      <Input
                        id="projectbudget"
                        name="projectbudget"
                        type="text"
                        placeholder="Enter Project Budget..."
                        className="form-control"
                      />
                    </Col>
                  </FormGroup>
                  </Form>

                  <Row className="justify-content-end">
                    <Col lg="10">
                      <Button type="submit" color="primary">
                        Create Project
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
  );
};

export default ProjectsCreate;
