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
import TableContainer from "../../../components/Common/TableContainer"
import DeleteModal from "components/Common/DeleteModal"
import Swal from "sweetalert2"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import officerService from "../../../services/OfficerService"
import Select from "react-select"

const Position = () => {
  document.title = "Admin | PDPS"

  // State variables
  const [refreshTable, setRefreshTable] = useState(false)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [postList, setPostList] = useState([])
  const [post, setPost] = useState(null)
  const [services, setServices] = useState([])
  const [serviceEdit, setServiceEdit] = useState({})
  const [levels, setLevels] = useState([])
  const [levelEdit, setLevelEdit] = useState({})

  const baseUrl = "http://127.0.0.1:8000"

 // Fetch all services on component mount using getService
 useEffect(() => {
  const fetchServices = async () => {
    const result = await officerService.getService()
    if (result?.AllServices) {
      setServices(result.AllServices)
    } else {
      console.error("Error fetching services:", result)
    }
  }
  fetchServices()
}, [])

  // Fetch all levels 
  useEffect(() => {
    const fetchLevels = async () => {
      const result = await officerService.getLevel()
      if (result?.AllLevels) {
        setLevels(result.AllLevels)
        // console.log(levels)
      } else {
        console.error("Error fetching levels:", result)
      }
    }
    fetchLevels()
  }, [])

  //View data in the table
  const fetchData = async () => {
    try {
      const fetchedData = await officerService.getPosition()
      
      const allPostArray = fetchedData.AllPositions || []

      const mappedData = allPostArray.map((item, index) => {
        return {
          displayId: allPostArray.length - index,
          id: item.id,
          postEn: item.position_en,
          postSi: item.position_si,
          postTa: item.position_ta,
          serviceId:item.service.id,
          serviceEn: item.service.sname_en,
          levelId:item.level.id,
          levelEn: item.level.level_en,
        }
      })
      setPostList(mappedData)
    } catch (error) {
      console.error("Error fetching post data:", error)
    }
  }

  // Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      postEn: (post && post.postEn) || "",
      postSi: (post && post.postSi) || "",
      postTa: (post && post.postTa) || "",
      service: post?.service?.value || "",
      level: post?.level?.value || "",
    },
    validationSchema: Yup.object({
      postEn: Yup.string().required("Please Enter Post Name in English"),
      postSi: Yup.string().required("Please Enter Post Name in Sinhala"),
      postTa: Yup.string().required("Please Enter Post Name in Tamil"),
      service: Yup.string().required("Please Select Service"),
      level: Yup.string().required("Please Select Post Level"),
    }),
    onSubmit: handleSubmit,
  })

  // Submit handler
  async function handleSubmit(values) {
    // console.log("Form values before submission:", values);
    try {
      const formData = new FormData()
      formData.append("postEn", values.postEn)
      formData.append("postSi", values.postSi)
      formData.append("postTa", values.postTa)
      formData.append("service", values.service)
      formData.append("level", values.level)
      let result
      if (isEdit) {
        formData.append("id", post.id)
        // console.log(post.id)
        formData.append("_method", "PUT")
        result = await officerService.editPosition(formData)
      } else {
        result = await officerService.addPosition(formData)
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
            ? "Post Edited Successfully!"
            : "Post Added Successfully!",
          "",
          "success"
        )
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
      }
    } catch (error) {
      Swal.fire(
        "Error",
        `An error occurred while ${isEdit ? "editing" : "adding"} post`,
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
  const handleUserClick = postData => {
    // console.log("Post Data:", postData); 
  
    const selectedLevel = {
      value: postData.levelId,  // Access the level ID
      label: postData.levelEn,  // Access the level label
    };

    const selectedService = {
      value: postData.serviceId,  // Access the service ID
      label: postData.serviceEn,  // Access the service label
    };
  
    // console.log("Selected Level:", selectedLevel);
    setPost({
      id: postData.id,
      postEn: postData.postEn,
      postSi: postData.postSi,
      postTa: postData.postTa,
      service: selectedService,
      level: selectedLevel,  
    });
    setServiceEdit(selectedService); // Set the selected service
    setLevelEdit(selectedLevel); // Set the selected level
    // console.log("Level Edit:", levelEdit);
    setIsEdit(true);  // Toggle edit mode
    toggle();  // Open the modal
  };


  // Delete post
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = post => {
    setPost(post)
    setDeleteModal(true)
  }

  const handleDeleteDuty = async () => {
    try {
      await officerService.deletePosition(post.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  // Add new post
  const handleAddNewClick = () => {
    setServiceEdit(null)
    setLevelEdit(null)
    setModal(true)
    setPost(null)
    setIsEdit(false)
    validation.resetForm()
  }

 
  // Columns configuration
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "displayId",
        disableFilters: true,
      },

      {
        Header: "Post",
        accessor: "postEn",
        disableFilters: true,
      },

      {
        Header: "Service",
        accessor: "serviceEn",
        disableFilters: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-3">
            <Link
              to="#"
              className="text-success"
              onClick={() => handleUserClick(row.original)}
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              <UncontrolledTooltip placement="top" target="edittooltip">
                Edit
              </UncontrolledTooltip>
            </Link>
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
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteDuty}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Post" breadcrumbItem="Post List" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
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
                  <TableContainer
                    columns={columns}
                    data={postList}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className=""
                  />
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!post ? "Edit Post" : "Add Post"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={validation.handleSubmit}
                        encType="multipart/form-data"
                      >
                        <Row form>
                          <Col xs={12}>
                            {/* Service */}
                            <div className="mb-3">
                              <Label className="form-label">Service</Label>
                              <Select
                                name="service"
                                isMulti={false}
                                value={serviceEdit} // Selected service state
                                onChange={selectedOption => {
                                  setServiceEdit(selectedOption) // Set selected service                      
                                  validation.setFieldValue(
                                    "service",
                                    selectedOption?.value
                                  ) // Update Formik's value for service
                                }}
                                options={(services || []).map(service => ({
                                  value: service.id,
                                  label: service.sname_en, // Mapping services to Select options
                                }))}
                                onBlur={() =>
                                  validation.setFieldTouched("service", true)
                                } // Formik validation
                                className={
                                  validation.touched.service &&
                                  validation.errors.service
                                    ? "is-invalid"
                                    : ""
                                }
                              />
                              {validation.touched.service &&
                                validation.errors.service && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.service}
                                  </FormFeedback>
                                )}
                            </div>
                            {/* Post Level */}
                            <div className="mb-3">
                              <Label className="form-label">Post Level</Label>
                              <Select
                                name="level"
                                isMulti={false}
                                value={levelEdit} // Selected level state
                                onChange={selectedOption => {
                                  setLevelEdit(selectedOption) // Set selected level                       
                                  validation.setFieldValue(
                                    "level",
                                    selectedOption?.value
                                  ) // Update Formik's value for level
                                  // console.log("Formik level value:", validation.values.level);
                                }}
                                options={(levels || []).map(level => ({
                                  value: level.id,
                                  label: level.level_en, // Mapping levels to Select options
                                }))}
                                onBlur={() =>
                                  validation.setFieldTouched("level", true)
                                } // Formik validation
                                className={
                                  validation.touched.level &&
                                  validation.errors.level
                                    ? "is-invalid"
                                    : ""
                                }
                              />
                              {validation.touched.level &&
                                validation.errors.level && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.level}
                                  </FormFeedback>
                                )}
                            </div>

                            {/* Post Name - English */}
                            <div className="mb-3">
                              <Label htmlFor="postEn"> Post Name - English </Label>
                              <Input
                                id="postEn"
                                name="postEn"
                                type="text"
                                className="form-control"
                                placeholder="Post in English"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.postEn || ""}
                                invalid={
                                  validation.touched.postEn &&
                                  validation.errors.postEn
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.postEn &&
                              validation.errors.postEn ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.postEn}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/* Post Name - Sinhala */}
                            <div className="mb-3">
                              <Label htmlFor="postSi"> Post Name - Sinhala </Label>
                              <Input
                                id="postSi"
                                name="postSi"
                                type="text"
                                className="form-control"
                                 placeholder="තනතුර සිංහ‌ල භාෂාවෙන්"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.postSi || ""}
                                invalid={
                                  validation.touched.postSi &&
                                  validation.errors.postSi
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.postSi &&
                              validation.errors.postSi ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.postSi}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/* Post Name - Tamil */}
                            <div className="mb-3">
                              <Label htmlFor="postTa">
                                {" "}
                                Post Name - Tamil{" "}
                              </Label>
                              <Input
                                id="postTa"
                                name="postTa"
                                type="text"
                                className="form-control"
                                placeholder="தமிழில் இடுகையிடவும்"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.postTa || ""}
                                invalid={
                                  validation.touched.postTa &&
                                  validation.errors.postTa
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.postTa &&
                              validation.errors.postTa ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.postTa}
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
                                {" "}
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

Position.propTypes = {
  // Define prop types if needed
}

export default Position
