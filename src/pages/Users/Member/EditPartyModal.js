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

const EditPartyModal = ({ show, onClickEdit, onCloseClick }) => {
    const [party, setParty] = useState();
    // Form validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            partyid: (party && party.partyid) || "",
            partyname: (party && party.partyname) || "",
        },
        validationSchema: Yup.object({
            partyid: Yup.string().required("Please Enter Party ID"),
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
        var partyid = document.getElementById("partyid").value;
        var partyname = document.getElementById("partyname").value;


        if (partyid === "") {
            modifiedV["partyid"] = false;
        } else {
            modifiedV["partyid"] = true;
        }

        if (partyname === "") {
            modifiedV["partyname"] = false;
        } else {
            modifiedV["partyname"] = true;
        }
        setValidation(modifiedV);
    }


    return (
    <Modal size="sm" isOpen={show} toggle={onCloseClick}  centered={true}>
      <div className="modal-content">
      <ModalHeader>
          <div className="h4">Edit Party</div>
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
                        <Label htmlFor="partyid" className="form-label">
                            Party ID
                        </Label>
                        <Input
                            id="partyid"
                            name="partyid"
                            type="number"
                            className="form-control"
                            placeholder="Party ID..."
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.partyid || ""}
                            invalid={
                                validation.touched.partyid && validation.errors.partyid ? true : false
                            }
                        />
                        {validation.touched.partyid && validation.errors.partyid ? (
                            <FormFeedback type="invalid">{validation.errors.partyid}</FormFeedback>
                        ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="partyname" className="form-label">
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

EditPartyModal.propTypes = {
  onCloseClick: PropTypes.func,
  onClickEdit: PropTypes.func,
  show: PropTypes.any
}
export default EditPartyModal
