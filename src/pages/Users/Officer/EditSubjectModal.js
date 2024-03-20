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

const EditSubjectModal = ({ show, onClickEdit, onCloseClick, subject, onUpdateSuccess }) => {
    const [editedSubject, setEditedSubject] = useState({ id: "", subjectEn: "", subjectSi: "", subjectTa: "" });

    useEffect(() => {
        if (show) {
            // Set the editedSubject state with the subject prop passed from the parent component
            setEditedSubject(subject);
        }
    }, [show, subject]); // Include subject prop in the dependency array

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: editedSubject.id,
            // subjectEn: (editedSubject && editedSubject.subjectEn) || "",
            subjectEn: editedSubject.subjectEn,
            subjectSi: editedSubject.subjectSi,
            subjectTa: editedSubject.subjectTa,
        },
        validationSchema: Yup.object({
            subjectEn: Yup.string().required("Please Enter Subject in English"),
            subjectSi: Yup.string().required("Please Enter Subject in Sinhala"),
            subjectTa: Yup.string().required("Please Enter Subject in Tamil"),
        }),
        onSubmit: async values => {
            try {
                // const updateSubject = {
                //     id: editedSubject.id,
                //     subjectEn: values.subjectEn,
                //     subjectSi: values.subjectSi,
                //     subjectTa: values.subjectTa,
                // };
                const  formData = new FormData();
                formData.append('id', values.id)
                formData.append('subjectEn', values.subjectEn)
                formData.append('subjectSi', values.subjectSi)
                formData.append('subjectTa', values.subjectTa)
                formData.append('_method', 'PUT');
                // const { result, errorMessage } = await officerService.editSubject(updateSubject);
                const { result, errorMessage } = await officerService.editSubject(formData);
                if (errorMessage) {
                    const formattedErrorMessage = errorMessage.replace(/\n/g, '<br>');
                    Swal.fire({
                        title: 'Error',
                        html: formattedErrorMessage,
                        icon: 'error',
                        allowOutsideClick: false
                    });
                } else {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Subject updated successfully!",
                    });
                    // validation.resetForm();
                    onCloseClick(); // Close the modal
                    onUpdateSuccess(); // Call the onUpdateSuccess function
                }
            } catch (error) {
                Swal.fire('Error', 'An error occurred while adding subject', 'error');
            }
        },
    });

    return (
      <Modal size="lg" isOpen={show} toggle={onCloseClick} centered={true}>
          <div className="modal-content">
              <ModalHeader>
                  <div className="h4">Edit Subject</div>
                  <button
                    type="button"
                    onClick={onCloseClick}
                    className="btn-close subject-absolute end-0 top-0 m-3"
                  ></button>
              </ModalHeader>
              <ModalBody className="px-4 py-5">
                  <Form onSubmit={validation.handleSubmit}>
                      <Row form>
                          <Col xs={12}>
                              <div className="mb-3">
                                  <Label
                                    htmlFor="subjectEn"
                                    className="col-form-label col-lg-6"
                                  >
                                      English
                                  </Label>
                                  <Input
                                    id="subjectEn"
                                    name="subjectEn"
                                    type="text"
                                    className="form-control"
                                    placeholder="Subject Name"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.subjectEn || ""}
                                    invalid={
                                        validation.touched.subjectEn &&
                                        validation.errors.subjectEn
                                          ? true
                                          : false
                                    }
                                  />
                                  {validation.touched.subjectEn &&
                                  validation.errors.subjectEn ? (
                                    <FormFeedback type="invalid">
                                        {validation.errors.subjectEn}
                                    </FormFeedback>
                                  ) : null}
                              </div>

                              <div className="mb-3">
                                  <Label
                                    htmlFor="subjectSi"
                                    className="col-form-label col-lg-6"
                                  >
                                      Sinhala
                                  </Label>
                                  <Input
                                    id="subjectSi"
                                    name="subjectSi"
                                    type="text"
                                    className="form-control"
                                    placeholder="තනතුරේ නම"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.subjectSi || ""}
                                    invalid={
                                        validation.touched.subjectSi &&
                                        validation.errors.subjectSi
                                          ? true
                                          : false
                                    }
                                  />
                                  {validation.touched.subjectSi &&
                                  validation.errors.subjectSi ? (
                                    <FormFeedback type="invalid">
                                        {validation.errors.subjectSi}
                                    </FormFeedback>
                                  ) : null}
                              </div>

                              <div className="mb-3">
                                  <Label
                                    htmlFor="subjectTa"
                                    className="col-form-label col-lg-6"
                                  >
                                      Tamil
                                  </Label>
                                  <Input
                                    id="subjectTa"
                                    name="subjectTa"
                                    type="text"
                                    className="form-control"
                                    placeholder="பதவி பெயர்"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.subjectTa || ""}
                                    invalid={
                                        validation.touched.subjectTa &&
                                        validation.errors.subjectTa
                                          ? true
                                          : false
                                    }
                                  />
                                  {validation.touched.subjectTa &&
                                  validation.errors.subjectTa ? (
                                    <FormFeedback type="invalid">
                                        {validation.errors.subjectTa}
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

EditSubjectModal.propTypes = {
    onCloseClick: PropTypes.func,
    onClickEdit: PropTypes.func,
    show: PropTypes.any,
    subject: PropTypes.object,
    onUpdateSuccess: PropTypes.func, // Add prop type for onUpdateSuccess
};

export default EditSubjectModal;
