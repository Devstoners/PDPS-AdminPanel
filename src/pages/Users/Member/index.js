import React, { useEffect, useState, useRef, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
import TableContainer from "../../../components/Common/TableContainer"
import Select from "react-select"
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
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"

import {
  Name,
  Email,
  Img,
  Position,
  Division,
  Party,
  Registered,
  Status,
} from "./MemberCol"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"

import {
  getUsers as onGetUsers,
  addNewUser as onAddNewUser,
  updateUser as onUpdateUser,
  deleteUser as onDeleteUser,
} from "store/contacts/actions"

import { isEmpty } from "lodash"

//redux
import { useSelector, useDispatch } from "react-redux"
import memberService from "../../../services/MemberService"
import Swal from "sweetalert2"

const Member = props => {
  //meta title
  document.title = "Admin | PDPS"

  const dispatch = useDispatch()
  const [memberList, setMemberList] = useState([])
  const [member, setMember] = useState()
  const [refreshTable, setRefreshTable] = useState(false)
  //Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  //View data in the table
  const fetchData = async () => {
    try {
      const fetchedData = await memberService.getMember()
      // console.log(fetchedData)
      const allMemberArray = fetchedData.AllMembers || []
      console.log(allMemberArray)
      const mappedData = allMemberArray.map((item, index) => ({
        displayId: allMemberArray.length - index,
        id: item.id,
        img: item.image,
        nameEn: item.name_en,
        status: item.user.status,
      }))
      setMemberList(mappedData)
    } catch (error) {
      console.error("Error fetching party:", error)
    }
  }


  // Get division for the dropdown
  const [divisions, setDivisions] = useState([])
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const divisions = await memberService.getDivision()
        // console.log("Divisions:", divisions);
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
        console.log(parties);
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
        console.log(positions);
        setPositions(positions)
      } catch (error) {
        console.error("Error fetching positions:", error)
      }
    }

    fetchPosition()
  }, [])
  {
    /* ----------------- Validation ----------------- */
  }
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      nameEn: (member && member.nameEm) || "",
      nameSi: (member && member.nameSi) || "",
      nameTa: (member && member.nameTa) || "",
      email: (member && member.email) || "",
      img: (member && member.img) || "",
      position: (member && member.position) || "",
      division: (member && member.division) || "",
      party: (member && member.party) || "",
      tel: (member && member.tel) || "",
    },

    validationSchema: Yup.object({
      // nameEn: Yup.string().required("Please Enter Name in English"),
      // nameSi: Yup.string().required("Please Enter Name in Sinhala"),
      // nameTa: Yup.string().required("Please Enter Name in Tamil"),
      // email: Yup.string().required("Please Enter Email"),
      // tel: Yup.string().required("Please Enter Telephone Number"),
      // party: Yup.string().required("Please Select Party Name"),
      // division: Yup.string().required("Please Select Division"),
      // position: Yup.array().required("Please Select  Position"),
      //
      // img: Yup.mixed()
      //   .test(
      //     "fileType",
      //     "Invalid file type. Only JPG files are allowed.",
      //     value => (value ? value && value.type === "image/jpeg" : true)
      //   )
      //   .test("fileSize", "File size too large. Max size is 5MB.", value =>
      //     value ? value && value.size <= 5 * 1024 * 1024 : true
      //   )
      //   .required("Please upload an image file."),
    }),

    onSubmit: async values => {
      {
        /* ----------------- Edit user code ----------------- */
      }
      if (isEdit) {
        const updateUser = {
          id: member.id,
          name: values.name,
          email: values.email,
          party: values.party,
          division: values.division,
          position: values.position,
          status: values.status,
        }
        dispatch(onUpdateUser(updateUser))
        validation.resetForm()
        setIsEdit(false)
      } else {
        /* ----------------- Add user code ----------------- */
        try {
          const response = await memberService.addMember(values);
          if (response && !response.error) {
            console.log('Member Added Successfully!', response);
            validation.resetForm();
            toggle();
            // history.push("/news");
          } else {
            console.error('Error:', response);
            if (response && response.message) {
              await Swal.fire('Error', response.message, 'error');
            } else {
              if (!response) {
                await Swal.fire('Error', 'Failed to add member1', 'error');
              }
            }
          }
        } catch (error) {
          // Catch and handle any JavaScript errors or errors from the service
          console.error('Error:', error);

          // Show a generic error message to the user
          await Swal.fire('Error', 'Failed to add member2', 'error');
        }



      }
      toggle()
    },
  })
  {
    /* ----------------- Validation/Edit/Add user code ends ----------------- */
  }

  const { users } = useSelector(state => ({
    users: state.contacts.users,
  }))

  const [userList, setUserList] = useState([])
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

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
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  <img
                    className="rounded-circle avatar-xs"
                    src={cellProps.img}
                    alt=""
                  />
                </span>
              </div>
            ) : (
              <div>
                <img
                  className="rounded-circle avatar-xs"
                  src={cellProps.img}
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
        Cell: cellProps => {
          return <Name {...cellProps} />
        },
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

      //
      // {
      //   Header: "Status",
      //   accessor: "status",
      //   disableFilters: true,
      //
      // },

      {
        Header: "Action",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              {/*-------------------Edit button--------------------- */}
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const userData = cellProps.row.original
                  handleUserClick(userData)
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

  useEffect(() => {
    if (users && !users.length) {
      dispatch(onGetUsers())
      setIsEdit(false)
    }
  }, [dispatch, users])

  useEffect(() => {
    setMember(users)
    setIsEdit(false)
  }, [users])

  useEffect(() => {
    if (!isEmpty(users) && !!isEdit) {
      setMember(users)
      setIsEdit(false)
    }
  }, [users])

  const toggle = () => {
    setModal(!modal)
  }

  const handleUserClick = arg => {
    const user = arg

    setMember({
      id: user.id,
      nameEn: user.nameEn,
      nameSi: user.nameSi,
      nameTa: user.nameTa,
      email: user.email,
      party: user.party,
      // position: user.position,
      img: user.img,
      division:user.division
    })
    setIsEdit(true)

    toggle()
  }

  //Pagination
  var node = useRef()
  const onPaginationPageChange = page => {
    if (
      node &&
      node.current &&
      node.current.props &&
      node.current.props.pagination &&
      node.current.props.pagination.options
    ) {
      node.current.props.pagination.options.onPageChange(page)
    }
  }

  //delete user
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

  const handleUserClicks = () => {
    setUserList("")
    setIsEdit(false)
    toggle()
  }

  const keyField = "id"

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteMember}
        onCloseClick={() => setDeleteModal(false)}
      />

      {/*------------------ Render Breadcrumbs----------------- */}
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Member" breadcrumbItem="Member List" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  {/*-----------------User List Table Start------------------*/}
                  <TableContainer
                    columns={columns}
                    data={memberList}
                    isGlobalFilter={true}
                    isAddUserList={true}
                    handleUserClick={handleUserClicks}
                    customPageSize={10}
                    className=""
                  />
                  {/*-----------------User List Table End------------------*/}

                  {/*-----------------Add & Edit user form Start------------------*/}
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!isEdit ? "Edit Member" : "Add Member"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={e => {
                          e.preventDefault()
                          validation.handleSubmit()
                          return false
                        }}
                        encType="multipart/form-data"
                      >
                        <Row form>
                          <Col xs={12}>
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
                              <Label className="form-label">
                                Name Sinhala{" "}
                              </Label>
                              <Input
                                name="nameSi"
                                type="text"
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
                                  document.getElementsByName("img")[0].dispatchEvent(new Event("change", { bubbles: true }));
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
                                onChange={selectedOption => {
                                  validation.setFieldValue("division", selectedOption ? selectedOption.value : ""); // Set the field value to the selected option's value
                                  validation.setFieldTouched("division", true); // Mark the field as touched
                                }}
                                options={
                                  divisions.AllDivisions &&
                                  divisions.AllDivisions.map(division => ({
                                    value: division.id,
                                    label: division.division_en,
                                  }))
                                }
                                onBlur={() => validation.setFieldTouched("division", true)} // Mark the field as touched when it loses focus
                                className={validation.touched.division && validation.errors.division ? 'is-invalid' : ''} // Apply 'is-invalid' class if there's an error
                              />


                              {validation.touched.division && validation.errors.division && ( // Show error message if field has been touched and there's an error
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
                                onChange={selectedOption => {
                                  validation.setFieldValue("party", selectedOption ? selectedOption.value : "");
                                  validation.setFieldTouched("party", true);
                                }}
                                options={
                                  parties.AllParties &&
                                  parties.AllParties.map(party => ({
                                    value: party.id,
                                    label: party.party_en,
                                  }))
                                }
                                onBlur={() => validation.setFieldTouched("party", true)}
                                className={validation.touched.party && validation.errors.party ? 'is-invalid' : ''}
                              />

                              {validation.touched.party && validation.errors.party && (
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
                                onChange={selectedOptions => {
                                  validation.setFieldValue(
                                    "position",
                                    selectedOptions
                                  )
                                }}
                                options={
                                  positions.AllPositions &&
                                  positions.AllPositions.map(position => ({
                                    value: position.id,
                                    label: position.position_en,
                                  }))
                                }
                              />

                              {validation.touched.position &&
                              validation.errors.position ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.position}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
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
                  {/*-----------------Add & Edit user form Ends------------------*/}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {/*------------------ Render Breadcrumbs Ends----------------- */}
    </React.Fragment>
  )
}

export default withRouter(Member)
