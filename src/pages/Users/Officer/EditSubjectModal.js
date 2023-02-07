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

const EditSubjectModal = ({ show, onClickEdit, onCloseClick }) => {
    const [position, setPosition ]= useState();
    // Form validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            subid: (position && position.subid) || "",
            subname: (position && position.subname) || "",
        },
        validationSchema: Yup.object({
            subid: Yup.string().required("Please Enter Subject ID"),
            subname: Yup.string().required("Please Enter Subject Name"),
        }),
        onSubmit: (values) => {
            console.log("values", values);
            validation.resetForm();
        }
    });
    const [formValidation, setValidation] = useState({
        subid: null,
        subname: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        const modifiedV = { ...formValidation };
        var subid = document.getElementById("subid").value;
        var divname = document.getElementById("subname").value;


        if (subid === "") {
            modifiedV["subid"] = false;
        } else {
            modifiedV["subid"] = true;
        }

        if (subname === "") {
            modifiedV["subname"] = false;
        } else {
            modifiedV["subname"] = true;
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
                        <Label htmlFor="subid" className="form-label">
                            Subject ID
                        </Label>
                        <Input
                            id="subid"
                            name="subid"
                            type="number"
                            className="form-control"
                            placeholder="Position ID..."
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.subid || ""}
                            invalid={
                                validation.touched.subid && validation.errors.subid ? true : false
                            }
                        />
                        {validation.touched.subid && validation.errors.subid ? (
                            <FormFeedback type="invalid">{validation.errors.subid}</FormFeedback>
                        ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="subname" className="form-label">
                        Subject Name
                      </Label>
                      <Input
                          id="subname"
                          name="subname"
                          type="text"
                          className="form-control"
                          placeholder="Enter Position ..."
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.subname || ""}
                          invalid={
                              validation.touched.subname && validation.errors.subname ? true : false
                          }
                      />
                        {validation.touched.subname && validation.errors.subname ? (
                            <FormFeedback type="invalid">{validation.errors.subname}</FormFeedback>
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

EditSubjectModal.propTypes = {
  onCloseClick: PropTypes.func,
  onClickEdit: PropTypes.func,
  show: PropTypes.any
}
export default EditSubjectModal
