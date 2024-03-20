import React, { useEffect, useState, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
import TableContainer from "../../components/Common/TableContainer"
import { isEmpty } from "lodash"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  UncontrolledTooltip,
  Input,
  Form,
  Button, // Import Button component from Reactstrap
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import DeleteModal from "components/Common/DeleteModal"
import downloadService from "../../services/DownloadService"
import Swal from "sweetalert2"
import Breadcrumbs from "../../components/Common/Breadcrumb"


const CommitteeReport = props => {
  // Meta title
  document.title = "Admin | PDPS"
  const [reportList, setReportList] = useState([])
  const [report, setReport] = useState()
  const [refreshTable, setRefreshTable] = useState(false)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  // Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  // Fetch data
  const fetchData = async () => {
    try {
      const fetchedData = await downloadService.getReport()
      console.log(fetchedData)
      const allActsArray = fetchedData.AllReports || []
      const mappedData = allActsArray.map((item, index) => ({
        displayId: allActsArray.length - index,
        id: item.id,
        reportYear: item.report_year,
        reportMonth: item.report_month,
        nameEn: item.name_en,
        nameSi: item.name_si,
        nameTa: item.name_ta,
        reportFileEn: item.file_path_en ? { name: item.file_path_en } : null,
        reportFileSi: item.file_path_si ? { name: item.file_path_si } : null,
        reportFileTa: item.file_path_ta ? { name: item.file_path_ta } : null,
      }))
      setReportList(mappedData)
    } catch (error) {
      console.error("Error fetching report data:", error)
    }
  }

  //---------------------------- Validation---------------------------------------------
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (report && report.id) || "",
      reportYear: (report && report.reportYear) || "",
      reportMonth: (report && report.reportMonth) || "",
      nameEn: (report && report.nameEn) || "",
      nameSi: (report && report.nameSi) || "",
      nameTa: (report && report.nameTa) || "",
      reportFileEn: (report && report.reportFileEn) || null,
      reportFileSi: (report && report.reportFileSi) || null,
      reportFileTa: (report && report.reportFileTa) || null,
    },
    validationSchema: Yup.object({
      reportYear: Yup.string().required("Please Enter Act Number"),
      reportMonth: Yup.date().required("Please Enter Act Date"),
      nameEn: Yup.string().required("Please Enter Name in English"),
      nameSi: Yup.string().required("Please Enter Name in Sinhala"),
      nameTa: Yup.string().required("Please Enter Name in Tamil"),
      reportFileEn: Yup.mixed().test(
        "fileType",
        "Invalid file type. Only PDF files are allowed.",
        value => {
          // Skip validation if no new file is selected
          if (!value || !(value instanceof File)) return true;
          return value.type === "application/pdf";
        }
      ),
      reportFileSi: Yup.mixed().test(
        "fileType",
        "Invalid file type. Only PDF files are allowed.",
        value => {
          // Skip validation if no new file is selected
          if (!value || !(value instanceof File)) return true;
          return value.type === "application/pdf";
        }
      ),
      reportFileTa: Yup.mixed().test(
        "fileType",
        "Invalid file type. Only PDF files are allowed.",
        value => {
          // Skip validation if no new file is selected
          if (!value || !(value instanceof File)) return true;
          return value.type === "application/pdf";
        }
      ),


    }),

    onSubmit: async values => {
      //---------------edit---------------------------------------
      if (isEdit) {
        try{
          // formData.forEach((value, key) => {
          //   console.log(key, value);
          // });
          const formData = new FormData()
          formData.append("id", values.id)
          formData.append("reportYear", values.reportYear)
          formData.append("reportMonth", values.reportMonth)
          formData.append("nameEn", values.nameEn)
          formData.append("nameSi", values.nameSi)
          formData.append("nameTa", values.nameTa)
          formData.append("reportFileEn", values.reportFileEn)
          formData.append("reportFileSi", values.reportFileSi)
          formData.append("reportFileTa", values.reportFileTa)
          formData.append('_method', 'PUT');
          const { result, errorMessage } = await downloadService.editReport(
            formData
          )
          if (errorMessage) {
            const formattedErrorMessage = errorMessage.replace(/\n/g, "<br>")
            Swal.fire({
              title: "Error",
              html: formattedErrorMessage,
              icon: "error",
              allowOutsideClick: false,
            })
          } else {
            await Swal.fire("Committee Report Edited Successfully!", "", "success")
            setRefreshTable(prevRefresh => !prevRefresh)
            validation.resetForm()
          }
        } catch (error) {
          Swal.fire("Error", "An error occurred while editing report", "error")
        }
      } else {
        //---------------add---------------------------------------
        try {
          const formData = new FormData()
          formData.append("reportYear", values.reportYear)
          formData.append("reportMonth", values.reportMonth)
          formData.append("nameEn", values.nameEn)
          formData.append("nameSi", values.nameSi)
          formData.append("nameTa", values.nameTa)
          formData.append("reportFileEn", values.reportFileEn)
          formData.append("reportFileSi", values.reportFileSi)
          formData.append("reportFileTa", values.reportFileTa)
          // console.log(formData)
          const { result, errorMessage } = await downloadService.addReport(
            formData
          )
          if (errorMessage) {
            const formattedErrorMessage = errorMessage.replace(/\n/g, "<br>")
            Swal.fire({
              title: "Error",
              html: formattedErrorMessage,
              icon: "error",
              allowOutsideClick: false,
            })
          } else {
            await Swal.fire("Committee Report Added Successfully!", "", "success")
            setRefreshTable(prevRefresh => !prevRefresh)
            validation.resetForm()
          }
        } catch (error) {
          Swal.fire("Error", "An error occurred while adding report", "error")
        }
      }
      toggle()
    },
  })

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "displayId",
        disableFilters: true,
      },
      {
        Header: "Year",
        accessor: "reportYear",
        disableFilters: true,
      },
      {
        Header: "Month",
        accessor: "reportMonth",
        disableFilters: true,
      },
      {
        Header: "Name",
        accessor: "nameEn",
        disableFilters: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const reportData = cellProps.row.original
                  handleUserClick(reportData)
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>

              {/*-------------------Delete button--------------------- */}
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const memberData = cellProps.row.original
                  onClickDelete(memberData)
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            </div>
          )
        },
      },
    ],
    []
  )

  // Define the toggle function
  const toggle = () => {
    setModal(!modal)
  }

  useEffect(() => {
    if (report && report.length === 0) {
      setIsEdit(false) // No report to edit, so set isEdit to false
    }
  }, [report])

  const handleUserClick = arg => {
    const reportData = arg
    setReport({
      id: reportData.id,
      reportYear: reportData.reportYear,
      reportMonth: reportData.reportMonth,
      nameEn: reportData.nameEn,
      nameSi: reportData.nameSi,
      nameTa: reportData.nameTa,
      reportFileEn: reportData.reportFileEn,
      reportFileSi: reportData.reportFileSi,
      reportFileTa: reportData.reportFileTa,
    })
    // console.log("en",reportData.nameEn)
    setIsEdit(true) // Set isEdit to true when clicking to edit
    toggle()
  }

  // Delete report
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = report => {
    setReport(report)
    setDeleteModal(true)
  }

  const handleDeleteActs = async () => {
    try {
      await downloadService.deleteReport(report.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting report:", error)
    }
  }

  // Handler for displaying the Add Act form
  const handleAddNewClick = () => {
    setModal(true)
    setReport(null)
    setIsEdit(false)
    // Reset form validation
    validation.resetForm()
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteActs}
        onCloseClick={() => setDeleteModal(false)}
      />

      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Download" breadcrumbItem="Committee Report" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  {/* Add New Button */}
                  <div className="text-sm-end">
                    <Button
                      type="button"
                      color="primary"
                      className="btn mb-2 me-2"
                      onClick={handleAddNewClick}
                    >
                      <i className="mdi mdi-plus-circle-outline me-1" />
                      Add New
                    </Button>
                  </div>

                  {/* Table */}
                  <TableContainer
                    columns={columns}
                    data={reportList}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className=""
                  />

                  {/* Modal */}
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!report ? "Edit Committee Report" : "Add Committee Report"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={validation.handleSubmit}
                        encType="multipart/form-data"
                      >
                        {/* Form inputs */}
                        <Row form>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">Year</Label>
                              <Input
                                name="reportYear"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.reportYear || ""}
                                invalid={
                                  validation.touched.reportYear &&
                                  validation.errors.reportYear
                                }
                              />
                              {validation.touched.reportYear &&
                                validation.errors.reportYear && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.reportYear}
                                  </FormFeedback>
                                )}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Month</Label>
                              <Input
                                name="reportMonth"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.reportMonth || ""}
                                invalid={
                                  validation.touched.reportMonth &&
                                  validation.errors.reportMonth
                                }
                              />
                              {/*<input*/}
                              {/*  className="form-control"*/}
                              {/*  type="month"*/}
                              {/*  defaultValue="2024-01"*/}
                              {/*  id="example-month-input"*/}
                              {/*/>*/}
                              {validation.touched.reportMonth &&
                                validation.errors.reportMonth && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.reportMonth}
                                  </FormFeedback>
                                )}
                            </div>

                            {/* Name English */}
                            <div className="mb-3">
                              <Label className="form-label">Name English</Label>
                              <Input
                                name="nameEn"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.nameEn || ""}
                                invalid={
                                  validation.touched.nameEn &&
                                  validation.errors.nameEn
                                }
                              />
                              {validation.touched.nameEn &&
                                validation.errors.nameEn && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.nameEn}
                                  </FormFeedback>
                                )}
                            </div>

                            {/* File - English */}
                            <div className="mb-3">
                              <Label className="form-label">File - English</Label>
                              {report && report.reportFileEn ? (
                                <div>
                                  <span className="text-success">{report.reportFileEn.name.split('/').pop()}</span> {/* Extracting file name and applying green color */}
                                  <Input
                                    type="file"
                                    name="reportFileEn"
                                    onChange={event => {
                                      const file = event.currentTarget.files[0];
                                      validation.setFieldValue("reportFileEn", file);
                                    }}
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched.reportFileEn && validation.errors.reportFileEn
                                    }
                                  />
                                  {validation.touched.reportFileEn && validation.errors.reportFileEn && (
                                    <FormFeedback type="invalid">
                                      {validation.errors.reportFileEn}
                                    </FormFeedback>
                                  )}
                                </div>
                              ) : (
                                <Input
                                  type="file"
                                  name="reportFileEn"
                                  onChange={event => {
                                    const file = event.currentTarget.files[0];
                                    validation.setFieldValue("reportFileEn", file);
                                  }}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.reportFileEn && validation.errors.reportFileEn
                                  }
                                />
                              )}
                            </div>


                            {/* Name Sinhala */}
                            <div className="mb-3">
                              <Label className="form-label">Name Sinhala</Label>
                              <Input
                                name="nameSi"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.nameSi || ""}
                                invalid={
                                  validation.touched.nameSi &&
                                  validation.errors.nameSi
                                }
                              />
                              {validation.touched.nameSi &&
                                validation.errors.nameSi && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.nameSi}
                                  </FormFeedback>
                                )}
                            </div>

                            {/* File - Sinhala */}
                            <div className="mb-3">
                              <Label className="form-label">File - Sinhala</Label>
                              {report && report.reportFileSi ? (
                                <div>
                                  <span className="text-success">{report.reportFileSi.name.split('/').pop()}</span> {/* Extracting file name and applying green color */}
                                  <Input
                                    type="file"
                                    name="reportFileSi"
                                    onChange={event => {
                                      const file = event.currentTarget.files[0];
                                      validation.setFieldValue("reportFileSi", file);
                                    }}
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched.reportFileSi && validation.errors.reportFileSi
                                    }
                                  />
                                  {validation.touched.reportFileSi && validation.errors.reportFileSi && (
                                    <FormFeedback type="invalid">
                                      {validation.errors.reportFileSi}
                                    </FormFeedback>
                                  )}
                                </div>
                              ) : (
                                <Input
                                  type="file"
                                  name="reportFileSi"
                                  onChange={event => {
                                    const file = event.currentTarget.files[0];
                                    validation.setFieldValue("reportFileSi", file);
                                  }}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.reportFileSi && validation.errors.reportFileSi
                                  }
                                />
                              )}
                            </div>

                            {/* Name Tamil */}
                            <div className="mb-3">
                              <Label className="form-label">Name Tamil</Label>
                              <Input
                                name="nameTa"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.nameTa || ""}
                                invalid={
                                  validation.touched.nameTa &&
                                  validation.errors.nameTa
                                }
                              />
                              {validation.touched.nameTa &&
                                validation.errors.nameTa && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.nameTa}
                                  </FormFeedback>
                                )}
                            </div>

                            {/* File - Tamil */}
                            <div className="mb-3">
                              <Label className="form-label">File - Tamil</Label>
                              {report && report.reportFileTa ? (
                                <div>
                                  <span className="text-success">{report.reportFileTa.name.split('/').pop()}</span> {/* Extracting file name and applying green color */}
                                  <Input
                                    type="file"
                                    name="reportFileTa"
                                    onChange={event => {
                                      const file = event.currentTarget.files[0];
                                      validation.setFieldValue("reportFileTa", file);
                                    }}
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched.reportFileTa && validation.errors.reportFileTa
                                    }
                                  />
                                  {validation.touched.reportFileTa && validation.errors.reportFileTa && (
                                    <FormFeedback type="invalid">
                                      {validation.errors.reportFileTa}
                                    </FormFeedback>
                                  )}
                                </div>
                              ) : (
                                <Input
                                  type="file"
                                  name="reportFileTa"
                                  onChange={event => {
                                    const file = event.currentTarget.files[0];
                                    validation.setFieldValue("reportFileTa", file);
                                  }}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.reportFileTa && validation.errors.reportFileTa
                                  }
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                        {/* Submit button */}
                        <Row>
                          <Col>
                            <div className="text-end">
                              <button
                                type="submit"
                                className="btn btn-success save-user"
                              >
                                Save
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </ModalBody>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(CommitteeReport)
