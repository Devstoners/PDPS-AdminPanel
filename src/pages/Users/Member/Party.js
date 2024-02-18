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
import memberService from "../../../services/MemberService"
import Swal from "sweetalert2"

function Party() {

    const [party, setParty] = useState();
    // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      partyEn: "",
      partySi: "",
      partyTa: "",
    },
    validationSchema: Yup.object({
      partyEn: Yup.string().required("Please Enter Party Name in English"),
      partySi: Yup.string().required("Please Enter Party Name in Sinhala"),
      partyTa: Yup.string().required("Please Enter Party Name in Tamil"),
    }),
    onSubmit: async values => {
      try {
        await memberService.addParty(values)
        await Swal.fire("Party Added Successfully!", "", "success")
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
      } catch (error) {
        console.error("Error", error)
      }
    },
  })

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
                            <CardTitle className="mb-4">Add Party</CardTitle>
                          <Form onSubmit={validation.handleSubmit}>
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
                                    <Label htmlFor="partyEn" className="col-form-label col-lg-4">
                                        English
                                    </Label>
                                    <Input
                                        id="partyEn"
                                        name="partyEn"
                                        type="text"
                                        className="form-control"
                                        placeholder="Party name"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.partyEn || ""}
                                        invalid={
                                            validation.touched.partyEn && validation.errors.partyEn ? true : false
                                        }
                                    />
                                    {validation.touched.partyEn && validation.errors.partyEn ? (
                                        <FormFeedback type="invalid">{validation.errors.partyEn}</FormFeedback>
                                    ) : null}

                                </div>

                              <div className="mb-3">
                                <Label htmlFor="partySi" className="col-form-label col-lg-4">
                                  Sinhala
                                </Label>
                                <Input
                                  id="partySi"
                                  name="partySi"
                                  type="text"
                                  className="form-control"
                                  placeholder="පක්ෂයේ නම"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.partySi || ""}
                                  invalid={
                                    validation.touched.partySi && validation.errors.partySi ? true : false
                                  }
                                />
                                {validation.touched.partySi && validation.errors.partySi ? (
                                  <FormFeedback type="invalid">{validation.errors.partySi}</FormFeedback>
                                ) : null}

                              </div>

                              <div className="mb-3">
                                <Label htmlFor="partyTa" className="col-form-label col-lg-4">
                                  Tamil
                                </Label>
                                <Input
                                  id="partyTa"
                                  name="partyTa"
                                  type="text"
                                  className="form-control"
                                  placeholder="கட்சியின் பெயர்"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.partyTa || ""}
                                  invalid={
                                    validation.touched.partyTa && validation.errors.partyTa ? true : false
                                  }
                                />
                                {validation.touched.partyTa && validation.errors.partyTa ? (
                                  <FormFeedback type="invalid">{validation.errors.partyTa}</FormFeedback>
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
                            <CardTitle className="h4"> Edit | Delete Party </CardTitle>
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