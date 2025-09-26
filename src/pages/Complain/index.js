import React, { useEffect, useState, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
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
  Button,
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import TableContainer from "../../components/Common/TableContainer"
import DeleteModal from "components/Common/DeleteModal"
import Swal from "sweetalert2"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import ComplainService from "services/ComplainService"
import ComplainDetailsModal from "./ComplainDetailsModal"
import Select from "react-select"

const Complain = props => {
  document.title = "Admin | PDPS"

  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [complainList, setComplainList] = useState([])
  const [complain, setComplain] = useState(null)
  // State variables
  const [refreshTable, setRefreshTable] = useState(false)

  const baseUrl = "http://127.0.0.1:8000"
  const fetchData = async () => {
    try {
      const fetchedData = await ComplainService.getAllcomplain()
      const allComplainArray = fetchedData.data.AllComplains || []
      const mappedData = allComplainArray.map((item, index) => {
        // Truncate the complain text if it exceeds 150 characters
        const truncatedComplain =
          item.complain.length > 150
            ? item.complain.substring(0, 150) + "..."
            : item.complain

        // Format the created_at date
        const dbdateTime = new Date(item.created_at)
        const dbdate = dbdateTime.toISOString().split("T")[0]
        const dbTime = dbdateTime.toLocaleTimeString()

        // Get the action from the related complain_action object (if exists)
        const action = item.complain_action ? item.complain_action.action : null
        const actionCreatedAt = item.complain_action ? item.complain_action.created_at : null

        return {
          displayId: allComplainArray.length - index,
          id: item.id,
          complainTextShort: truncatedComplain,
          complainText: item.complain,
          //View data in the table
          cname: item.cname,
          tel: item.tele,
          cdate: dbdate,
          ctime: dbTime,
          img1: item.img1,
          img2: item.img2,
          img3: item.img3,
          action: action,
          actionCreatedAt: actionCreatedAt,
        }
      })

      setComplainList(mappedData)
    } catch (error) {
      console.error("Error fetching complain data:", error)
    }
  }

  // Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      complainText: (complain && complain.complainText) || "",

      // Form validation
      // cname: (complain && complain.cname) || "",
      // tel: (complain && complain.tel) || "",
      // image1: null,
      action: (complain && complain.action) || "",
    },
    validationSchema: Yup.object({
      // image2: null,
      // image3: null,
      // complainText: Yup.string()
      //   .required("Please Enter Complain")
      //   .max(800, "Complain should not exceed 800 characters"),
      // cname: Yup.string().nullable(),
      // tel: Yup.string()
      //   .nullable()
      //   .matches(/^\d{10}$/, {
      //     message: "Please enter a valid 10-digit telephone number",
      //     excludeEmptyString: true, // Only apply validation if the string is non-empty
      //   }),
      // image1: Yup.mixed()
      //   .nullable()
      //   .notRequired()
      //   .test(
      //     "fileType",
      //     "Invalid file type. Only JPG files are allowed.",
      //     value => {
      //       if (!value || typeof value === "string") return true
      //       return value && value.type === "image/jpeg"
      //     }
      //   )
      //   .test("fileSize", "File size too large. Max size is 8MB.", value => {
      //     if (!value || typeof value === "string") return true
      //     return value && value.size <= 8 * 1024 * 1024
      //   }),

      // image2: Yup.mixed()
      //   .nullable()
      //   .notRequired()
      //   .test(
      //     "fileType",
      //     "Invalid file type. Only JPG files are allowed.",
      //     value => {
      //       if (!value || typeof value === "string") return true
      //       return value && value.type === "image/jpeg"
      //     }
      //   )
      //   .test("fileSize", "File size too large. Max size is 8MB.", value => {
      //     if (!value || typeof value === "string") return true
      //     return value && value.size <= 8 * 1024 * 1024
      //   }),

      // image3: Yup.mixed()
      //   .nullable()
      //   .notRequired()
      //   .test(
      //     "fileType",
      //     "Invalid file type. Only JPG files are allowed.",
      //     value => {
      //       if (!value || typeof value === "string") return true
      //       return value && value.type === "image/jpeg"
      //     }
      //   )
      //   .test("fileSize", "File size too large. Max size is 8MB.", value => {
      //     if (!value || typeof value === "string") return true
      action: Yup.string()
        .required("Please Enter action")
        .max(500, "Action should not exceed 500 characters"),
    }),
    onSubmit: handleSubmit,
  })
  //     return value && value.size <= 8 * 1024 * 1024
  //   }),

  // Submit handler
  async function handleSubmit(values) {
    // console.log("Form values before submission:", values);
    try {
      const formData = new FormData()
      let result
      formData.append("action", values.action)
      formData.append("id", complain.id)
      if (isEdit) {
        formData.append("_method", "PUT")
        result = await ComplainService.editAction(formData)
      } else {
        result = await ComplainService.addAction(formData)
      }

      if (result.errorMessage) {
        const formattedErrorMessage = result.errorMessage.replace(/\n/g, "<br>")
        Swal.fire({
          title: "Error",
          html: formattedErrorMessage,
          icon: "error",
          allowOutsideClick: false,
        })
      } else {
        await Swal.fire(
          isEdit
            ? "Complain Action Edited Successfully!"
            : "Complain Action Added Successfully!",
          "",
          "success"
        )
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
      }
    } catch (error) {
      Swal.fire(
        "Error",
        `An error occurred while ${
          isEdit ? "editing" : "adding"
        } complain action`,
        "error"
      )
    }
    toggle()
  }

  // Modal toggle function
  const toggle = () => {
    setModal(!modal)
  }

  // Handle edit click
  const handleEditClick = complain => {
    setComplain({
      id: complain.id,
      complainText: complain.complainText, // Set complainText for display
      action: complain.action || "", // Set existing action for editing
    })
    setIsEdit(true) // Toggle edit mode
    toggle() // Open the modal
  }

  // Delete complain
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = complain => {
    setComplain(complain)
    setDeleteModal(true)
  }

  const handleDelete = async () => {
    try {
      await ComplainService.deleteComplain(complain.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting complain:", error)
    }
  }

  //Model1 toggle
  const toggleViewModal1 = (complaintData) => {
    setComplain(complaintData)
    setModal1(!modal1)
  }

  //Handle Add click
  const handleAddClick = complain => {
    setComplain({
      id: complain.id,
      complainText: complain.complainText, // Set complainText for display
      action: "", // Empty action for new feedback
    })
    setIsEdit(false) // Toggle add mode
    toggle() // Open the modal
    validation.resetForm() // Reset form values
  }

  // Columns configuration
  const columns = useMemo(
    // Add new complain

    () => [
      {
        Header: "ID",
        accessor: "displayId",
        disableFilters: true,
      },

      {
        Header: "Complain",
        accessor: "complainTextShort",
        disableFilters: true,
      },

      {
        Header: "Date",
        accessor: "cdate",
        disableFilters: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => {
          const { action } = row.original // Access the action from the row data

          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => toggleViewModal1(row.original)}
              >
                <i
                  className="mdi mdi-open-in-new font-size-18"
                  id="viewtooltip"
                />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View More
                </UncontrolledTooltip>
              </Link>

              {action ? ( // Check if action exists
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => handleEditClick(row.original)} // Call edit function
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit Action
                  </UncontrolledTooltip>
                </Link>
              ) : (
                <Link
                  to="#"
                  className="text-primary"
                  onClick={() => handleAddClick(row.original)} // Call add function
                >
                  <i
                    className="mdi mdi-plus-circle font-size-18"
                    id="addtooltip"
                  />
                  <UncontrolledTooltip placement="top" target="addtooltip">
                    Add Action
                  </UncontrolledTooltip>
                </Link>
              )}

              <Link
                to="#"
                className="text-danger"
                onClick={() => onClickDelete(row.original)}
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

  return (
    <React.Fragment>
      <ComplainDetailsModal isOpen={modal1} toggle={toggleViewModal1} complaint={complain} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Complain" breadcrumbItem="Complain List" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={complainList}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className=""
                  />
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {isEdit
                        ? "Edit Complaint Feedback"
                        : "Add Complaint Feedback"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={validation.handleSubmit}
                        encType="multipart/form-data"
                      >
                        <Row form>
                          <Col xs={12}>
                            {/* Complain */}
                            <div className="mb-3">
                              <Label htmlFor="complainText"> Complain </Label>
                              <Input
                                id="complainText"
                                name="complainText"
                                type="textarea"
                                rows={5}
                                className="form-control"
                                disabled={true} // Read-only
                                value={validation.values.complainText || ""} // Display complainText for both Add and Edit
                                invalid={
                                  validation.touched.complainText &&
                                  validation.errors.complainText
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.complainText &&
                              validation.errors.complainText ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.complainText}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/* Action */}
                            <div className="mb-3">
                              <Label htmlFor="action"> Action </Label>
                              <Input
                                id="action"
                                name="action"
                                type="textarea"
                                rows={4}
                                className="form-control"
                                placeholder="Enter Complain Action"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.action || ""} // Ensure action value is set correctly
                                invalid={
                                  validation.touched.action &&
                                  validation.errors.action
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.action &&
                              validation.errors.action ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.action}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>

                        {/* Submit button */}
                        <Row>
                          <Col>
                            <div className="text-end d-flex gap-3">
                              <button
                                type="submit"
                                className="btn btn-success save-user"
                              >
                                Save{" "}
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={toggle}
                              >
                                Close
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
export default withRouter(Complain)
