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



import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
const ProjectModal = ({ show, onClick, onCloseClick }) => {



    return (
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
  )
}


export default ProjectModal
