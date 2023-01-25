
import React, { useEffect, useState, useRef,useMemo } from "react";
import PropTypes from 'prop-types';

//import components
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import DeleteModal from "../../../components/Common/DeleteModal";
import EditPositionModal from "./EditPositionModal";
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

function Position() {

    const [position, setPosition] = useState();
    // Form validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            posname: (position && position.posname) || "",
        },
        validationSchema: Yup.object({
            posname: Yup.string().required("Please Enter Position Name"),
        }),
        onSubmit: (values) => {
            console.log("values", values);
            validation.resetForm();
        }
    });

    const [formValidation, setValidation] = useState({
        posid: null,
        posname: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        const modifiedV = { ...formValidation };
        var posname = document.getElementById("posname").value;


        if (posname === "") {
            modifiedV["posname"] = false;
        } else {
            modifiedV["posname"] = true;
        }
        setValidation(modifiedV);
    }
  const columns = useMemo(
      () => [
        {
          Header: 'ID',
          accessor: 'id',
          disableFilters: true,
        },
        {
          Header: 'Position',
          accessor: 'position',
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
      "id": "1",
      "position": "Secretary"
    },
    {
      "id": "2",
      "position": "Development Officer"
    },
  ];

    //Delete function variables
    const [deleteModal, setDeleteModal] = useState(false);

    //Delete function
    const onClickDelete = position => {
        setDeleteModal(true);
    };

    //Edit function variables
    const [editPositionModal, setEditPositionModal] = useState(false);

    //Edit function
    const onClickEdit = position => {
        setEditPositionModal(true);
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
      <EditPositionModal
          show={editPositionModal}
          onCloseClick={() => setEditPositionModal(false)}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Member" breadcrumbItem="Position" />
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
                                {/*
                                <div className="mb-3">
                                    <Label htmlFor="posid" className="col-form-label col-lg-2">
                                        Position ID
                                    </Label>
                                    <Input
                                        id="posid"
                                        name="posid"
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter Position ID..."
                                    />
                                </div>
                                */}
                                <div className="mb-3">
                                    <Label htmlFor="posname" className="col-form-label col-lg-4">
                                        Position Name
                                    </Label>
                                    <Input
                                        id="posname"
                                        name="posname"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Position ..."
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.posname || ""}
                                        invalid={
                                            validation.touched.posname && validation.errors.posname ? true : false
                                        }
                                    />
                                    {validation.touched.posname && validation.errors.posname ? (
                                        <FormFeedback type="invalid">{validation.errors.posname}</FormFeedback>
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
                                    data={data}
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


export default Position;