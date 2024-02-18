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
  const [member, setMember] = useState()

  // Get party for the dropdown
  const [parties, setParties] = useState([]);
  useEffect(() => {
    const fetchParty = async () => {
      try {
        const parties = await memberService.getParty();
        // console.log(party);
        setParties(parties);
      } catch (error) {
        console.error("Error fetching party:", error);
      }
    };

    fetchParty();
  }, []);

  // Get division for the dropdown
  const [divisions, setDivisions] = useState([]);
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const divisions = await memberService.getDivision();
        // console.log("Divisions:", divisions);
        setDivisions(divisions);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };

    fetchDivisions();
  }, []);


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
      image: (member && member.image) || "",
      position: (member && member.position) || "",
      division: (member && member.division) || "",
      party: (member && member.party) || "",
      tel: (member && member.tel) || "",
    },

    validationSchema: Yup.object({
      nameEn: Yup.string().required("Please Enter Name in English"),
      nameSi: Yup.string().required("Please Enter Name in Sinhala"),
      nameTa: Yup.string().required("Please Enter Name in Tamil"),
      email: Yup.string().required("Please Enter Email"),
      image: Yup.mixed()
        .test(
          "fileType",
          "Invalid file type. Only JPG files are allowed.",
          value => (value ? value && value.type === "image/jpeg" : true)
        )
        .test("fileSize", "File size too large. Max size is 5MB.", value =>
          value ? value && value.size <= 5 * 1024 * 1024 : true
        )
        .required("Please upload an image file."),
      // position: Yup.string().required("Please Select  Position"),
      // party: Yup.array().required("Please Select Party Name"),
      // division: Yup.number().required("Please Select Enable or Disable"),
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
        {
          /* ----------------- Add user code ----------------- */
        }
        // const newUser = {
        //   // id: Math.floor(Math.random() * (30 - 20)) + 20,
        //   nameEn: values["nameEn"],
        //   nameSi: values["nameSi"],
        //   nameTa: values["nameTa"],
        //   email: values["email"],
        //   image: values["image"],
        //   party: values["party"],
        //   division: values["division"],
        //   position: values["position"],
        //   tel: values["tel"],
        // }
        // dispatch(onAddNewUser(newUser))
        // validation.resetForm()
        try {
          const response = await memberService.addMember(values)
          if (response.status === 201) {
            await Swal.fire("Member Added Successfully!", "", "success")
            validation.resetForm()
            // history.push("/news")
          } else {
            // Handle other status codes (e.g., 400 for duplicate email)
            console.error("Error", response.statusText)
            // Show appropriate error message to the user
            await Swal.fire("Error", "Failed to add member error", "error")
          }
        } catch (error) {
          console.error("Error", error)
          await Swal.fire("Error", "Failed to add member", "error")
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
        Header: "#",
        disableFilters: true,
        Cell: cellProps => {
          return null
        },
      },

      {
        Header: "Img",
        // accessor: "name",
        disableFilters: true,
        accessor: cellProps => (
          <>
            {!cellProps.img ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  {cellProps.name.charAt(0)}
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
        accessor: "name",
        disableFilters: true,
        Cell: cellProps => {
          return <Name {...cellProps} />
        },
      },

      {
        Header: "Email",
        accessor: "email",
        disableFilters: true,
        Cell: cellProps => {
          return <Email {...cellProps} />
        },
      },

      {
        Header: "Position",
        accessor: "position",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <>
              {" "}
              <Position {...cellProps} />{" "}
            </>
          )
        },
      },

      {
        Header: "Registered",
        accessor: "registered",
        disableFilters: true,
        Cell: cellProps => {
          return <Registered {...cellProps} />
        },
      },

      {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: cellProps => {
          return <Status {...cellProps} />
        },
      },

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
                  const userData = cellProps.row.original
                  onClickDelete(userData)
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
      name: user.name,
      email: user.email,
      party: user.party,
      position: user.position,
      status: user.status,
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

  const onClickDelete = users => {
    setMember(users)
    setDeleteModal(true)
  }

  const handleDeleteUser = () => {
    dispatch(onDeleteUser(member))
    onPaginationPageChange(1)
    setDeleteModal(false)
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
        onDeleteClick={handleDeleteUser}
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
                    data={users}
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
                                name="image"
                                label="image"
                                type="file"
                                onChange={event => {
                                  validation.setFieldValue(
                                    "image",
                                    event.currentTarget.files[0]
                                  )
                                }}
                                onBlur={validation.handleBlur}
                                invalid={
                                  validation.touched.image &&
                                  validation.errors.image
                                }
                              />
                              {validation.touched.image &&
                                validation.errors.image && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.image}
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
                                isMulti={false} // If division allows multiple selection, otherwise set it to false
                                onChange={(selectedOptions) => {
                                  validation.setFieldValue("division", selectedOptions);
                                }}

                                options={divisions.AllDivisions && divisions.AllDivisions.map((division) => ({
                                  value: division.id,
                                  label: division.division_en,
                                }))}

                              />

                              {validation.touched.division &&
                              validation.errors.division ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.division}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Party</Label>
                              <Select
                                name="party"
                                isMulti={false}
                                onChange={(selectedOptions) => {
                                  validation.setFieldValue("party", selectedOptions);
                                }}

                                options={parties.AllParties && parties.AllParties.map((party) => ({
                                  value: party.id,
                                  label: party.party,
                                }))}

                              />
                              {validation.touched.party &&
                              validation.errors.party ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.party}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label className="form-label">Position</Label>

                              <Select
                                name="position"
                                isMulti={true}
                                onChange={() => {}}
                                className="select2-selection"
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
