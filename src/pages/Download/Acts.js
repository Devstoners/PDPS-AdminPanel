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


const Acts = props => {
  // Meta title
  document.title = "Admin | PDPS"
  const [actsList, setActsList] = useState([])
  const [acts, setActs] = useState()
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
      const fetchedData = await downloadService.getActs()
      console.log(fetchedData)
      const allActsArray = fetchedData.AllActs || []
      const mappedData = allActsArray.map((item, index) => ({
        displayId: allActsArray.length - index,
        id: item.id,
        actNumber: item.number,
        actDate: item.issue_date,
        nameEn: item.name_en,
        nameSi: item.name_si,
        nameTa: item.name_ta,
        actFileEn: item.file_path_en ? { name: item.file_path_en } : null,
        actFileSi: item.file_path_si ? { name: item.file_path_si } : null,
        actFileTa: item.file_path_ta ? { name: item.file_path_ta } : null,
      }))
      setActsList(mappedData)
    } catch (error) {
      console.error("Error fetching acts data:", error)
    }
  }

  //---------------------------- Validation---------------------------------------------
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (acts && acts.id) || "",
      actNumber: (acts && acts.actNumber) || "",
      actDate: (acts && acts.actDate) || "",
      nameEn: (acts && acts.nameEn) || "",
      nameSi: (acts && acts.nameSi) || "",
      nameTa: (acts && acts.nameTa) || "",
      actFileEn: (acts && acts.actFileEn) || null,
      actFileSi: (acts && acts.actFileSi) || null,
      actFileTa: (acts && acts.actFileTa) || null,
    },
    validationSchema: Yup.object({
      actNumber: Yup.string().required("Please Enter Act Number"),
      actDate: Yup.date().required("Please Enter Act Date"),
      nameEn: Yup.string().required("Please Enter Name in English"),
      nameSi: Yup.string().required("Please Enter Name in Sinhala"),
      nameTa: Yup.string().required("Please Enter Name in Tamil"),
      // actFileEn: Yup.mixed().test(
      //   "fileType",
      //   "Invalid file type. Only PDF files are allowed.",
      //   value => {
      //     // Skip validation if no new file is selected
      //     if (!value || !(value instanceof File)) return true;
      //     return value.type === "application/pdf";
      //   }
      // ),
      // actFileSi: Yup.mixed().test(
      //   "fileType",
      //   "Invalid file type. Only PDF files are allowed.",
      //   value => {
      //     // Skip validation if no new file is selected
      //     if (!value || !(value instanceof File)) return true;
      //     return value.type === "application/pdf";
      //   }
      // ),
      // actFileTa: Yup.mixed().test(
      //   "fileType",
      //   "Invalid file type. Only PDF files are allowed.",
      //   value => {
      //     // Skip validation if no new file is selected
      //     if (!value || !(value instanceof File)) return true;
      //     return value.type === "application/pdf";
      //   }
      // ),


    }),

    onSubmit: async values => {
      //---------------edit---------------------------------------
      if (isEdit) {
        try{
          const formData = new FormData()
          formData.append("id", values.id)
          formData.append("actNumber", values.actNumber)
          formData.append("actDate", values.actDate)
          formData.append("nameEn", values.nameEn)
          formData.append("nameSi", values.nameSi)
          formData.append("nameTa", values.nameTa)
          // formData.append("actFileEn", values.actFileEn)
          // formData.append("actFileSi", values.actFileSi)
          // formData.append("actFileTa", values.actFileTa)
          // formData.append("actFileEn", values.actFileEn)
          // formData.append("actFileSi", values.actFileSi)
          // formData.append("actFileTa", values.actFileTa)
          // formData.forEach((value, key) => {
          //   console.log(key, value);
          // });

          const { result, errorMessage } = await downloadService.editActs(
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
            await Swal.fire("Acts Edited Successfully!", "", "success")
            setRefreshTable(prevRefresh => !prevRefresh)
            validation.resetForm()
          }
        } catch (error) {
          Swal.fire("Error", "An error occurred while editing acts", "error")
        }
      } else {
        //---------------add---------------------------------------
        try {
          const formData = new FormData()
          formData.append("actNumber", values.actNumber)
          formData.append("actDate", values.actDate)
          formData.append("nameEn", values.nameEn)
          formData.append("nameSi", values.nameSi)
          formData.append("nameTa", values.nameTa)
          formData.append("actFileEn", values.actFileEn)
          formData.append("actFileSi", values.actFileSi)
          formData.append("actFileTa", values.actFileTa)
          // console.log(formData)
          const { result, errorMessage } = await downloadService.addActs(
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
            await Swal.fire("Acts Added Successfully!", "", "success")
            setRefreshTable(prevRefresh => !prevRefresh)
            validation.resetForm()
          }
        } catch (error) {
          Swal.fire("Error", "An error occurred while adding acts", "error")
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
        Header: "Number",
        accessor: "actNumber",
        disableFilters: true,
      },
      {
        Header: "Date",
        accessor: "actDate",
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
                  const actsData = cellProps.row.original
                  handleUserClick(actsData)
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
    if (acts && acts.length === 0) {
      setIsEdit(false) // No acts to edit, so set isEdit to false
    }
  }, [acts])

  const handleUserClick = arg => {
    const actsData = arg
    setActs({
      id: actsData.id,
      actNumber: actsData.actNumber,
      actDate: actsData.actDate,
      nameEn: actsData.nameEn,
      nameSi: actsData.nameSi,
      nameTa: actsData.nameTa,
      actFileEn: actsData.actFileEn,
      actFileSi: actsData.actFileSi,
      actFileTa: actsData.actFileTa,
    })
    // console.log("en",actsData.nameEn)
    setIsEdit(true) // Set isEdit to true when clicking to edit
    toggle()
  }

  // Delete acts
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = acts => {
    setActs(acts)
    setDeleteModal(true)
  }

  const handleDeleteActs = async () => {
    try {
      await downloadService.deleteActs(acts.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting acts:", error)
    }
  }

  // Handler for displaying the Add Act form
  const handleAddNewClick = () => {
    setModal(true)
    setActs(null)
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
                    data={actsList}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className=""
                  />

                  {/* Modal */}
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!acts ? "Edit Acts" : "Add Acts"}
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
                              <Label className="form-label">Number</Label>
                              <Input
                                name="actNumber"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.actNumber || ""}
                                invalid={
                                  validation.touched.actNumber &&
                                  validation.errors.actNumber
                                }
                              />
                              {validation.touched.actNumber &&
                                validation.errors.actNumber && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.actNumber}
                                  </FormFeedback>
                                )}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Date</Label>
                              <Input
                                name="actDate"
                                type="date"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.actDate || ""}
                                invalid={
                                  validation.touched.actDate &&
                                  validation.errors.actDate
                                }
                              />
                              {validation.touched.actDate &&
                                validation.errors.actDate && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.actDate}
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
                              {acts && acts.actFileEn ? (
                                <div>
                                  <span className="text-success">{acts.actFileEn.name.split('/').pop()}</span> {/* Extracting file name and applying green color */}
                                  <Input
                                    type="file"
                                    name="actFileEn"
                                    onChange={event => {
                                      const file = event.currentTarget.files[0];
                                      validation.setFieldValue("actFileEn", file);
                                    }}
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched.actFileEn && validation.errors.actFileEn
                                    }
                                  />
                                  {validation.touched.actFileEn && validation.errors.actFileEn && (
                                    <FormFeedback type="invalid">
                                      {validation.errors.actFileEn}
                                    </FormFeedback>
                                  )}
                                </div>
                              ) : (
                                <Input
                                  type="file"
                                  name="actFileEn"
                                  onChange={event => {
                                    const file = event.currentTarget.files[0];
                                    validation.setFieldValue("actFileEn", file);
                                  }}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.actFileEn && validation.errors.actFileEn
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
                              {acts && acts.actFileSi ? (
                                <div>
                                  <span className="text-success">{acts.actFileSi.name.split('/').pop()}</span> {/* Extracting file name and applying green color */}
                                  <Input
                                    type="file"
                                    name="actFileSi"
                                    onChange={event => {
                                      const file = event.currentTarget.files[0];
                                      validation.setFieldValue("actFileSi", file);
                                    }}
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched.actFileSi && validation.errors.actFileSi
                                    }
                                  />
                                  {validation.touched.actFileSi && validation.errors.actFileSi && (
                                    <FormFeedback type="invalid">
                                      {validation.errors.actFileSi}
                                    </FormFeedback>
                                  )}
                                </div>
                              ) : (
                                <Input
                                  type="file"
                                  name="actFileSi"
                                  onChange={event => {
                                    const file = event.currentTarget.files[0];
                                    validation.setFieldValue("actFileSi", file);
                                  }}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.actFileSi && validation.errors.actFileSi
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
                              {acts && acts.actFileTa ? (
                                <div>
                                  <span className="text-success">{acts.actFileTa.name.split('/').pop()}</span> {/* Extracting file name and applying green color */}
                                  <Input
                                    type="file"
                                    name="actFileTa"
                                    onChange={event => {
                                      const file = event.currentTarget.files[0];
                                      validation.setFieldValue("actFileTa", file);
                                    }}
                                    onBlur={validation.handleBlur}
                                    invalid={
                                      validation.touched.actFileTa && validation.errors.actFileTa
                                    }
                                  />
                                  {validation.touched.actFileTa && validation.errors.actFileTa && (
                                    <FormFeedback type="invalid">
                                      {validation.errors.actFileTa}
                                    </FormFeedback>
                                  )}
                                </div>
                              ) : (
                                <Input
                                  type="file"
                                  name="actFileTa"
                                  onChange={event => {
                                    const file = event.currentTarget.files[0];
                                    validation.setFieldValue("actFileTa", file);
                                  }}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.actFileTa && validation.errors.actFileTa
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

export default withRouter(Acts)
