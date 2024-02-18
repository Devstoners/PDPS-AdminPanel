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
import memberService from "../../../services/MemberService";

const EditDivisionModal = ({ show, onClickEdit, onCloseClick, division, onUpdateSuccess }) => {
  const [editedDivision, setEditedDivision] = useState({ id: "", divisionEn: "", divisionSi: "", divisionTa: "" });

  useEffect(() => {
    if (show) {
      // Set the editedDivision state with the division prop passed from the parent component
      setEditedDivision(division);
    }
  }, [show, division]); // Include division prop in the dependency array

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: editedDivision.id,
      divisionEn: editedDivision.divisionEn,
      divisionSi: editedDivision.divisionSi,
      divisionTa: editedDivision.divisionTa,
    },
    validationSchema: Yup.object({
      id: Yup.string().required("Please Enter Division ID"),
      divisionEn: Yup.string().required("Please Enter Division in English"),
      divisionSi: Yup.string().required("Please Enter Division in Sinhala"),
      divisionTa: Yup.string().required("Please Enter Division in Tamil"),
    }),
    onSubmit: async values => {
      try {
        const updateDivision = {
          id: editedDivision.id,
          divisionEn: values.divisionEn,
          divisionSi: values.divisionSi,
          divisionTa: values.divisionTa,
        };
        await memberService.editDivision(updateDivision);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Division updated successfully!",
        });
        validation.resetForm();
        onCloseClick(); // Close the modal
        onUpdateSuccess(); // Call the onUpdateSuccess function
      } catch (error) {
        console.error("Error editing division : ", error);
      }
    },
  });

  return (
    <Modal size="lg" isOpen={show} toggle={onCloseClick} centered={true}>
      <div className="modal-content">
        <ModalHeader>
          <div className="h4">Edit Division</div>
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
                    htmlFor="divisionEn"
                    className="col-form-label col-lg-6"
                  >
                    English
                  </Label>
                  <Input
                    id="divisionEn"
                    name="divisionEn"
                    type="text"
                    className="form-control"
                    placeholder="Name of poling division"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.divisionEn || ""}
                    invalid={
                      validation.touched.divisionEn &&
                      validation.errors.divisionEn
                        ? true
                        : false
                    }
                  />
                  {validation.touched.divisionEn &&
                  validation.errors.divisionEn ? (
                    <FormFeedback type="invalid">
                      {validation.errors.divisionEn}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label
                    htmlFor="divisionSi"
                    className="col-form-label col-lg-6"
                  >
                    Sinhala
                  </Label>
                  <Input
                    id="divisionSi"
                    name="divisionSi"
                    type="text"
                    className="form-control"
                    placeholder="ඡන්ද කොඨාශයේ නම"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.divisionSi || ""}
                    invalid={
                      validation.touched.divisionSi &&
                      validation.errors.divisionSi
                        ? true
                        : false
                    }
                  />
                  {validation.touched.divisionSi &&
                  validation.errors.divisionSi ? (
                    <FormFeedback type="invalid">
                      {validation.errors.divisionSi}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label
                    htmlFor="divisionTa"
                    className="col-form-label col-lg-6"
                  >
                    Tamil
                  </Label>
                  <Input
                    id="divisionTa"
                    name="divisionTa"
                    type="text"
                    className="form-control"
                    placeholder="வாக்குச் சாவடியின் பெயர்"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.divisionTa || ""}
                    invalid={
                      validation.touched.divisionTa &&
                      validation.errors.divisionTa
                        ? true
                        : false
                    }
                  />
                  {validation.touched.divisionTa &&
                  validation.errors.divisionTa ? (
                    <FormFeedback type="invalid">
                      {validation.errors.divisionTa}
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

EditDivisionModal.propTypes = {
  onCloseClick: PropTypes.func,
  onClickEdit: PropTypes.func,
  show: PropTypes.any,
  division: PropTypes.object,
  onUpdateSuccess: PropTypes.func, // Add prop type for onUpdateSuccess
};

export default EditDivisionModal;
