import React, { useEffect, useState, useRef,useMemo } from "react";
import PropTypes from 'prop-types';

//import components
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import DeleteModal from "../../../components/Common/DeleteModal";
import EditSubjectModal from "./EditSubjectModal";
import TableContainer from '../../../components/Common/TableContainer';
import DatatableTables from "../../Tables/DatatableTables";
import {Link} from "react-router-dom";

import {
    Table,
    Form,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    UncontrolledTooltip, FormGroup, Label, Input, Button, FormFeedback,
} from "reactstrap"

import {useFormik} from "formik";
import * as Yup from "yup";
import OfficerService from "../../../services/OfficerService"
import Swal from "sweetalert2"
import newsService from "../../../services/NewsService";

function Subject() {

  const [subject, setSubject] = useState();
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ensure that getAllNews is the correct method in your newsService
                const fetchedData = await newsService.getSubject();
                console.log(fetchedData.data)
                const mappedData = fetchedData.data.map(item => ({
                    subid: item.id,
                    subname: item.subject


                }));
                console.log(mappedData);
                setNews(mappedData);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchData();
    }, []);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      subject: (subject && subject.subject) || "",
    },
    validationSchema: Yup.object({
      subject: Yup.string().required("Please Enter Subject Name"),
    }),
    onSubmit: async (values) => {
      const data = await OfficerService.subject(values);
      //console.log("Inside Components")
      if (data.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Officer Subject added successfully"
        })
          window.location.href = '/officer-subject';
      } else {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error || "Something went wrong!"
        });
        //dispatch(apiError(data.error || "Something went wrong!"));
      }

    }
  });

    const [formValidation, setValidation] = useState({
        subid: null,
        subject: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        const modifiedV = { ...formValidation };
        var subname = document.getElementById("subject").value;


        if (subname === "") {
            modifiedV["subname"] = false;
        } else {
            modifiedV["subname"] = true;
        }
        setValidation(modifiedV);
    }

  const columns = useMemo(
      () => [
        {
          Header: 'ID',
          accessor: 'subid',
          disableFilters: true,
        },
        {
          Header: 'Subject',
          accessor: 'subname',
          disableFilters: true,
        },
        {
          Header: 'Action',
          accessor: 'action',
          disableFilters: true,
          Cell: cellProps => {
              return (
                  <div className="d-flex gap-3">
                      {/*-------------------Edit button--------------------- */}
                      <Link
                          to="#"
                          className="text-success"
                          onClick={() => {
                              //const userData = cellProps.row.original;
                              onClickEdit();//Edit function call
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
                              //const userData = cellProps.row.original;
                              onClickDelete();//Delete function call
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

  //Sample data
  const data = [
    {
      "subid": "1",
      "subname": "Water Bowser supply"
    },
    {
      "subid": "2",
      "subname": "Procurement"
    },
  ];

    //Delete function variables
    const [deleteModal, setDeleteModal] = useState(false);

    //Delete function
    const onClickDelete = officer => {
        setDeleteModal(true);
    };

    //Edit function variables
    const [editSubjectModal, setEditSubjectModal] = useState(false);

    //Edit function
    const onClickEdit = officer => {
        setEditSubjectModal(true);
    };

  //meta title
  document.title = "Admin | PDPS";

  return (
      <React.Fragment>
      {/*Delete pop up window*/}
      <DeleteModal
          show={deleteModal}
          onCloseClick={() => setDeleteModal(false)}
      />

      {/*Edit pop up window*/}
      <EditSubjectModal
          show={editSubjectModal}
          onCloseClick={() => setEditSubjectModal(false)}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Officer" breadcrumbItem="Subject" />
            <Row>
                <Col xl={4}>
                    <Card>
                        <CardBody>
                            <CardTitle className="mb-4">Add </CardTitle>
                            <Form onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}>

                                <div className="mb-3">
                                    <Label htmlFor="subject" className="col-form-label col-lg-4">
                                        Subject Name
                                    </Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Officer ..."
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.subject || ""}
                                        invalid={
                                            validation.touched.subject && validation.errors.subject ? true : false
                                        }
                                    />
                                    {validation.touched.subject && validation.errors.subject ? (
                                        <FormFeedback type="invalid">{validation.errors.subject}</FormFeedback>
                                    ) : null}
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary w-md">
                                        Add
                                    </button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col xl={8}>
                    <Card>
                        <CardBody>
                            <CardTitle className="h4">View | Edit | Delete </CardTitle>
                            <div className="table-responsive">
                                <TableContainer
                                    columns={columns}
                                    data={news}
                                    isGlobalFilter={true}
                                    isAddOptions={false}
                                    customPageSize={10}
                                    className=""
                                />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
      </div>
      </React.Fragment>
  );
}
DatatableTables.propTypes = {
  preGlobalFilteredRows: PropTypes.any,

};


export default Subject;