import React, { useEffect, useState, useRef, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import TableContainer from "../../../components/Common/TableContainer";
import Select from "react-select";
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
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";


import { Name, Email, Img, Division, Registered, Status  } from "./GramaCol";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";


import {
  getUsers as onGetUsers,
  addNewUser as onAddNewUser,
  updateUser as onUpdateUser,
  deleteUser as onDeleteUser,
} from "store/contacts/actions";

import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";

const UserGrama = props => {

  //meta title
  document.title="Admin | PDPS";

  const dispatch = useDispatch();
  const [contact, setContact] = useState();
  
{/* ----------------- Validation ----------------- */}
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (contact && contact.name) || "",
	  email: (contact && contact.email) || "",
      division: (contact && contact.division) || "",
      registered: (contact && contact.registered) || "",
      status: (contact && contact.status) || "",
    },
	
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
	  email: Yup.string().required("Please Enter Email"),
      division: Yup.string().required("Please Enter  Division"),    
      status: Yup.number().required("Please Select Enable or Disable"),
    }),
	
	
	
    onSubmit: values => {
{/* ----------------- Edit user code ----------------- */}		
      if (isEdit) {
        const updateUser = {
          id: contact.id,
          name: values.name,
		  email: values.email,
          division: values.division,
          status: values.status,
        };
        dispatch(onUpdateUser(updateUser));
        validation.resetForm();
        setIsEdit(false);
		
      } else {
{/* ----------------- Add user code ----------------- */}
        const newUser = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          name: values["name"],
		  email: values["email"],
          division: values["division"],           
        };
        dispatch(onAddNewUser(newUser));
        validation.resetForm();
      }
      toggle();
    },
  });
{/* ----------------- Validation/Edit/Add user code ends ----------------- */}

  const { users } = useSelector(state => ({
    users: state.contacts.users,
  }));

  const [userList, setUserList] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const columns = useMemo(
  
    () => [
	  {
        Header: "#",
        disableFilters: true,
        Cell: cellProps => {
          return null;
        },
      },
     
      {
        Header: "Img",
        // accessor: "name",
        disableFilters: true, 
        accessor: (cellProps) => (
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
          return <Name {...cellProps} />;
        },
      },
	  
      {
        Header: "Email",
        accessor: "email",
        disableFilters: true,
        Cell: cellProps => {
          return <Email {...cellProps} />;
        },
      },
	  
	  {
        Header: "Division",
        accessor: "division",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <>
              {" "}
              <Division {...cellProps} />{" "}
            </>
          );
        },
      },
	  
      {
        Header: "Registered",
        accessor: "registered",
        disableFilters: true,
        Cell: cellProps => {
          return <Registered {...cellProps} />;
        },
      },
	  
	  {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        Cell: cellProps => {
          return <Status {...cellProps} />;
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
                  const userData = cellProps.row.original;
                  handleUserClick(userData);
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
                  const userData = cellProps.row.original;
                  onClickDelete(userData);
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (users && !users.length) {
      dispatch(onGetUsers());
      setIsEdit(false);
    }
  }, [dispatch, users]);

  useEffect(() => {
    setContact(users);
    setIsEdit(false);
  }, [users]);

  useEffect(() => {
    if (!isEmpty(users) && !!isEdit) {
      setContact(users);
      setIsEdit(false);
    }
  }, [users]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleUserClick = arg => {
    const user = arg;

    setContact({
      id: user.id,
      name: user.name,
	  email: user.email,
      division: user.division,
      status: user.status,
    });
    setIsEdit(true);

    toggle();
  };

  //Pagination
  var node = useRef();
  const onPaginationPageChange = page => {
    if (
      node &&
      node.current &&
      node.current.props &&
      node.current.props.pagination &&
      node.current.props.pagination.options
    ) {
      node.current.props.pagination.options.onPageChange(page);
    }
  };

  //delete user
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = users => {
    setContact(users);
    setDeleteModal(true);
  };

  const handleDeleteUser = () => {
    dispatch(onDeleteUser(contact));
    onPaginationPageChange(1);
    setDeleteModal(false);
  };

  const handleUserClicks = () => {
    setUserList("");
    setIsEdit(false);
    toggle();
  };

  const keyField = "id";

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
          <Breadcrumbs title="Grama Niladari" breadcrumbItem="Grama Niladari List" />
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
                      {!!isEdit ? "Edit User" : "Add User"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={e => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row form>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label className="form-label">Name</Label>
                              <Input
                                name="name"
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name &&
                                    validation.errors.name
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.name &&
                                validation.errors.name ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.name}
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
                              <Label className="form-label">Division</Label>
							  
							   <Select
								name = "division"
								isMulti={true}
								onChange={() => {}}
								className="select2-selection"
								/>
                              
                                
                              {validation.touched.division &&
                                validation.errors.division ? (
                                <FormFeedback division="invalid">
                                  {validation.errors.division}
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
  );
};

export default withRouter(UserGrama);
