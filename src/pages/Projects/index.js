import React, { useEffect, useState, useRef, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer";
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
  Form, FormGroup, Button,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Project = props => {

  //meta title
  document.title="Admin | PDPS";

  const dispatch = useDispatch();
  const [contact, setContact] = useState();

  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const startDateChange = date => {
    setstartDate(date);
  };

  const endDateChange = date => {
    setendDate(date);
  };
{/* ----------------- Validation ----------------- */}
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      projectname: (contact && contact.projectname) || "",
	  projectnames: (contact && contact.projectnames) || "",
      projectnamet: (contact && contact.projectnamet) || "",
      projectdesc: (contact && contact.projectdesc) || "",
      projectdescs: (contact && contact.projectdescs) || "",
      projectdesct: (contact && contact.projectdesct) || "",
      instituteen: (contact && contact.instituteen) || "",
      institutesi: (contact && contact.institutesi) || "",
      instituteta: (contact && contact.instituteta) || "",
      startDate: (contact && contact.startDate) || "",
      endDate: (contact && contact.endDate) || "",
      projectbudget: (contact && contact.projectbudget) || "",
    },
	
    validationSchema: Yup.object({
      projectname: Yup.string().required("Please Enter Project Name in English"),
	  projectnames: Yup.string().required("Please Enter Project Name in Sinhala"),
      projectnamet: Yup.string().required("Please Enter  Project Name in Tamil"),
      projectdesc: Yup.number().required("Please Enter  Project Descriptioin in English"),
      projectdescs: Yup.number().required("Please Enter  Project Descriptioin in Sinhala"),
      projectdesct: Yup.number().required("Please Enter  Project Descriptioin in Tamil"),
      instituteen: Yup.number().required("Please Enter Institute Name in English"),
      institutesi: Yup.number().required("Please Enter Institute Name in Sinhala"),
      instituteta: Yup.number().required("Please Enter Institute Name in Tamil"),
      startDate: Yup.number().required("Please Select Start Date"),
      endDate: Yup.number().required("Please Select End Date"),
      projectbudget: Yup.number().required("Please Enter Budget of the Project"),
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
          accessor: "id",
          disableFilters: true,

        },

        {
          Header: "Project",
          accessor: "project",
          disableFilters: true,

        },

        {
          Header: "Start Date",
          accessor: "position",
          disableFilters: true,

        },

        {
          Header: "Date completion",
          accessor: "registered",
          disableFilters: true,

        },

        {
          Header: "Status",
          accessor: "status",
          disableFilters: true,

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

  const data = [
    {
      "id": "1",
      "project": "Secretary"
    },
    {
      "id": "2",
      "project": "Development Officer"
    },
  ];

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
    const project = arg;

    setContact({
      projectname: project.projectname,
      projectnames: project.projectnames,
	  projectnamet: project.projectnamet,
      projectdesc: project.projectdesc,
      projectdescs: project.projectdescs,
      projectdesct: project.projectdesct,
      instituteen: project.instituteen,
      institutesi: project.institutesi,
      instituteta: project.instituteta,
      startDate: project.startDate,
      endDate: project.endDate,
      projectbudget: project.projectbudget,
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
          <Breadcrumbs title="Project" breadcrumbItem="Project" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
{/*-----------------User List Table Start------------------*/}				
                  <TableContainer
                    columns={columns}
                    data={data}
                    isGlobalFilter={true}
                    isAddUserList={true}
                    handleUserClick={handleUserClicks}
                    customPageSize={10}
                    className=""
                  />
{/*-----------------User List Table End------------------*/}
					  
{/*-----------------Add & Edit user form Start------------------*/}
                  <Modal isOpen={modal} toggle={toggle} size="lg" scrollable={true}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!isEdit ? "Edit Project" : "Add Project"}
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
                              <Label className="form-label">Project Name (En)</Label>
                              <Input
                                name="projectname"
                                type="text"
                                placeholder="Enter Project Name..."
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.projectname || ""}
                                invalid={
                                  validation.touched.projectname &&
                                    validation.errors.projectname
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.projectname &&
                                validation.errors.projectname ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.projectname}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Project Name (Si)</Label>
                              <Input
                                  name="projectnames"
                                  type="text"
                                  placeholder="ව්‍යාපෘතියේ නම ඇතුලත් කරන්න..."
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.projectnames || ""}
                                  invalid={
                                    validation.touched.projectnames &&
                                    validation.errors.projectnames
                                        ? true
                                        : false
                                  }
                              />
                              {validation.touched.projectnames &&
                              validation.errors.projectnames ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.projectnames}
                                  </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                                <Label
                                    htmlFor="projectnamet"
                                    className="form-label"
                                >
                                  Project Name (Ta)
                                </Label>

                                  <Input
                                      id="projectnamet"
                                      name="projectnamet"
                                      type="text"
                                      placeholder="திட்டத்தின் பெயர் உள்ளிடவும்..."
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.projectnamet || ""}
                                      invalid={
                                        validation.touched.projectnamet &&
                                        validation.errors.projectnamet
                                            ? true
                                            : false
                                      }
                                  />
                              {validation.touched.projectnamet &&
                              validation.errors.projectnamet ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.projectnamet}
                                  </FormFeedback>
                              ) : null}
                            </div>


                           <div className="mb-3">
                                <Label
                                    htmlFor="projectdesc"
                                    className="form-label"
                                >
                                  Project Description (En)
                                </Label>

                                <Input
                                    type="textarea"
                                    id="projectdesc"
                                    rows="3"
                                    placeholder="Enter Project Description..."
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.projectnames || ""}
                                    invalid={
                                      validation.touched.projectdesc &&
                                      validation.errors.projectdesc
                                          ? true
                                          : false
                                    }
                                />
                             {validation.touched.projectdesc &&
                             validation.errors.projectdesc ? (
                                 <FormFeedback type="invalid">
                                   {validation.errors.projectdesc}
                                 </FormFeedback>
                             ) : null}
                           </div>
                           <div className="mb-3">
                                <Label
                                    htmlFor="projectdescs"
                                    className="form-label"
                                >
                                  Project Description (Si)
                                </Label>

                                <Input
                                    type="textarea"
                                    id="projectdescs"
                                    rows="3"
                                    placeholder="ව්‍යාපෘතියේ විස්තර ඇතුලත් කරන්න..."
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.projectdescs || ""}
                                    invalid={
                                      validation.touched.projectdescs &&
                                      validation.errors.projectdescs
                                          ? trueprojectdescs
                                          : false
                                    }
                                />
                             {validation.touched.projectdescs &&
                             validation.errors.projectdescs ? (
                                 <FormFeedback type="invalid">
                                   {validation.errors.projectdescs}
                                 </FormFeedback>
                             ) : null}
                           </div>
                           <div className="mb-3">
                              <Label
                                  htmlFor="projectdesct"
                                  className="form-label"
                              >
                                Project Description (Ta)
                              </Label>

                             <Input
                                 type="textarea"
                                 name="projectdesct"
                                 rows="3"
                                    placeholder="திட்ட விவரங்களை உள்ளிடவும்..."
                                 onChange={validation.handleChange}
                                 onBlur={validation.handleBlur}
                                 value={validation.values.projectdesct || ""}
                                 invalid={
                                   validation.touched.projectdesct &&
                                   validation.errors.projectdesct
                                       ? true
                                       : false
                                 }
                             />
                             {validation.touched.projectdesct &&
                             validation.errors.projectdesct ? (
                                 <FormFeedback type="invalid">
                                   {validation.errors.projectdesct}
                                 </FormFeedback>
                             ) : null}
                           </div>

                           <div className="mb-3">
                                <Label
                                    htmlFor="instituteen"
                                    className="form-label"
                                >
                                  Executing Institute (En)
                                </Label>

                                  <Input
                                      id="instituteen"
                                      name="instituteen"
                                      type="text"
                                      placeholder="Executing institute name..."
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.instituteen || ""}
                                      invalid={
                                        validation.touched.instituteen &&
                                        validation.errors.instituteen
                                            ? true
                                            : false
                                      }
                                  />
                             {validation.touched.instituteen &&
                             validation.errors.instituteen ? (
                                 <FormFeedback type="invalid">
                                   {validation.errors.instituteen}
                                 </FormFeedback>
                             ) : null}
                           </div>
                           <div className="mb-3">
                                <Label
                                    htmlFor="institutesi"
                                    className="form-label"
                                >
                                  Executing Institute (Si)
                                </Label>

                                  <Input
                                      id="institutesi"
                                      name="institutesi"
                                      type="text"
                                      placeholder="ක්‍රියාත්මක කිරීමේ ආයතනය..."
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.institutesi || ""}
                                      invalid={
                                        validation.touched.institutesi &&
                                        validation.errors.institutesi
                                            ? true
                                            : false
                                      }
                                  />
                             {validation.touched.institutesi &&
                             validation.errors.institutesi ? (
                                 <FormFeedback type="invalid">
                                   {validation.errors.institutesi}
                                 </FormFeedback>
                             ) : null}
                           </div>
                           <div className="mb-3">
                                <Label
                                    htmlFor="instituteta"
                                    className="form-label"
                                >
                                  Executing Institute (Ta)
                                </Label>

                                  <Input
                                      id="instituteta"
                                      name="instituteta"
                                      type="text"
                                      placeholder="செயல்படுத்தும் நிறுவனம்..."
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.instituteta || ""}
                                      invalid={
                                        validation.touched.instituteta &&
                                        validation.errors.instituteta
                                            ? true
                                            : false
                                      }
                                  />
                             {validation.touched.instituteta &&
                             validation.errors.instituteta ? (
                                 <FormFeedback type="invalid">
                                   {validation.errors.instituteta}
                                 </FormFeedback>
                             ) : null}
                            </div>

                            <div className="mb-3">
                              <Label
                                  htmlFor="date"
                                  className="form-label"
                              >
                                Project Date (Start & Expected End)
                              </Label>

                              <Row>
                                <Col md={6} className="pr-0">
                                  <DatePicker
                                      className="form-control"
                                      selected={startDate}
                                      onChange={startDateChange}
                                      value={validation.values.startDate || ""}
                                      invalid={
                                        validation.touched.startDate &&
                                        validation.errors.startDate
                                            ? true
                                            : false
                                      }
                                  />
                                  {validation.touched.startDate &&
                                  validation.errors.startDate ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.startDate}
                                      </FormFeedback>
                                  ) : null}
                                </Col>
                                <Col md={6} className="pl-0">
                                  <DatePicker
                                      className="form-control"
                                      selected={endDate}
                                      onChange={endDateChange}
                                      value={validation.values.endDate || ""}
                                      invalid={
                                        validation.touched.endDate &&
                                        validation.errors.endDate
                                            ? true
                                            : false
                                      }
                                  />
                                  {validation.touched.endDate &&
                                  validation.errors.endDate ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.endDate}
                                      </FormFeedback>
                                  ) : null}
                                </Col>
                              </Row>
                            </div>

                            <div className="mb-3">
                              <label
                                  htmlFor="projectbudget"
                                  className="form-label"
                              >
                                Budget
                              </label>
                              <Input
                                  id="projectbudget"
                                  name="projectbudget"
                                  type="text"
                                  placeholder="Enter Project Budget..."
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.projectbudget || ""}
                                  invalid={
                                    validation.touched.projectbudget &&
                                    validation.errors.projectbudget
                                        ? true
                                        : false
                                  }
                              />
                              {validation.touched.projectbudget &&
                              validation.errors.projectbudget ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.projectbudget}
                                  </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
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

export default withRouter(Project);
