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
  FormFeedback,
} from "reactstrap"

// //Import Date Picker
// import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { useFormik } from "formik"
import * as Yup from "yup"
import newsService from "../../services/NewsService"
import Swal from "sweetalert2"
import { useHistory } from "react-router-dom"

const NewsCreate = () => {
  const history = useHistory()
  //meta title
  document.title = "Admin | PDPS"

  const [news, setNews] = useState()

  const [newsSinhala, setSinhala] = useState()
  const [newsEnglish, setEnglish] = useState()
  const [newsTamil, setTamil] = useState()

  // const [isChecked, setChecked] = useState(false)
  // const [isPriority, setIsPriority] = useState(false)
  // const [visibility, setVisibility] = useState([])
  // const startDateChange = date => {
  //   setstartDate(date)
  // }
  //
  // const endDateChange = date => {
  //   setendDate(date)
  // }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      newsEnglish: (news && news.newsEnglish) || "",
      newsSinhala: (news && news.newsSinhala) || "",
      newsTamil: (news && news.newsTamil) || "",
    },
    validationSchema: Yup.object({
      newsEnglish: Yup.string().required("Please Enter News in English"),
      newsSinhala: Yup.string().required("Please Enter News in Sinhala"),
      newsTamil: Yup.string().required("Please Enter News in Tamil"),
    }),
    onSubmit: async values => {
      try {
        const response = await newsService.addNews(values)
        //console.log("server response", response.status)
        await Swal.fire("News Added Successfully!", "", "success")
        validation.resetForm();
        //history.push("/news")
      } catch (error) {
        console.error("Error", error)
      }
    },
  })

  const [formValidation, setValidation] = useState({
    newsEnglish: null,
    newsSinhala: null,
    newsTamil: null,
  })
  const handleSinhala = event => {
    setSinhala(event.target.value)
  }
  const handleTamil = event => {
    setTamil(event.target.value)
  }

  const handleEnglish = event => {
    // console.log(event.target.value)
    setEnglish(event.target.value)
  }

  // const handleStartDateChange = event => {
  //   setStartDateSelect(event)
  // }

  // const handleEndDateChange = event => {
  //   setEndDateSelect(event)
  // }

  // const handleVisibility = async e => {
  //   console.log(e.target.value, "e.target.visibility")
  //   setVisibility(e.target.value)
  // }
  //
  // const handleCheckboxChangePiro = () => {
  //   setIsPriority(!isPriority)
  // }

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

                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()
                      return false
                    }}
                  >
                    <div data-repeater-list="outer-group" className="outer">
                      <div data-repeater-item className="outer">
                        <FormGroup className="mb-4" row>
                          <Label
                            htmlFor="newsEnglish"
                            className="col-form-label col-lg-2"
                          >
                            English
                          </Label>
                          <Col lg="10">
                            <Input
                              id="newsEnglish"
                              name="newsEnglish"
                              type="textarea"
                              className="form-control"
                              placeholder="Enter News..."
                              onChange={event => {
                                validation.handleChange(event)
                                // Your additional onChange logic here
                                // For example, you can call another function or perform some specific actions
                                handleEnglish(event)
                              }}
                              onBlur={validation.handleBlur}
                              value={validation.values.newsEnglish || ""}
                              invalid={
                                validation.touched.newsEnglish &&
                                validation.errors.newsEnglish
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.newsEnglish &&
                            validation.errors.newsEnglish ? (
                              <FormFeedback type="invalid">
                                {validation.errors.newsEnglish}
                              </FormFeedback>
                            ) : null}
                          </Col>
                        </FormGroup>
                        <FormGroup className="mb-4" row>
                          <Label
                            htmlFor="newsSinhala"
                            className="col-form-label col-lg-2"
                          >
                            Sinhala
                          </Label>
                          <Col lg="10">
                            <Input
                              id="newsSinhala"
                              name="newsSinhala"
                              type="textarea"
                              className="form-control"
                              placeholder="පුවත ඇතුලත් කරන්න..."
                              onChange={event => {
                                validation.handleChange(event)
                                // Your additional onChange logic here
                                // For example, you can call another function or perform some specific actions
                                handleSinhala(event)
                              }}
                              onBlur={validation.handleBlur}
                              value={validation.values.newsSinhala || ""}
                              invalid={
                                validation.touched.newsSinhala &&
                                validation.errors.newsSinhala
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.newsSinhala &&
                            validation.errors.newsSinhala ? (
                              <FormFeedback type="invalid">
                                {validation.errors.newsSinhala}
                              </FormFeedback>
                            ) : null}
                          </Col>
                        </FormGroup>
                        <FormGroup className="mb-4" row>
                          <Label
                            htmlFor=" newsTamil"
                            className="col-form-label col-lg-2"
                          >
                            Tamil
                          </Label>
                          <Col lg="10">
                            <Input
                              id="newsTamil"
                              name="newsTamil"
                              type="textarea"
                              className="form-control"
                              placeholder="செய்திகளை உள்ளிடவும்..."
                              onChange={event => {
                                validation.handleChange(event)
                                // Your additional onChange logic here
                                // For example, you can call another function or perform some specific actions
                                handleTamil(event)
                              }}
                              onBlur={validation.handleBlur}
                              value={validation.values.newsTamil || ""}
                              invalid={
                                validation.touched.newsTamil &&
                                validation.errors.newsTamil
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.newsTamil &&
                            validation.errors.newsTamil ? (
                              <FormFeedback type="invalid">
                                {validation.errors.newsTamil}
                              </FormFeedback>
                            ) : null}
                          </Col>
                        </FormGroup>

                        {/*<FormGroup className="mb-4" row>*/}
                        {/*  <Label*/}
                        {/*    htmlFor="visibility"*/}
                        {/*    className="col-form-label col-lg-2"*/}
                        {/*  >*/}
                        {/*    Visibility*/}
                        {/*  </Label>*/}
                        {/*  <Col lg="10">*/}

                        {/*  </Col>*/}
                        {/*</FormGroup>*/}

                        {/*<FormGroup className="mb-4" row>*/}
                        {/*  <Label*/}
                        {/*    htmlFor="customControlInline"*/}
                        {/*    className="col-form-label col-lg-2"*/}
                        {/*  >*/}
                        {/*    Priority*/}
                        {/*  </Label>*/}
                        {/*  <Col lg="10">*/}

                        {/*    <select defaultValue="1" className="form-select">*/}
                        {/*      <option value="1"> First </option>*/}
                        {/*      <option value="2"> Second </option>*/}
                        {/*      <option value="3"> Third </option>*/}
                        {/*    </select>*/}
                        {/*  </Col>*/}
                        {/*</FormGroup>*/}

                        {/*<FormGroup className="mb-4" row>*/}
                        {/*  <Label className="col-form-label col-lg-2">*/}
                        {/*    Display Duration*/}
                        {/*  </Label>*/}
                        {/*  <Col lg="10">*/}
                        {/*    <Row>*/}
                        {/*      <Col md={6} className="pr-0">*/}
                        {/*        <DatePicker*/}
                        {/*          className="form-control"*/}
                        {/*          selected={startDate}*/}

                        {/*          onChange={(event) => {*/}

                        {/*            // Your additional onChange logic here*/}
                        {/*            // For example, you can call another function or perform some specific actions*/}
                        {/*            handleStartDateChange(event);*/}
                        {/*          }}*/}
                        {/*        />*/}
                        {/*      </Col>*/}
                        {/*      <Col md={6} className="pl-0">*/}
                        {/*        <DatePicker*/}
                        {/*          className="form-control"*/}
                        {/*          selected={endDate}*/}

                        {/*          onChange={(event) => {*/}

                        {/*            // Your additional onChange logic here*/}
                        {/*            // For example, you can call another function or perform some specific actions*/}
                        {/*            handleEndDateChange(event);*/}
                        {/*          }}*/}
                        {/*        />*/}
                        {/*      </Col>*/}
                        {/*    </Row>*/}
                        {/*  </Col>*/}
                        {/*</FormGroup>*/}
                      </div>
                    </div>

                    <Row className="justify-content-end">
                      <Col lg="10">
                        <button
                          type="submits"
                          className="btn btn-primary btn-block"
                        >
                          Submit News
                        </button>
                      </Col>
                    </Row>
                  </form>
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
