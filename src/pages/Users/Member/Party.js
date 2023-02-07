import React, { useEffect, useState, useRef,useMemo } from "react";
import PropTypes from 'prop-types';

//import components
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import DeleteModal from "../../../components/Common/DeleteModal";
import EditPartyModal from "./EditPartyModal";
import TableContainer from '../../../components/Common/TableContainer';
import DatatableTables from "../../Tables/DatatableTables";
import {Link} from "react-router-dom";

import {
    Form,
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    UncontrolledTooltip, Label, Input, Button, FormFeedback,
} from "reactstrap"

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

function Party() {

    const [party, setParty] = useState();
    // Form validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            partyname: (party && party.partyname) || "",
        },
        validationSchema: Yup.object({
            partyname: Yup.string().required("Please Enter Party Name"),
        }),
        onSubmit: (values) => {
            console.log("values", values);
            validation.resetForm();
        }
    });

    const [formValidation, setValidation] = useState({
        partyid: null,
        partyname: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        const modifiedV = { ...formValidation };
        var partyname = document.getElementById("partyname").value;


        if (partyname === "") {
            modifiedV["partyname"] = false;
        } else {
            modifiedV["partyname"] = true;
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
          Header: 'Party',
          accessor: 'party',
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
      "party": "Jathika Jana Balawegaya"
    },
    {
      "id": "2",
      "party": "Samagi Balawegaya"
    },
  ];

    //Delete function variables
    const [deleteModal, setDeleteModal] = useState(false);

    //Delete function
    const onClickDelete = position => {
        setDeleteModal(true);
    };

    //Edit function variables
    const [editPartyModal, setEditPartyModal] = useState(false);

    //Edit function
    const onClickEdit = position => {
        setEditPartyModal(true);
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
      <EditPartyModal
          show={editPartyModal}
          onCloseClick={() => setEditPartyModal(false)}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Member" breadcrumbItem="Party" />
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
                                    <Label htmlFor="partyname" className="col-form-label col-lg-4">
                                        Party Name
                                    </Label>
                                    <Input
                                        id="partyname"
                                        name="partyname"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Party ..."
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.partyname || ""}
                                        invalid={
                                            validation.touched.partyname && validation.errors.partyname ? true : false
                                        }
                                    />
                                    {validation.touched.partyname && validation.errors.partyname ? (
                                        <FormFeedback type="invalid">{validation.errors.partyname}</FormFeedback>
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
                            <CardTitle className="h4"> Edit | Delete </CardTitle>
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


export default Party;