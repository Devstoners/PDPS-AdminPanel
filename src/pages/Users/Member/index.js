import React, { useEffect, useState, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
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
import * as Yup from "yup"
import { useFormik } from "formik"
import TableContainer from "../../../components/Common/TableContainer"
import DeleteModal from "components/Common/DeleteModal"
import Swal from "sweetalert2"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import memberService from "../../../services/MemberService"
import Select from "react-select"
import avatar3 from "../../../assets/images/users/avatar-3.jpg"

const Member = props => {
  document.title = "Admin | PDPS"

  // State variables
  const [memberList, setMemberList] = useState([])
  const [member, setMember] = useState(null)
  const [refreshTable, setRefreshTable] = useState(false)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [divisionEdit, setDivisionEdit] = useState({})
  const [partyEdit, setPartyEdit] = useState({})
  const [positionEdit, setPositionEdit] = useState({})
  const [statusEdit, setStatusEdit] = useState({})

  const baseUrl = "http://127.0.0.1:8000"

  // Get division for the dropdown
  const [divisions, setDivisions] = useState([])
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const divisions = await memberService.getDivision()
        setDivisions(divisions)
      } catch (error) {
        console.error("Error fetching divisions:", error)
      }
    }
    fetchDivisions()
  }, [])

  // Get party for the dropdown
  const [parties, setParties] = useState([])
  useEffect(() => {
    const fetchParty = async () => {
      try {
        const parties = await memberService.getParty()
        setParties(parties)
      } catch (error) {
        console.error("Error fetching party:", error)
      }
    }

    fetchParty()
  }, [])

  // Get position for the dropdown
  const [positions, setPositions] = useState([])
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const positions = await memberService.getPosition()
        setPositions(positions)
        // setPositions(positions.AllPositions || []);
      } catch (error) {
        console.error("Error fetching positions:", error)
      }
    }

    fetchPosition()
  }, [])

  //View data in the table
  const fetchData = async () => {
    try {
      const fetchedData = await memberService.getMember()
      const allMemberArray = fetchedData.AllMembers || []

      const mappedData = allMemberArray.map((item, index) => {
        // Extract images property from the item
        const images = item.images || []

        return {
          displayId: allMemberArray.length - index,
          id: item.id,
          title: item.title,
          nameEn: item.name_en,
          nameSi: item.name_si,
          nameTa: item.name_ta,
          email: item.user.email,
          tel: item.tel,
          img: item.image,
          // position: item.memberPositions.id,
          division: item.member_division,
          party: item.member_party,
          position: item.member_positions,
          status: item.user.status,
        }
      })
      setMemberList(mappedData)
    } catch (error) {
      console.error("Error fetching member data:", error)
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
      title: (member && member.title) || "1",
      nameEn: (member && member.nameEn) || "",
      nameSi: (member && member.nameSi) || "",
      nameTa: (member && member.nameTa) || "",
      email: (member && member.email) || "",
      img: (member && member.img) || null,
      tel: (member && member.tel) || "",
      division: (member && member.division && member.division.id) || "",
      party: (member && member.party && member.party.id) || "",
      position:
        (member && member.position && member.position.map(pos => pos.id)) || [],
      status: (member && member.status) || "",
    },
    validationSchema: Yup.object({
      nameEn: Yup.string().required("Please Enter Name in English"),
      nameSi: Yup.string().required("Please Enter Name in Sinhala"),
      nameTa: Yup.string().required("Please Enter Name in Tamil"),
      email: Yup.string()
        .email("Please enter a valid email")
        .required("Please Enter Email"),
      img: Yup.mixed()
        .test(
          "fileType",
          "Invalid file type. Only JPG files are allowed.",
          value => (value ? value && value.type === "image/jpeg" : true)
        )
        .test("fileSize", "File size too large. Max size is 5MB.", value =>
          value ? value && value.size <= 5 * 1024 * 1024 : true
        ),
      tel: Yup.string()
        .matches(/^\d{10}$/, {
          message: "Please enter a valid 10-digit telephone number",
        })
        .required("Please Enter Telephone Number"),
      party: Yup.string().required("Please Select Party Name"),
      division: Yup.string().required("Please Select Division"),
      position: Yup.array().min(1, "Please select at least one position"),
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
      formData.append("party", values.party)
      formData.append("division", values.division)
      values.position.forEach(pos => {
        formData.append("position[]", pos)
      })
      // console.log(formData.getAll("position"));
      let result
      if (isEdit) {
        formData.append("id", values.id)
        formData.append("status", values.status)
        formData.append("_method", "PUT")
        result = await memberService.editMember(formData)
      } else {
        result = await memberService.addMember(formData)
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
          isEdit ? "Member Edited Successfully!" : "Member Added Successfully!",
          "",
          "success"
        )
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
      }
    } catch (error) {
      Swal.fire(
        "Error",
        `An error occurred while ${isEdit ? "editing" : "adding"} member`,
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
    const memberData = arg

    const existingImage = memberData.img
      ? {
          name: memberData.img.split("/").pop(), // Extracting file name from URL
          size: 0, // Assuming file size as 0 for existing image
          preview: memberData.img, // Setting preview URL
        }
      : null

    const selectedDivision = {
      value: memberData.division.id,
      label: memberData.division.division_en,
    }

    const selectedParty = {
      value: memberData.party.id,
      label: memberData.party.party_en,
    }

    const selectedPositions = memberData.position.map(pos => ({
      value: pos.id,
      label: pos.position_en,
    }))

    const selectedStatus =
      memberData.status === 0
        ? { value: 0, label: "Unregistered" }
        : { value: memberData.status, label: getStatusLabel(memberData.status) }

    setMember({
      id: memberData.id,
      title: memberData.title,
      nameEn: memberData.nameEn,
      nameSi: memberData.nameSi,
      nameTa: memberData.nameTa,
      email: memberData.email,
      img: existingImage,
      tel: memberData.tel,
      party: memberData.party,
      division: memberData.division,
      position: memberData.position,
      status: memberData.status,
    })
    setDivisionEdit(selectedDivision)
    setPartyEdit(selectedParty)
    setPositionEdit(selectedPositions)
    setStatusEdit(selectedStatus)
    setIsEdit(true)
    toggle()
  }

  // Fetch division data when editing the form
  useEffect(() => {
    if (member) {
      const selectedDivision = {
        value: member.division.id,
        label: member.division.division_en,
      }
      setDivisionEdit(selectedDivision)
    }
  }, [member])

  // Fetch party data when editing the form
  useEffect(() => {
    if (member) {
      const selectedParty = {
        value: member.party.id,
        label: member.party.party_en,
      }
      setPartyEdit(selectedParty)
    }
  }, [member])

  // Fetch position data when editing the form
  useEffect(() => {
    if (member && member.position.length > 0) {
      const selectedPositions = member.position.map(pos => ({
        value: pos.id,
        label: pos.position_en,
      }))
      setPositionEdit(selectedPositions)
    }
  }, [member])

  // Fetch status labels when editing the form
  const getStatusLabel = statusValue => {
    switch (statusValue) {
      case 1:
        return "Active"
      case 2:
        return "Disabled"
    }
  }

  // Function to handle status change in the form
  const handleStatusChange = selectedOption => {
    setStatusEdit(selectedOption)
  }

  // Delete member
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = member => {
    setMember(member)
    setDeleteModal(true)
  }

  const handleDeleteMember = async () => {
    try {
      await memberService.deleteMember(member.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting member:", error)
    }
  }

  // Add new member
  const handleAddNewClick = () => {
    setDivisionEdit(null)
    setPartyEdit(null)
    setPositionEdit(null)
    setStatusEdit(null)

    setModal(true)
    setMember(null)
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
        onDeleteClick={handleDeleteMember}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Member" breadcrumbItem="Member List" />
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
                    data={memberList}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className=""
                  />
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!member ? "Edit Member" : "Add Member"}
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

                            {/* Member Name - English */}
                            <div className="mb-3">
                              <Label htmlFor="nameEn"> Name - English </Label>
                              <Input
                                id="nameEn"
                                name="nameEn"
                                type="text"
                                className="form-control"
                                placeholder="Add Member Name"
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

                            {/* Member Name - Sinhala */}
                            <div className="mb-3">
                              <Label htmlFor="nameSi"> Name - Sinhala </Label>
                              <Input
                                id="nameSi"
                                name="nameSi"
                                type="text"
                                className="form-control"
                                placeholder="මන්ත්‍රී නම ඇතුලත් කරන්න"
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

                            {/* Member Name - Tamil */}
                            <div className="mb-3">
                              <Label htmlFor="nameTa">
                                {" "}
                                Member Name - Tamil{" "}
                              </Label>
                              <Input
                                id="nameTa"
                                name="nameTa"
                                type="text"
                                className="form-control"
                                placeholder="உறுப்பினர் பெயரை உள்ளிடவும்"
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
                                  {!!member && member.img ? (
                                    <img
                                      src={baseUrl + member.img.preview} // Display the existing image
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
                                  validation.errors.img
                                }
                                onClick={() => {
                                  // Trigger the change event for the file input field
                                  document
                                    .getElementsByName("img")[0]
                                    .dispatchEvent(
                                      new Event("change", { bubbles: true })
                                    )
                                }}
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
                              <Label className="form-label">Division</Label>
                              <Select
                                name="division"
                                isMulti={false}
                                value={divisionEdit}
                                onChange={selectedOption => {
                                  validation.setFieldValue(
                                    "division",
                                    selectedOption ? selectedOption.value : ""
                                  )
                                  validation.setFieldError("division", "")
                                  setDivisionEdit(selectedOption)
                                }}
                                options={
                                  divisions.AllDivisions &&
                                  divisions.AllDivisions.map(division => ({
                                    value: division.id,
                                    label: division.division_en,
                                  }))
                                }
                                onBlur={() =>
                                  validation.setFieldTouched("division", true)
                                }
                                className={
                                  validation.touched.division &&
                                  validation.errors.division
                                    ? "is-invalid"
                                    : ""
                                }
                              />
                              {validation.touched.division &&
                                validation.errors.division && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.division}
                                  </FormFeedback>
                                )}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Party</Label>
                              <Select
                                name="party"
                                isMulti={false}
                                value={partyEdit}
                                onChange={selectedOption => {
                                  validation.setFieldValue(
                                    "party",
                                    selectedOption ? selectedOption.value : ""
                                  )
                                  validation.setFieldError("party", "")
                                  setPartyEdit(selectedOption)
                                }}
                                options={
                                  parties.AllParties &&
                                  parties.AllParties.map(party => ({
                                    value: party.id,
                                    label: party.party_en,
                                  }))
                                }
                                onBlur={() =>
                                  validation.setFieldTouched("party", true)
                                }
                                className={
                                  validation.touched.party &&
                                  validation.errors.party
                                    ? "is-invalid"
                                    : ""
                                }
                              />

                              {validation.touched.party &&
                                validation.errors.party && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.party}
                                  </FormFeedback>
                                )}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Position</Label>
                              <Select
                                name="position"
                                isMulti={true}
                                value={positionEdit}
                                onChange={selectedOptions => {
                                  const selectedValues = selectedOptions
                                    ? selectedOptions.map(
                                        option => option.value
                                      )
                                    : []
                                  validation.setFieldValue(
                                    "position",
                                    selectedValues
                                  )
                                  setPositionEdit(selectedOptions)
                                }}
                                options={
                                  positions.AllPositions &&
                                  positions.AllPositions.map(position => ({
                                    value: position.id,
                                    label: position.position_en,
                                  }))
                                }
                                onBlur={() =>
                                  validation.setFieldTouched("position", true)
                                }
                                className={
                                  validation.touched.position &&
                                  validation.errors.position
                                    ? "is-invalid"
                                    : ""
                                }
                              />

                              {validation.touched.position &&
                              validation.errors.position ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.position}
                                </FormFeedback>
                              ) : null}
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
export default withRouter(Member)
