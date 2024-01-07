import React, { useState } from "react"
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
  Button, FormFeedback,
} from "reactstrap"

//Import Date Picker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {useFormik} from "formik";
import * as Yup from "yup";
import loginService from "../../services/LoginService";
import newsService from "../../services/NewsService";
import Swal from "sweetalert2";
import {useHistory} from "react-router-dom";

const NewsCreate = () => {
  const history = useHistory();
  //meta title
  document.title="Admin | PDPS";
  const [news, setNews] = useState();
  const inpRow = [{ name: "", file: "" }]
  const [startDate, setstartDate] = useState(new Date())
  const [endDate, setendDate] = useState(new Date())
  const [inputFields, setinputFields] = useState(inpRow)

  const [sinhala, setSinhala] = useState();
  const [english, setEnglish] = useState();
  const [tamil, setTamil] = useState();
  const [startDateSelect, setStartDateSelect] = useState(new Date())
  const [endDateSelect, setEndDateSelect] = useState(new Date())
  const [isChecked, setChecked] = useState(false);
  const [isPriority, setIsPriority] = useState(false);


  const startDateChange = date => {
    setstartDate(date)
  }

  const endDateChange = date => {
    setendDate(date)
  }

  // Function for Create Input Fields
  function handleAddFields() {
    const item1 = { name: "", file: "" }
    setinputFields([...inputFields, item1])
  }

  // Function for Remove Input Fields
  function handleRemoveFields(idx) {
    document.getElementById("nested" + idx).style.display = "none"
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      topice: ( news &&  news.topice) || "",
      topics: ( news &&  news.topics) || "",
      topict: ( news &&  news.topict) || "",
    },
    validationSchema: Yup.object({
      topice: Yup.string().required("Please Enter News topic in English"),
      topics: Yup.string().required("Please Enter News topic in Sinhala"),
      topict: Yup.string().required("Please Enter News topic in Tamil"),
    }),
    onSubmit: (values) => {
      console.log("values", values);
      //validation.resetForm();
    }
  });

  const [formValidation, setValidation] = useState({
    topice: null,
    topics: null,
    topict: null,
  });
  const handleSinhala = (event) => {
    setSinhala(event.target.value);
  };
  const handleTamil = (event) =>{
    setTamil(event.target.value);
  }

  const handleEnglish = (event) =>{
    console.log(event.target.value)
    setEnglish(event.target.value);
  }

  const handleStartDateChange = (event) =>{

      setStartDateSelect(event);
  }

  const handleEndDateChange = (event) =>{
    setEndDateSelect(event);
  }

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const handleCheckboxChangePiro = () => {
    setIsPriority(!isPriority);
  };

  const addNewNews = async () => {
    const addNews = {
      sinhala: sinhala,
      english: english,
      tamil: tamil,
      startDateSelect: startDateSelect,
      endDateSelect: endDateSelect,
      isChecked: isChecked,
      isPriority: isPriority,

    }
    console.log(addNews);
    const data = await newsService.addNews(addNews);
    console.log(data);
    if (data.status === 201) {
      await Swal.fire(
          "Created Successfully!",
          "",
          "success"
      )
      history.push("/news")
    }
  };
  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="News" breadcrumbItem="Add" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Create News</CardTitle>
                  <form className="outer-repeater">
                    <div data-repeater-list="outer-group" className="outer">
                      <div data-repeater-item className="outer">
                        <FormGroup className="mb-4" row>
                          <Label
                            htmlFor="topice"
                            className="col-form-label col-lg-2"
                          >
                            English
                          </Label>
                          <Col lg="10">
                            <Input
                              id="topice"
                              name="topice"
                              type="textarea"
                              className="form-control"
                              placeholder="Enter News..."
                              onChange={(event) => {
                                validation.handleChange(event);
                                // Your additional onChange logic here
                                // For example, you can call another function or perform some specific actions
                                handleEnglish(event);
                              }}
                              onBlur={validation.handleBlur}
                              value={validation.values.topice || ""}
                              invalid={
                                validation.touched.topice && validation.errors.topice ? true : false
                              }
                            />
                            {validation.touched.topice && validation.errors.topice ? (
                                <FormFeedback type="invalid">{validation.errors.topice}</FormFeedback>
                            ) : null}
                          </Col>
                        </FormGroup>
                        <FormGroup className="mb-4" row>
                          <Label
                              htmlFor="topics"
                              className="col-form-label col-lg-2"
                          >
                           Sinhala
                          </Label>
                          <Col lg="10">
                            <Input
                                id="topics"
                                name="topics"
                                type="textarea"
                                className="form-control"
                                placeholder="පුවත ඇතුලත් කරන්න..."
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  // Your additional onChange logic here
                                  // For example, you can call another function or perform some specific actions
                                  handleSinhala(event);
                                }}
                                onBlur={validation.handleBlur}
                                value={validation.values.topics || ""}
                                invalid={
                                  validation.touched.topics && validation.errors.topics ? true : false
                                }
                            />
                            {validation.touched.topics && validation.errors.topics ? (
                                <FormFeedback type="invalid">{validation.errors.topics}</FormFeedback>
                            ) : null}
                          </Col>
                        </FormGroup>
                        <FormGroup className="mb-4" row>
                          <Label
                              htmlFor=" topict"
                              className="col-form-label col-lg-2"
                          >
                            Tamil
                          </Label>
                          <Col lg="10">
                            <Input
                                id="topict"
                                name="topict"
                                type="textarea"
                                className="form-control"
                                placeholder="செய்திகளை உள்ளிடவும்..."
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  // Your additional onChange logic here
                                  // For example, you can call another function or perform some specific actions
                                  handleTamil(event);
                                }}
                                onBlur={validation.handleBlur}
                                value={validation.values.topict || ""}
                                invalid={
                                  validation.touched.topict && validation.errors.topict ? true : false
                                }
                            />
                            {validation.touched.topict && validation.errors.topict ? (
                                <FormFeedback type="invalid">{validation.errors.topict}</FormFeedback>
                            ) : null}
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-4" row>
                          <Label htmlFor="customControlInline" className="col-form-label col-lg-2">
                            Visibility
                          </Label>
                          <Col lg="10">
                            <div className="form-check">
                              <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customControlInline"
                                  onChange={(event) => {

                                    // Your additional onChange logic here
                                    // For example, you can call another function or perform some specific actions
                                    handleCheckboxChange(event);
                                  }}
                              />
                              {/*<Label*/}
                              {/*    className="form-check-label ml-2"*/}
                              {/*    htmlFor="customControlInline"*/}
                              {/*>*/}
                              {/*  Remember me*/}
                              {/*</Label>*/}
                            </div>
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-4" row>
                          <Label htmlFor="customControlInline" className="col-form-label col-lg-2">
                            Priority
                          </Label>
                          <Col lg="10">
                            <div className="form-check">
                              <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="customControlInline"
                                  onChange={(event) => {

                                    // Your additional onChange logic here
                                    // For example, you can call another function or perform some specific actions
                                    handleCheckboxChangePiro(event);
                                  }}
                              />
                            </div>
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-4" row>
                          <Label className="col-form-label col-lg-2">
                            Display Duration
                          </Label>
                          <Col lg="10">
                            <Row>
                              <Col md={6} className="pr-0">
                                <DatePicker
                                  className="form-control"
                                  selected={startDate}

                                  onChange={(event) => {

                                    // Your additional onChange logic here
                                    // For example, you can call another function or perform some specific actions
                                    handleStartDateChange(event);
                                  }}
                                />
                              </Col>
                              <Col md={6} className="pl-0">
                                <DatePicker
                                  className="form-control"
                                  selected={endDate}

                                  onChange={(event) => {

                                    // Your additional onChange logic here
                                    // For example, you can call another function or perform some specific actions
                                    handleEndDateChange(event);
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </FormGroup>


                      </div>
                    </div>
                  </form>
                  <Row className="justify-content-end">
                    <Col lg="10">
                      <button
                          type="button"
                          className="btn btn-primary btn-block"
                          onClick={addNewNews}
                      >
                        Submit News
                      </button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default NewsCreate
