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
  Button,
} from "reactstrap"
import Select from "react-select"
import * as Yup from "yup"
import { useFormik } from "formik"
import DeleteModal from "components/Common/DeleteModal"
import projectService from "../../services/ProjectService"
import Swal from "sweetalert2"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import DatePicker from "react-datepicker"
import Dropzone from "react-dropzone"


const Project = props => {
  // Meta title
  document.title = "Admin | PDPS"
  const [projectList, setProjectList] = useState([])
  const [project, setProject] = useState()
  const [refreshTable, setRefreshTable] = useState(false)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  //-----------------------------------------------------------------------------
  const [selectedFiles, setselectedFiles] = useState([])

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )

    setselectedFiles(files)
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }
//-----------------------------------------------------------------------------
  const startDateChange = startDate => {
    setStartDate(startDate);
  };

  const endDateChange = endDate => {
    setEndDate(endDate);
  };
  // Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  // Fetch data
  const fetchData = async () => {
    try {
      const fetchedData = await projectService.getProject()
      console.log(fetchedData)
      const allProjectArray = fetchedData.AllProjects || []
      const mappedData = allProjectArray.map((item, index) => ({
        displayId: allProjectArray.length - index,
        id: item.id,
        nameEn: item.name_en,
        nameSi: item.name_si,
        nameTa: item.name_ta,
        descriptionEn: item.description_en,
        descriptionSi: item.description_si,
        descriptionTa: item.description_ta,
        executorEn: item.executor_en,
        executorSi: item.executor_si,
        executorTa: item.executor_ta,
        startDate: item.start_date,
        endDate: item.finish_date,
        budget: item.budget,
        status: item.status,
      }))
      setProjectList(mappedData)
    } catch (error) {
      console.error("Error fetching project data:", error)
    }
  }

  //---------------------------- Validation---------------------------------------------
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (project && project.id) || "",
      nameEn: (project && project.nameEn) || "",
      nameSi: (project && project.nameSi) || "",
      nameTa: (project && project.nameTa) || "",
      descriptionEn: (project && project.descriptionEn) || "",
      descriptionSi: (project && project.descriptionSi) || "",
      descriptionTa: (project && project.descriptionTa) || "",
      executorEn: (project && project.executorEn) || "",
      executorSi: (project && project.executorSi) || "",
      executorTa: (project && project.executorTa) || "",
      startDate: (project && project.startDate) || "",
      endDate: (project && project.endDate) || "",
      budget: (project && project.budget) || "",
      status: (project && project.status) || "",
    },
    validationSchema: Yup.object({
      nameEn: Yup.string().required("Please Enter Name in English"),
      nameSi: Yup.string().required("Please Enter Name in Sinhala"),
      nameTa: Yup.string().required("Please Enter Name in Tamil"),
      descriptionEn: Yup.string().required("Please Enter Description in English"),
      descriptionSi: Yup.string().required("Please Enter Description in Sinhala"),
      descriptionTa: Yup.string().required("Please Enter Description in Tamil"),
      executorEn: Yup.string().required("Please Enter Executing Institute in English"),
      executorSi: Yup.string().required("Please Enter Executing Institute in Sinhala"),
      executorTa: Yup.string().required("Please Enter Executing Institute in Tamil"),
      // startDate: Yup.date().required("Please Enter Project Start Date"),
      // endDate: Yup.date().required("Please Enter Project End Date"),
      budget: Yup.string().required("Please Enter Budget"),
      status: Yup.number().required("Please Select Project Status"),
    }),

    onSubmit: async values => {
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();
      //---------------edit---------------------------------------
      if (isEdit) {
        try{
          const formData = new FormData()
          formData.append("id", values.id)
          formData.append("nameEn", values.nameEn)
          formData.append("nameSi", values.nameSi)
          formData.append("nameTa", values.nameTa)
          formData.append("descriptionEn", values.descriptionEn)
          formData.append("descriptionSi", values.descriptionSi)
          formData.append("descriptionTa", values.descriptionTa)
          formData.append("executorEn", values.executorEn)
          formData.append("executorSi", values.executorSi)
          formData.append("executorTa", values.executorTa)
          formData.append("startDate", formattedStartDate)
          formData.append("endDate", formattedEndDate)
          formData.append("budget", values.budget)
          formData.append("status", values.status)
          formData.append('_method', 'PUT');
          const { result, errorMessage } = await projectService.editProject(
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
            await Swal.fire("Project Edited Successfully!", "", "success")
            setRefreshTable(prevRefresh => !prevRefresh)
            validation.resetForm()
          }
        } catch (error) {
          Swal.fire("Error", "An error occurred while editing project", "error")
        }
      } else {
        //---------------add---------------------------------------
        try {
          const formData = new FormData()
          formData.append("nameEn", values.nameEn)
          formData.append("nameSi", values.nameSi)
          formData.append("nameTa", values.nameTa)
          formData.append("descriptionEn", values.descriptionEn)
          formData.append("descriptionSi", values.descriptionSi)
          formData.append("descriptionTa", values.descriptionTa)
          formData.append("executorEn", values.executorEn)
          formData.append("executorSi", values.executorSi)
          formData.append("executorTa", values.executorTa)
          formData.append("startDate", formattedStartDate)
          formData.append("endDate", formattedEndDate)
          formData.append("budget", values.budget)
          formData.append("status", values.status)
          // console.log(formData)
          const { result, errorMessage } = await projectService.addProject(
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
            await Swal.fire("Project Added Successfully!", "", "success")
            setRefreshTable(prevRefresh => !prevRefresh)
            validation.resetForm()
          }
        } catch (error) {
          Swal.fire("Error", "An error occurred while adding project", "error")
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
        Header: "Project",
        accessor: "nameEn",
        disableFilters: true,

      },

      {
        Header: "Executor",
        accessor: "executorEn",
        disableFilters: true,

      },

      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: cellProps => {
          let statusText
          switch (cellProps.value) {
            case 1:
              statusText = "Not Started"
              break
            case 2:
              statusText = "Ongoing"
              break
            case 3:
              statusText = "Completed"
              break
            // default:
            //   statusText = "Unknown";
          }
          return <span>{statusText}</span>
        },
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
                  const projectData = cellProps.row.original
                  handleUserClick(projectData)
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
    if (project && project.length === 0) {
      setIsEdit(false) // No project to edit, so set isEdit to false
    }
  }, [project])

  const handleUserClick = arg => {
    const projectData = arg
    setProject({
      id: projectData.id,
      nameEn: projectData.nameEn,
      nameSi: projectData.nameSi,
      nameTa: projectData.nameTa,
      descriptionEn: projectData.descriptionEn,
      descriptionSi: projectData.descriptionSi,
      descriptionTa: projectData.descriptionTa,
      executorEn: projectData.executorEn,
      executorSi: projectData.executorSi,
      executorTa: projectData.executorTa,
      startDate: projectData.startDate ? new Date(projectData.startDate) : null,
      endDate: projectData.endDate ? new Date(projectData.endDate) : null,
      budget: projectData.budget,
      status: projectData.status,
    })
    // console.log("en",projectData.nameEn)
    setIsEdit(true) // Set isEdit to true when clicking to edit
    setStartDate(projectData.startDate ? new Date(projectData.startDate) : new Date()); // Set start date based on projectData
    setEndDate(projectData.endDate ? new Date(projectData.endDate) : new Date()); // Set end date based on projectData
    toggle()
  }

  // Delete project
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = project => {
    setProject(project)
    setDeleteModal(true)
  }

  const handleDeleteActs = async () => {
    try {
      await projectService.deleteProject(project.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  // Handler for displaying the Add Project form
  const handleAddNewClick = () => {
    setModal(true)
    setProject(null)
    setIsEdit(false)
    setStartDate(new Date());// Reset startDate to current date
    setEndDate(new Date());
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
          <Breadcrumbs title="Download" breadcrumbItem="Project" />
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
                    data={projectList}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className=""
                  />

                  {/* Modal */}
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!project ? "Edit Project" : "Add Project"}
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
                              <Label className="form-label"> Name (English)</Label>
                              <Input
                                name="nameEn"
                                type="text"
                                placeholder="Enter Project Name..."
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.nameEn || ""}
                                invalid={
                                  validation.touched.nameEn &&
                                  validation.errors.nameEn
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.nameEn &&
                              validation.errors.nameEn ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.nameEn}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label htmlFor="topicEn"> Album Title - English </Label>
                              <Input
                                id="topicEn"
                                name="topicEn"
                                type="text"
                                className="form-control"
                                placeholder="Add Album Title"
                              />
                            </div>

                            <div className="mb-3">
                              <Label htmlFor="topicSi"> Album Title - Sinhala </Label>
                              <Input
                                id="topicSi"
                                name="topicSi"
                                type="text"
                                className="form-control"
                                placeholder="ඇල්බමයෙ මාතෘකාව ඇතුලත් කරන්න"
                              />
                            </div>

                            <div className="mb-3">
                              <Label htmlFor="topicTa"> Album Title - Tamil </Label>
                              <Input
                                id="topicTa"
                                name="topicTa"
                                type="text"
                                className="form-control"
                                placeholder="ஆல்பத்தின் தலைப்பைச் சேர்க்கவும்"
                              />
                            </div>

                            <div className="mb-3">
                              <Label htmlFor="albumimages">Album Images</Label>
                              <Dropzone
                                onDrop={acceptedFiles => {
                                  handleAcceptedFiles(acceptedFiles)
                                }}
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div className="dropzone">
                                    <div
                                      className="dz-message needsclick"
                                      {...getRootProps()}
                                    >
                                      <input {...getInputProps()} />
                                      <div className="dz-message needsclick">
                                        <div className="mb-3">
                                          <i className="display-4 text-muted bx bxs-cloud-upload" />
                                        </div>
                                        <h4>Drop files here or click to upload.</h4>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                            </div>


                            <div className="dropzone-previews mt-3" id="file-previews">
                              {selectedFiles.map((f, i) => {
                                return (
                                  <Card
                                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                    key={i + "-file"}
                                  >
                                    <div className="p-2">
                                      <Row className="align-items-center">
                                        <Col className="col-auto">
                                          <img
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={f.preview}
                                          />
                                        </Col>
                                        <Col>
                                          <Link
                                            to="#"
                                            className="text-muted font-weight-bold"
                                          >
                                            {f.name}
                                          </Link>
                                          <p className="mb-0">
                                            <strong>{f.formattedSize}</strong>
                                          </p>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Card>
                                )
                              })}
                            </div>


                          </Col>
                        </Row>
                        {/* Submit button */}
                        <Row>
                          <Col>
                            <div className="text-end d-flex gap-3">
                              <button type="submit" className="btn btn-success save-user"> Save </button>
                              <button type="button" className="btn btn-secondary" >Close</button>
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

export default withRouter(Project)
