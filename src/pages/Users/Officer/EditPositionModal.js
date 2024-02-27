import React, { useState, useEffect } from "react";
import {
    Col,
    Form,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
} from "reactstrap";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import officerService from "../../../services/OfficerService";

const EditPositionModal = ({ show, onClickEdit, onCloseClick, position, onUpdateSuccess }) => {
    const [editedPosition, setEditedPosition] = useState({ id: "", positionEn: "", positionSi: "", positionTa: "" });

    useEffect(() => {
        if (show) {
            // Set the editedPosition state with the position prop passed from the parent component
            setEditedPosition(position);
        }
    }, [show, position]); // Include position prop in the dependency array

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: editedPosition.id,
            positionEn: editedPosition.positionEn,
            positionSi: editedPosition.positionSi,
            positionTa: editedPosition.positionTa,
        },
        validationSchema: Yup.object({
            positionEn: Yup.string().required("Please Enter Position in English"),
            positionSi: Yup.string().required("Please Enter Position in Sinhala"),
            positionTa: Yup.string().required("Please Enter Position in Tamil"),
        }),
        onSubmit: async values => {
            try {
                const updatePosition = {
                    id: editedPosition.id,
                    positionEn: values.positionEn,
                    positionSi: values.positionSi,
                    positionTa: values.positionTa,
                };
                await officerService.editPosition(updatePosition);
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Position updated successfully!",
                });
                validation.resetForm();
                onCloseClick(); // Close the modal
                onUpdateSuccess(); // Call the onUpdateSuccess function
            } catch (error) {
                console.error("Error editing position : ", error);
            }
        },
    });

    return (
      <Modal size="lg" isOpen={show} toggle={onCloseClick} centered={true}>
          <div className="modal-content">
              <ModalHeader>
                  <div className="h4">Edit Position</div>
                  <button
                    type="button"
                    onClick={onCloseClick}
                    className="btn-close position-absolute end-0 top-0 m-3"
                  ></button>
              </ModalHeader>
              <ModalBody className="px-4 py-5">
                  <Form onSubmit={validation.handleSubmit}>
                      <Row form>
                          <Col xs={12}>
                              <div className="mb-3">
                                  <Label
                                    htmlFor="positionEn"
                                    className="col-form-label col-lg-6"
                                  >
                                      English
                                  </Label>
                                  <Input
                                    id="positionEn"
                                    name="positionEn"
                                    type="text"
                                    className="form-control"
                                    placeholder="Position Name"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.positionEn || ""}
                                    invalid={
                                        validation.touched.positionEn &&
                                        validation.errors.positionEn
                                          ? true
                                          : false
                                    }
                                  />
                                  {validation.touched.positionEn &&
                                  validation.errors.positionEn ? (
                                    <FormFeedback type="invalid">
                                        {validation.errors.positionEn}
                                    </FormFeedback>
                                  ) : null}
                              </div>

                              <div className="mb-3">
                                  <Label
                                    htmlFor="positionSi"
                                    className="col-form-label col-lg-6"
                                  >
                                      Sinhala
                                  </Label>
                                  <Input
                                    id="positionSi"
                                    name="positionSi"
                                    type="text"
                                    className="form-control"
                                    placeholder="තනතුරේ නම"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.positionSi || ""}
                                    invalid={
                                        validation.touched.positionSi &&
                                        validation.errors.positionSi
                                          ? true
                                          : false
                                    }
                                  />
                                  {validation.touched.positionSi &&
                                  validation.errors.positionSi ? (
                                    <FormFeedback type="invalid">
                                        {validation.errors.positionSi}
                                    </FormFeedback>
                                  ) : null}
                              </div>

                              <div className="mb-3">
                                  <Label
                                    htmlFor="positionTa"
                                    className="col-form-label col-lg-6"
                                  >
                                      Tamil
                                  </Label>
                                  <Input
                                    id="positionTa"
                                    name="positionTa"
                                    type="text"
                                    className="form-control"
                                    placeholder="பதவி பெயர்"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.positionTa || ""}
                                    invalid={
                                        validation.touched.positionTa &&
                                        validation.errors.positionTa
                                          ? true
                                          : false
                                    }
                                  />
                                  {validation.touched.positionTa &&
                                  validation.errors.positionTa ? (
                                    <FormFeedback type="invalid">
                                        {validation.errors.positionTa}
                                    </FormFeedback>
                                  ) : null}
                              </div>
                          </Col>
                      </Row>
                      <Row>
                          <Col>
                              <div className="d-flex gap-3">
                                  <button
                                    type="submit"
                                    className="btn btn-success save-user"
                                    onClick={onClickEdit}
                                  >
                                      Save
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onCloseClick}
                                  >
                                      Close
                                  </button>
                              </div>
                          </Col>
                      </Row>
                  </Form>
              </ModalBody>
          </div>
      </Modal>
    );
};

EditPositionModal.propTypes = {
    onCloseClick: PropTypes.func,
    onClickEdit: PropTypes.func,
    show: PropTypes.any,
    position: PropTypes.object,
    onUpdateSuccess: PropTypes.func, // Add prop type for onUpdateSuccess
};

export default EditPositionModal;
