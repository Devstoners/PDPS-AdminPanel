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
    Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";


import {
    getNews as onGetNews,
    addNewNews as onAddNewNews,
    updateNews as onUpdateNews,
    deleteNews as onDeleteNews,
} from "store/news/actions";

import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const News = props => {

    //meta title
    document.title="Admin | PDPS";

    const dispatch = useDispatch();
    const [news, setNews] = useState();
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
            topice: ( news &&  news.topice) || "",
            topics: ( news &&  news.topics) || "",
            topict: ( news &&  news.topict) || "",
        },
        validationSchema: Yup.object({
            topice: Yup.string().required("Please Enter News topic in English"),
            topics: Yup.string().required("Please Enter News topic in Sinhala"),
            topict: Yup.string().required("Please Enter News topic in Tamil"),
        }),
        onSubmit: (values) => {
            console.log("values", values);
            validation.resetForm();
        }
    });

    const [formValidation, setValidation] = useState({
        topice: null,
        topics: null,
        topict: null,
    });



    onSubmit: values => {
            {/* ----------------- Edit news code ----------------- */}
            if (isEdit) {
                const updateNews = {
                    id: news.id,
                    topice: values.topice,
                    topics: values.topics,
                    topict: values.topict,
                    startDate: values.startDate,
                    dateend: values.dateend,
                };
                dispatch(onUpdateNews(updateNews));
                validation.resetForm();
                setIsEdit(false);

            } else {
                {/* ----------------- Add news code ----------------- */}
                const newNews = {
                    id: Math.floor(Math.random() * (30 - 20)) + 20,
                    topice: values["topice"],
                    topics: values["topics"],
                    topict: values["topict"],
                    startDate: values["startDate"],
                    dateend: values["dateend"],
                };
                dispatch(onAddNewNews(newNews));
                validation.resetForm();
            }
            toggle();
        },

    {/* ----------------- Validation/Edit/Add news code ends ----------------- */}



    const [newsList, setNewsList] = useState([]);
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
                Header: "News",
                accessor: "topice",
                disableFilters: true,

            },

            {
                Header: "Display Date - Start",
                accessor: "startDate",
                disableFilters: true,
            },

            {
                Header: "Display Date - End",
                accessor: "endDate",
                disableFilters: true,
            },

            {
                Header: "Order",
                accessor: "order",
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
                                    const newsData = cellProps.row.original;
                                    handleNewsClick(newsData);
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
                                    const newsData = cellProps.row.original;
                                    onClickDelete(newsData);
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
            "id": "2",
            "topice": "Calling for the suppliers for the comming year",
            "startDate": "2022.12.31",
            "endDate": "2023.02.31",
            "order": "1",
        },
        {
            "id": "1",
            "topice": "Health camp will be conducted on 03.30.2023",
            "startDate": "2023.02.12",
            "endDate": "2023.03.31",
            "order": "2",
        },
    ];
    useEffect(() => {
        if (news && !news.length) {
            dispatch(onGetNews());
            setIsEdit(false);
        }
    }, [dispatch, news]);

    useEffect(() => {
        setNews(news);
        setIsEdit(false);
    }, [news]);

    useEffect(() => {
        if (!isEmpty(news) && !!isEdit) {
            setNews(news);
            setIsEdit(false);
        }
    }, [news]);

    const toggle = () => {
        setModal(!modal);
    };

    const handleNewsClick = arg => {
        const news = arg;

        setNews({
            id: news.id,
            topice: news.topice,
            topics: news.topics,
            topict: news.topict,
            startDate: news.startDate,
            endDate: news.endDate,
            order: news.order,
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

    //delete news
    const [deleteModal, setDeleteModal] = useState(false);

    const onClickDelete = news => {
        setNews(news);
        setDeleteModal(true);
    };

    const handleDeleteNews = () => {
        dispatch(onDeleteNews(news));
        onPaginationPageChange(1);
        setDeleteModal(false);
    };

    const handleNewsClicks = () => {
        setNewsList("");
        setIsEdit(false);
        toggle();
    };

    const keyField = "id";

    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteNews}
                onCloseClick={() => setDeleteModal(false)}
            />

            {/*------------------ Render Breadcrumbs----------------- */}
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="News" breadcrumbItem="News" />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    {/*-----------------User List Table Start------------------*/}
                                    <TableContainer
                                        columns={columns}
                                        data={data}
                                        isGlobalFilter={true}
                                        handleNewsClick={handleNewsClicks}
                                        customPageSize={10}
                                        className=""
                                    />
                                    {/*-----------------User List Table End------------------*/}

                                    {/*-----------------Add & Edit news form Start------------------*/}
                                    <Modal isOpen={modal} toggle={toggle}>
                                        <ModalHeader toggle={toggle} tag="h4">
                                           Edit News
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
                                                                htmlFor="topice"
                                                                className="col-form-label col-lg-2"
                                                            >
                                                                English
                                                            </Label>
                                                            <Input
                                                                id="topice"
                                                                name="topice"
                                                                type="textarea"
                                                                className="form-control"
                                                                placeholder="Enter News..."
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.topice || ""}
                                                                invalid={
                                                                    validation.touched.topice && validation.errors.topice ? true : false
                                                                }
                                                            />
                                                            {validation.touched.topice && validation.errors.topice ? (
                                                                <FormFeedback type="invalid">{validation.errors.topice}</FormFeedback>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor="topics"
                                                                className="col-form-label col-lg-2"
                                                            >
                                                                Sinhala
                                                            </Label>

                                                            <Input
                                                                id="topics"
                                                                name="topics"
                                                                type="textarea"
                                                                className="form-control"
                                                                placeholder="පුවත ඇතුලත් කරන්න..."
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.topics || ""}
                                                                invalid={
                                                                    validation.touched.topics && validation.errors.topics ? true : false
                                                                }
                                                            />
                                                            {validation.touched.topics && validation.errors.topics ? (
                                                                <FormFeedback type="invalid">{validation.errors.topics}</FormFeedback>
                                                            ) : null}

                                                        </div>
                                                        <div className="mb-3">
                                                            <Label
                                                                htmlFor=" topict"
                                                                className="col-form-label col-lg-2"
                                                            >
                                                                Tamil
                                                            </Label>

                                                            <Input
                                                                id="topict"
                                                                name="topict"
                                                                type="textarea"
                                                                className="form-control"
                                                                placeholder="செய்திகளை உள்ளிடவும்..."
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.topict || ""}
                                                                invalid={
                                                                    validation.touched.topict && validation.errors.topict ? true : false
                                                                }
                                                            />
                                                            {validation.touched.topict && validation.errors.topict ? (
                                                                <FormFeedback type="invalid">{validation.errors.topict}</FormFeedback>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-3">
                                                            <Label className="form-label">
                                                                Display Duration (Start & End)
                                                            </Label>

                                                            <Row>
                                                                <Col md={6} className="pr-0">
                                                                    <DatePicker
                                                                        className="form-control"
                                                                        selected={startDate}
                                                                        onChange={startDateChange}

                                                                    />
                                                                </Col>
                                                                <Col md={6} className="pl-0">
                                                                    <DatePicker
                                                                        className="form-control"
                                                                        selected={endDate}
                                                                        onChange={endDateChange}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="mb-3">
                                                    <Label
                                                        htmlFor=" order"
                                                        className="col-form-label col-lg-2"
                                                    >
                                                       Order
                                                    </Label>
                                                    <Select
                                                        name = "order"
                                                        isMulti={true}
                                                        onChange={() => {}}
                                                        className="select2-selection"
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.order || ""}
                                                        invalid={
                                                            validation.touched.order && validation.errors.order ? true : false
                                                        }
                                                    />
                                                    {validation.touched.order && validation.errors.order ? (
                                                        <FormFeedback type="invalid">{validation.errors.order}</FormFeedback>
                                                    ) : null}
                                                </div>
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
                                    {/*-----------------Add & Edit news form Ends------------------*/}

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

export default withRouter(News);
