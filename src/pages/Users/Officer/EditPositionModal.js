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

const EditPositionModal = ({ show, onClickEdit, onCloseClick }) => {
    const [position, setPosition ]= useState();
    // Form validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            posid: (position && position.posid) || "",
            posname: (position && position.posname) || "",
        },
        validationSchema: Yup.object({
            posid: Yup.string().required("Please Enter Position ID"),
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
        var posid = document.getElementById("posid").value;
        var divname = document.getElementById("posname").value;


        if (posid === "") {
            modifiedV["posid"] = false;
        } else {
            modifiedV["posid"] = true;
        }

        if (posname === "") {
            modifiedV["posname"] = false;
        } else {
            modifiedV["posname"] = true;
        }
        setValidation(modifiedV);
    }




  return (
    <Modal size="sm" isOpen={show} toggle={onCloseClick}  centered={true}>
      <div className="modal-content">
      <ModalHeader>
          <div className="h4">Edit Position</div>
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
                        <Label htmlFor="posid" className="form-label">
                            Position ID
                        </Label>
                        <Input
                            id="posid"
                            name="posid"
                            type="number"
                            className="form-control"
                            placeholder="Position ID..."
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.posid || ""}
                            invalid={
                                validation.touched.posid && validation.errors.posid ? true : false
                            }
                        />
                        {validation.touched.posid && validation.errors.posid ? (
                            <FormFeedback type="invalid">{validation.errors.posid}</FormFeedback>
                        ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="posname" className="form-label">
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

EditPositionModal.propTypes = {
  onCloseClick: PropTypes.func,
  onClickEdit: PropTypes.func,
  show: PropTypes.any
}
export default EditPositionModal
