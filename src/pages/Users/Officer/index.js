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

const Officer = props => {
  document.title = "Admin | PDPS"

  // State variables
  const [officerList, setOfficerList] = useState([])
  const [officer, setOfficer] = useState(null)
  const [refreshTable, setRefreshTable] = useState(false)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [services, setServices] = useState([])
  const [grades, setGrades] = useState([])
  const [selectedService, setSelectedService] = useState("")
  const [positions, setPositions] = useState([])
  const [duties, setDuties] = useState([])
  const [serviceEdit, setServiceEdit] = useState({})
  const [gradeEdit, setGradeEdit] = useState(null)
  const [positionEdit, setPositionEdit] = useState(null)
  const [dutyEdit, setDutyEdit] = useState([])

  const [statusEdit, setStatusEdit] = useState({})

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

  // Fetch grades when a service is selected using getGradesByService
  useEffect(() => {
    const fetchGrades = async () => {
      if (serviceEdit) {
        // console.log("Fetching grades for service ID:", serviceEdit.value)
        try {
          const result = await officerService.getGradesByService(
            serviceEdit.value
          )
          // console.log("Grades fetched:", result)
          if (result) {
            setGrades(result)
          } else {
            console.error("Error fetching grades:", result)
          }
        } catch (error) {
          console.error("Error during fetchGrades:", error)
        }
      }
    }
    fetchGrades()
  }, [serviceEdit]) // Ensure useEffect depends on serviceEdit

  // Fetch positions when a grade is selected
  useEffect(() => {
    if (serviceEdit) {
      const fetchPositions = async () => {
        try {
          const positions = await officerService.getPositionsByGrade(
            serviceEdit.value
          )
          setPositions(positions)
        } catch (error) {
          console.error("Error fetching positions:", error)
        }
      }
      fetchPositions()
    }
  }, [serviceEdit])

  // Fetch duties when a position is selected
  useEffect(() => {
    if (positionEdit) {
      const fetchDuties = async () => {
        try {
          const duties = await officerService.getDutiesByPosition(
            positionEdit.value
          )
          setDuties(duties)
        } catch (error) {
          console.error("Error fetching duties:", error)
        }
      }
      fetchDuties()
    }
  }, [positionEdit])

  //View data in the table & get data to map with form when editing
  const fetchData = async () => {
    try {
      const fetchedData = await officerService.getOfficer()
      const allOfficerArray = fetchedData.AllOfficers || []

      const mappedData = allOfficerArray.map((item, index) => {
        // Extract images property from the item
        const images = item.images || []

        return {
          displayId: allOfficerArray.length - index,
          id: item.id,
          title: item.title,
          nameEn: item.name_en,
          nameSi: item.name_si,
          nameTa: item.name_ta,
          email: item.user?.email || "",
          tel: item.tel,
          img: item.image,
          serviceId: item.officer_service?.id || "",
          service: item.officer_service?.sname_en || "",
          gradeId: item.officer_grade?.id || "",
          grade: item.officer_grade?.grade_en || "",
          positionId: item.officer_position?.id || "",
          position: item.officer_position?.position_en || "",
          // duty: item.officer_subjects?.id,
          // duties,
          duties:
            item.officer_subjects?.map(subject => ({
              subjectId: subject.officer_subjects_id,
              subjectName: subject.subject_en,
            })) || [],
          // status: item.user?.status || "",
          status:
            item.user?.status !== undefined && item.user?.status !== null
              ? item.user.status
              : "",
        }
      })
      setOfficerList(mappedData)
    } catch (error) {
      console.error("Error fetching officer data:", error)
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
      title: (officer && officer.title) || "1",
      nameEn: (officer && officer.nameEn) || "",
      nameSi: (officer && officer.nameSi) || "",
      nameTa: (officer && officer.nameTa) || "",
      email: (officer && officer.email) || "",
      img: null,
      tel: (officer && officer.tel) || "",
      service: officer?.service?.value || "",
      grade: officer?.grade?.value || "",
      position: officer?.position?.value || "",
      duty:
        (officer && officer.subject && officer.subject.map(dut => dut.id)) ||
        [],
      // status: (officer && officer.status) || "",
      // status: statusEdit.value,
      status: (statusEdit && statusEdit.value) || 0,
    },
    validationSchema: Yup.object({
      nameEn: Yup.string().required("Please Enter Name in English"),
      nameSi: Yup.string().required("Please Enter Name in Sinhala"),
      nameTa: Yup.string().required("Please Enter Name in Tamil"),
      email: Yup.string()
        .email("Please enter a valid email")
        .required("Please Enter Email"),
      img: Yup.mixed()
        .nullable()
        .notRequired()
        .test(
          "fileType",
          "Invalid file type. Only JPG files are allowed.",
          value => {
            if (!value || typeof value === "string") return true // Allow empty or existing image URL
            return value && value.type === "image/jpeg"
          }
        )
        .test("fileSize", "File size too large. Max size is 5MB.", value => {
          if (!value || typeof value === "string") return true // Allow empty or existing image URL
          return value && value.size <= 5 * 1024 * 1024
        }),
      tel: Yup.string()
        .matches(/^\d{10}$/, {
          message: "Please enter a valid 10-digit telephone number",
        })
        .required("Please Enter Telephone Number"),
      grade: Yup.string().required("Please Select Grade Name"),
      position: Yup.string().required("Please Select Position Name"),
      service: Yup.string().required("Please Select Service"),
      //duty: Yup.array().min(1, "Please select at least one duty"),
      duty: Yup.array().of(Yup.string()).notRequired(),
    }),
    onSubmit: handleSubmit,
  })

  // Submit handler
  async function handleSubmit(values) {
    try {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("nameEn", values.nameEn)
      formData.append("nameSi", values.nameSi)
      formData.append("nameTa", values.nameTa)
      formData.append("email", values.email)
      formData.append("tel", values.tel)
      formData.append("img", values.img)
      formData.append("grade", values.grade)
      formData.append("position", values.position)
      formData.append("service", values.service)
      values.duty.forEach(dut => {
        formData.append("duty[]", dut)
      })
      formData.append("status", values.status)
      // console.log(formData.getAll("duty"));
      let result
      if (isEdit) {
        formData.append("id", officer.id)
        // console.log(officer.id)

        formData.append("_method", "PUT")
        result = await officerService.editOfficer(formData)
      } else {
        result = await officerService.addOfficer(formData)
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
            ? "Officer Edited Successfully!"
            : "Officer Added Successfully!",
          "",
          "success"
        )
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
      }
    } catch (error) {
      Swal.fire(
        "Error",
        `An error occurred while ${isEdit ? "editing" : "adding"} officer`,
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
  const handleUserClick = arg => {
    const officerData = arg

    const existingImage = officerData.img
      ? {
          name: officerData.img.split("/").pop(),
          size: 0,
          preview: officerData.img,
        }
      : null

    const selectedService = {
      value: officerData.serviceId,
      label: officerData.service,
    }

    const selectedGrade = {
      value: officerData.gradeId,
      label: officerData.grade,
    }

    const selectedPosition = {
      value: officerData.positionId,
      label: officerData.position,
    }

    const selectedDuties = officerData.duties.map(subject => ({
      value: subject.subjectId,
      label: subject.subjectName,
    }))

    const selectedStatus = {
      value: officerData.status,
      label: getStatusLabel(officerData.status),
    }

    setOfficer({
      id: officerData.id,
      title: officerData.title,
      nameEn: officerData.nameEn,
      nameSi: officerData.nameSi,
      nameTa: officerData.nameTa,
      email: officerData.email,
      img: existingImage,
      tel: officerData.tel,
      service: selectedService,
      grade: selectedGrade,
      position: selectedPosition,
      duties: selectedDuties,
      status: officerData.status,
    })
    setServiceEdit(selectedService) // Set for the dropdown
    validation.setFieldValue("service", selectedService.value)

    setGradeEdit(selectedGrade)
    validation.setFieldValue("grade", selectedGrade.value)

    setPositionEdit(selectedPosition)
    validation.setFieldValue("position", selectedPosition.value)

    setDutyEdit(selectedDuties)
    setStatusEdit(selectedStatus)
    setIsEdit(true)
    toggle()
  }

  // Consolidate useEffect for form field updates
  useEffect(() => {
    if (officer) {
      setServiceEdit(officer.service)
      setGradeEdit(officer.grade)
      setPositionEdit(officer.position)

      // For duties, check if there are any and map them correctly
      if (officer.duties.length > 0) {
        setDutyEdit(officer.duties)
      }

      // Update status
      setStatusEdit({
        value: officer.status,
        label: getStatusLabel(officer.status),
      })
    }
  }, [officer])

  // Status label mapping
  const getStatusLabel = statusValue => {
    switch (statusValue) {
      case 0:
        return "Unregistered"
      case 1:
        return "Active"
      case 2:
        return "Disabled"
      default:
        return "Unknown"
    }
  }

  // Function to handle status change
  const handleStatusChange = selectedOption => {
    setStatusEdit(selectedOption)
  }

  // Delete officer
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = officer => {
    setOfficer(officer)
    setDeleteModal(true)
  }

  const handleDeleteOfficer = async () => {
    try {
      await officerService.deleteOfficer(officer.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting officer:", error)
    }
  }

  // Add new officer
  const handleAddNewClick = () => {
    setServiceEdit(null)
    setGradeEdit(null)
    setPositionEdit(null)
    setDutyEdit(null)
    setStatusEdit({ value: 0, label: "Unregistered" })

    setModal(true)
    setOfficer(null)
    setIsEdit(false)
    validation.resetForm()
  }

  //Display default image when there is no existing image
  function getDefaultAvatar(title) {
    // Check if title is male
    if (title === 1 || title === 4) {
      return "/storage/images/AvatarMale.jpg" // Set default male avatar
    } else {
      return "/storage/images/AvatarFemale.jpg" // Set default female avatar
    }
  }

  //Handle title change
  const handleTitleChange = index => {
    validation.setFieldValue("title", index + 1)
    // console.log(validation.values.title)
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
        Header: "Img",
        disableFilters: true,
        accessor: cellProps => (
          <>
            {!cellProps.img ? (
              <div>
                <img
                  className="rounded avatar-sm"
                  src={baseUrl + getDefaultAvatar(cellProps.title)}
                  alt=""
                />
              </div>
            ) : (
              <div>
                <img
                  className="rounded avatar-sm"
                  src={baseUrl + cellProps.img}
                  alt=""
                />
              </div>
            )}
          </>
        ),
      },

      {
        Header: "Name",
        accessor: "nameEn",
        disableFilters: true,
      },
      {
        Header: "Post",
        accessor: "position",
        disableFilters: true,
      },
      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: cellProps => {
          let statusText
          switch (cellProps.value) {
            case 0:
              statusText = "Unregistered"
              break
            case 1:
              statusText = "Active"
              break
            case 2:
              statusText = "Disabled"
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
        onDeleteClick={handleDeleteOfficer}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Officer" breadcrumbItem="Officer List" />
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
                    data={officerList}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className=""
                  />
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!officer ? "Edit Officer" : "Add Officer"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={validation.handleSubmit}
                        encType="multipart/form-data"
                      >
                        <Row form>
                          <Col xs={12}>
                            {/* Title */}
                            <div className="mb-3">
                              <Label htmlFor="title"> Title </Label>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              {["Mr.", "Mrs.", "Miss.", "Rev."].map(
                                (title, index) => (
                                  <div
                                    key={index}
                                    className="form-check form-check-inline form-radio-outline form-radio-primary"
                                  >
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="title"
                                      id={`title${index + 1}`}
                                      value={index + 1}
                                      checked={
                                        parseInt(validation.values.title) ===
                                        index + 1
                                      }
                                      onClick={() => handleTitleChange(index)}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`title${index + 1}`}
                                    >
                                      {title}
                                    </label>
                                  </div>
                                )
                              )}
                            </div>

                            {/* Officer Name - English */}
                            <div className="mb-3">
                              <Label htmlFor="nameEn"> Name - English </Label>
                              <Input
                                id="nameEn"
                                name="nameEn"
                                type="text"
                                className="form-control"
                                placeholder="Add Officer Name"
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

                            {/* Officer Name - Sinhala */}
                            <div className="mb-3">
                              <Label htmlFor="nameSi"> Name - Sinhala </Label>
                              <Input
                                id="nameSi"
                                name="nameSi"
                                type="text"
                                className="form-control"
                                placeholder="නිලධාරී නම ඇතුලත් කරන්න"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.nameSi || ""}
                                invalid={
                                  validation.touched.nameSi &&
                                  validation.errors.nameSi
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.nameSi &&
                              validation.errors.nameSi ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.nameSi}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/* Officer Name - Tamil */}
                            <div className="mb-3">
                              <Label htmlFor="nameTa">
                                {" "}
                                Officer Name - Tamil{" "}
                              </Label>
                              <Input
                                id="nameTa"
                                name="nameTa"
                                type="text"
                                className="form-control"
                                placeholder="அதிகாரியின் பெயரை உள்ளிடவும்"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.nameTa || ""}
                                invalid={
                                  validation.touched.nameTa &&
                                  validation.errors.nameTa
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.nameTa &&
                              validation.errors.nameTa ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.nameTa}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Email</Label>
                              <Input
                                name="email"
                                label="Email"
                                type="email"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                  validation.touched.email &&
                                  validation.errors.email
                                    ? true
                                    : false
                                }
                                disabled={isEdit}
                              />
                              {validation.touched.email &&
                              validation.errors.email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.email}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Image</Label>
                              {isEdit && (
                                <div>
                                  {!!officer && officer.img ? (
                                    <img
                                      src={baseUrl + officer.img.preview} // Display the existing image
                                      alt="Existing Image"
                                      className="rounded avatar-lg"
                                    />
                                  ) : (
                                    <img
                                      src={
                                        baseUrl +
                                        getDefaultAvatar(
                                          validation.values.title
                                        )
                                      } // Display the default image
                                      alt="Default Image"
                                      className="rounded avatar-lg"
                                    />
                                  )}
                                </div>
                              )}
                              <Input
                                name="img"
                                label="img"
                                type="file"
                                onChange={event => {
                                  validation.setFieldValue(
                                    "img",
                                    event.currentTarget.files[0]
                                  )
                                }}
                                onBlur={validation.handleBlur}
                                invalid={
                                  validation.touched.img &&
                                  !!validation.errors.img
                                }
                                // onClick={() => {
                                //   // Trigger the change event for the file input field
                                //   document
                                //     .getElementsByName("img")[0]
                                //     .dispatchEvent(
                                //       new Event("change", { bubbles: true })
                                //     )
                                // }}
                              />
                              {validation.touched.img &&
                                validation.errors.img && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.img}
                                  </FormFeedback>
                                )}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Telephone</Label>
                              <Input
                                name="tel"
                                label="tel"
                                type="tel"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.tel || ""}
                                invalid={
                                  validation.touched.tel &&
                                  validation.errors.tel
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.tel &&
                              validation.errors.tel ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.tel}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Service</Label>
                              <Select
                                name="service"
                                isMulti={false}
                                value={serviceEdit} // This should reflect the selected service
                                onChange={selectedOption => {
                                  setServiceEdit(selectedOption) // Update local state
                                  validation.setFieldValue(
                                    "service",
                                    selectedOption.value
                                  ) // Update Formik's state
                                  if (!isEdit) {
                                    setGradeEdit(null)
                                    setPositionEdit(null)
                                    setDutyEdit([])
                                  }
                                  // console.log(
                                  //   "Formik Service value:",
                                  //   validation.values.service
                                  // )
                                }}
                                options={services.map(service => ({
                                  value: service.id,
                                  label: service.sname_en, // Mapping services to Select options
                                }))}
                                onBlur={() =>
                                  validation.setFieldTouched("service", true)
                                } // Trigger Formik's validation on blur
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

                            <div className="mb-3">
                              <Label className="form-label">Grade</Label>
                              <Select
                                name="grade"
                                isMulti={false}
                                value={gradeEdit} // Selected grade state
                                onChange={selectedOption => {
                                  setGradeEdit(selectedOption) // Set selected grade
                                  validation.setFieldValue(
                                    "grade",
                                    selectedOption?.value
                                  )
                                  if (!isEdit) {
                                    setPositionEdit(null) // Reset position when grade changes
                                    setDutyEdit([]) // Reset duties when grade changes
                                  }                       
                                }}
                                options={
                                  grades.length
                                    ? grades.map(grade => ({
                                        value: grade.id,
                                        label: grade.grade_en, // Mapping grades to Select options
                                      }))
                                    : []
                                }
                                isDisabled={!serviceEdit} // Disable Grade select until a Service is selected
                                onBlur={() =>
                                  validation.setFieldTouched("grade", true)
                                } // Formik validation
                                className={
                                  validation.touched.grade &&
                                  validation.errors.grade
                                    ? "is-invalid"
                                    : ""
                                }
                              />
                              {validation.touched.grade &&
                                validation.errors.grade && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.grade}
                                  </FormFeedback>
                                )}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Position</Label>
                              <Select
                                name="position"
                                isMulti={false}
                                value={positionEdit}
                                onChange={selectedOption => {
                                  setPositionEdit(selectedOption)
                                  validation.setFieldValue(
                                    "position",
                                    selectedOption?.value
                                  ) 
                                  if (!isEdit) {
                                    setDutyEdit([]) // Reset duties when position changes
                                  }
                                }}
                                options={
                                  Array.isArray(positions) // Safeguard to check if positions is an array
                                    ? positions.map(position => ({
                                        value: position.id,
                                        label: position.position_en,
                                      }))
                                    : [] // If not an array, pass an empty array to avoid errors
                                }
                                isDisabled={!gradeEdit} // Disable if no grade is selected
                                onBlur={() =>
                                  validation.setFieldTouched("position", true)
                                } // Mark as touched for validation
                                className={
                                  validation.touched.position &&
                                  validation.errors.position
                                    ? "is-invalid"
                                    : ""
                                }
                              />
                              {validation.touched.position &&
                                validation.errors.position && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.position}
                                  </FormFeedback>
                                )}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Duty</Label>
                              <Select
                                name="duty"
                                isMulti={true}
                                value={dutyEdit}
                                onChange={selectedOptions => {
                                  setDutyEdit(selectedOptions)
                                  validation.setFieldValue(
                                    "duty",
                                    selectedOptions
                                      ? selectedOptions.map(
                                          option => option.value
                                        )
                                      : [] // If no options are selected, pass an empty array
                                  ) // Update Formik's value with selected IDs, or empty if none selected
                                }}
                                options={
                                  Array.isArray(duties) // Ensure duties is an array before mapping
                                    ? duties.map(duty => ({
                                        value: duty.id,
                                        label: duty.subject_en,
                                      }))
                                    : [] // If not an array, return an empty array
                                }
                                isDisabled={!positionEdit} // Disable if no position is selected
                                onBlur={() =>
                                  validation.setFieldTouched("duty", true)
                                } // Mark as touched for validation
                                className={
                                  validation.touched.duty &&
                                  validation.errors.duty
                                    ? "is-invalid"
                                    : ""
                                }
                              />
                              {validation.touched.duty &&
                                validation.errors.duty && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.duty}
                                  </FormFeedback>
                                )}
                            </div>

                            {isEdit && (
                              <div className="mb-3">
                                <Label className="form-label"> Status </Label>
                                <Select
                                  name="status"
                                  isMulti={false}
                                  value={statusEdit}
                                  onChange={handleStatusChange}
                                  options={
                                    statusEdit.value !== 0
                                      ? [
                                          { value: 1, label: "Active" },
                                          { value: 2, label: "Disabled" },
                                        ]
                                      : [{ value: 0, label: "Unregistered" }]
                                  }
                                  onBlur={() =>
                                    validation.setFieldTouched("status", true)
                                  }
                                  className={
                                    validation.touched.status &&
                                    validation.errors.status
                                      ? "is-invalid"
                                      : ""
                                  }
                                  isDisabled={statusEdit.value === 0}
                                />

                                {validation.touched.status &&
                                  validation.errors.status && (
                                    <FormFeedback type="invalid">
                                      {validation.errors.status}
                                    </FormFeedback>
                                  )}
                              </div>
                            )}
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
export default withRouter(Officer)
