import React, {useState} from "react"
import {
    Col,
    Form, FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from "reactstrap"
import PropTypes from 'prop-types'
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

const EditDivisionModal = ({ show, onClickEdit, onCloseClick }) => {
    const [division, setDivision] = useState();
    // Form validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            divid: (division && division.divid) || "",
            divname: (division && division.divname) || "",
        },
        validationSchema: Yup.object({
            divid: Yup.string().required("Please Enter Division ID"),
            divname: Yup.string().required("Please Enter Division Name"),
        }),
        onSubmit: (values) => {
            console.log("values", values);
            validation.resetForm();
        }
    });

    const [formValidation, setValidation] = useState({
        divid: null,
        divname: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        const modifiedV = { ...formValidation };
        var divid = document.getElementById("divid").value;
        var divname = document.getElementById("divname").value;


        if (divid === "") {
            modifiedV["divid"] = false;
        } else {
            modifiedV["divid"] = true;
        }

        if (divname === "") {
            modifiedV["divname"] = false;
        } else {
            modifiedV["divname"] = true;
        }
        setValidation(modifiedV);
    }


    return (
    <Modal size="sm" isOpen={show} toggle={onCloseClick}  centered={true}>
      <div className="modal-content">
      <ModalHeader>
          <div className="h4">Edit Division</div>
          <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3"></button>
      </ModalHeader>
        <ModalBody className="px-4 py-5">
            <Form onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
            }}>
            <Row form>
                <Col xs={12}>
                    <div className="mb-3">
                        <Label htmlFor="divid" className="form-label">
                            Division ID
                        </Label>
                        <Input
                            id="divid"
                            name="divid"
                            type="number"
                            className="form-control"
                            placeholder="Division ID..."
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.divid || ""}
                            invalid={
                                validation.touched.divid && validation.errors.divid ? true : false
                            }
                        />
                        {validation.touched.divid && validation.errors.divid ? (
                            <FormFeedback type="invalid">{validation.errors.divid}</FormFeedback>
                        ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="divname" className="form-label">
                        Division Name
                      </Label>
                      <Input
                          id="divname"
                          name="divname"
                          type="text"
                          className="form-control"
                          placeholder="Enter Division ..."
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.divname || ""}
                          invalid={
                              validation.touched.divname && validation.errors.divname ? true : false
                          }
                      />
                        {validation.touched.divname && validation.errors.divname ? (
                            <FormFeedback type="invalid">{validation.errors.divname}</FormFeedback>
                        ) : null}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="d-flex gap-3">
                      <button type="submit" className="btn btn-success save-user" onClick={onClickEdit}>Save</button>
                      <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
                    </div>
                </Col>
            </Row>
            </Form>
        </ModalBody>
      </div>
    </Modal>
  )
}

EditDivisionModal.propTypes = {
  onCloseClick: PropTypes.func,
  onClickEdit: PropTypes.func,
  show: PropTypes.any
}
export default EditDivisionModal
