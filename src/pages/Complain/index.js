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
    Form, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Badge,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";


import {
    getComplain as onGetComplain,
    addNewComplain as onAddNewComplain,
    updateComplain as onUpdateComplain,
    deleteComplain as onDeleteComplain,
} from "store/complains/actions";

import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import ComplainDetailsModal from "./ComplainDetailsModal";

const Complain = props => {

    //meta title
    document.title="Admin | PDPS";

    const dispatch = useDispatch();
    const [complain, setComplain] = useState();
    const [modal1, setModal1] = useState(false);
    const [startDate, setstartDate] = useState(new Date())
    const [endDate, setendDate] = useState(new Date())
    const startDateChange = date => {
        setstartDate(date)
    }

    const endDateChange = date => {
        setendDate(date)
    }
    {/* ----------------- Validation ----------------- */}
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            topic: ( complain &&  complain.topic) || "",
            status: ( complain &&  complain.status) || "",
            topict: ( complain &&  complain.topict) || "",
        },
        validationSchema: Yup.object({
            topic: Yup.string().required("Please Enter Complain topic in English"),
            status: Yup.string().required("Please Enter Complain topic in Sinhala"),
            topict: Yup.string().required("Please Enter Complain topic in Tamil"),
        }),
        onSubmit: (values) => {
            console.log("values", values);
            validation.resetForm();
        }
    });

    const [formValidation, setValidation] = useState({
        topic: null,
        status: null,
        topict: null,
    });



    onSubmit: values => {
            {/* ----------------- Edit complain code ----------------- */}
            if (isEdit) {
                const updateComplain = {
                    id: complain.id,
                    topic: values.topic,
                    status: values.status,
                    topict: values.topict,
                    startDate: values.startDate,
                    dateend: values.dateend,
                };
                dispatch(onUpdateComplain(updateComplain));
                validation.resetForm();
                setIsEdit(false);

            } else {
                {/* ----------------- Add complain code ----------------- */}
                const newComplain = {
                    id: Math.floor(Math.random() * (30 - 20)) + 20,
                    topic: values["topic"],
                    status: values["status"],
                    topict: values["topict"],
                    startDate: values["startDate"],
                    dateend: values["dateend"],
                };
                dispatch(onAddNewComplain(newComplain));
                validation.resetForm();
            }
            toggle();
        },

    {/* ----------------- Validation/Edit/Add complain code ends ----------------- */}



    const [complainList, setComplainList] = useState([]);
    const [modal, setModal] = useState(false);
    const toggleViewModal = () => setModal1(!modal1);
    const [isEdit, setIsEdit] = useState(false);

    const columns = useMemo(

        () => [
            {
                Header: "#",
                accessor: "id",
                disableFilters: true,
            },

            {
                Header: "Heading",
                accessor: "topic",
                disableFilters: true,

            },

            {
                Header: "Date",
                accessor: "cdate",
                disableFilters: true,
            },

            {
                Header: "Status",
                accessor: "status",
                disableFilters: true,
            },

            {
                Header: 'Details',
                accessor: 'view',
                disableFilters: true,
                Cell: () => {
                    return (
                        <Button
                            type="button"
                            color="primary"
                            className="btn-sm btn-rounded"
                            onClick={toggleViewModal}
                        >
                            View Details
                        </Button>);
                }
            },

            {
                Header: 'Action',
                Cell: cellProps => {
                    return (
                        <div className="d-flex gap-3">
                            {/*-------------------Edit button--------------------- */}
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => {
                                    const complainData = cellProps.row.original;
                                    handleComplainClick(complainData);
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
                                    const complainData = cellProps.row.original;
                                    onClickDelete(complainData);
                                }}
                            >
                                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                <UncontrolledTooltip placement="top" target="deletetooltip">
                                    Delete
                                </UncontrolledTooltip>
                            </Link>
                        </div>
                    );
                }
            },
        ],
        []
    );

    const data = [
        {
            "id": "3",
            "topic": "Water supply",
            "cdate": "2022.12.25",
            "status": "Completed",
        },
        {
            "id": "2",
            "topic": "Play Ground opening",
            "cdate": "2022.12.25",
            "status": "In Progress",
        },
        {
            "id": "1",
            "topic": "No buses in Kudugala Wattegama road",
            "cdate": "2023.01.31",
            "status": "No action",
        },
    ];
    useEffect(() => {
        if (complain && !complain.length) {
            dispatch(onGetComplain());
            setIsEdit(false);
        }
    }, [dispatch, complain]);

    useEffect(() => {
        setComplain(complain);
        setIsEdit(false);
    }, [complain]);

    useEffect(() => {
        if (!isEmpty(complain) && !!isEdit) {
            setComplain(complain);
            setIsEdit(false);
        }
    }, [complain]);

    const toggle = () => {
        setModal(!modal);
    };

    const handleComplainClick = arg => {
        const complain = arg;

        setComplain({
            id: complain.id,
            topic: complain.topic,
            status: complain.status,
            topict: complain.topict,
            startDate: complain.startDate,
            endDate: complain.endDate,
            order: complain.order,
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

    //delete complain
    const [deleteModal, setDeleteModal] = useState(false);

    const onClickDelete = complain => {
        setComplain(complain);
        setDeleteModal(true);
    };

    const handleDeleteComplain = () => {
        dispatch(onDeleteComplain(complain));
        onPaginationPageChange(1);
        setDeleteModal(false);
    };

    const handleComplainClicks = () => {
        setComplainList("");
        setIsEdit(false);
        toggle();
    };

    const keyField = "id";

    return (
        <React.Fragment>
            <ComplainDetailsModal isOpen={modal1} toggle={toggleViewModal} />
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteComplain}
                onCloseClick={() => setDeleteModal(false)}
            />

            {/*------------------ Render Breadcrumbs----------------- */}
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Complain" breadcrumbItem="Complain" />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    {/*-----------------User List Table Start------------------*/}
                                    <TableContainer
                                        columns={columns}
                                        data={data}
                                        isGlobalFilter={true}
                                        handleComplainClick={handleComplainClicks}
                                        customPageSize={10}
                                        className=""
                                    />
                                    {/*-----------------User List Table End------------------*/}

                                    {/*-----------------Add & Edit complain form Start------------------*/}
                                    <Modal isOpen={modal} toggle={toggle}>
                                        <ModalHeader toggle={toggle} tag="h4">
                                           Add Action
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
                                                            <Label
                                                                htmlFor="topic"
                                                                className="form-label"
                                                            >
                                                                Complain - Topic
                                                            </Label>
                                                            <Input
                                                                id="topic"
                                                                name="topic"
                                                                type="textarea"
                                                                className="form-control"
                                                                disabled={true}
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.topic || ""}
                                                                invalid={
                                                                    validation.touched.topic && validation.errors.topic ? true : false
                                                                }
                                                            />
                                                            {validation.touched.topic && validation.errors.topic ? (
                                                                <FormFeedback type="invalid">{validation.errors.topic}</FormFeedback>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-3">
                                                            <Label className="form-label">Status</Label>
                                                            <Input
                                                                name="status"
                                                                type="select"
                                                                className="form-select"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={
                                                                    validation.values.status || ""
                                                                }
                                                            >
                                                                <option>No Action</option>
                                                                <option>In Progress</option>
                                                                <option>Completed</option>
                                                            </Input>
                                                            {validation.touched.status && validation.errors.status ? (
                                                                <FormFeedback type="invalid">{validation.errors.status}</FormFeedback>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="action"
                                                                className="col-form-label col-lg-2"
                                                            >
                                                                Action
                                                            </Label>
                                                            <Input
                                                                id="action"
                                                                name="action"
                                                                type="textarea"
                                                                className="form-control"
                                                                placeholder="Add Action..."
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.action || ""}
                                                                invalid={
                                                                    validation.touched.action && validation.errors.action ? true : false
                                                                }
                                                            />
                                                            {validation.touched.action && validation.errors.action ? (
                                                                <FormFeedback type="invalid">{validation.errors.action}</FormFeedback>
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
                                    {/*-----------------Add & Edit complain form Ends------------------*/}

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

export default withRouter(Complain);
