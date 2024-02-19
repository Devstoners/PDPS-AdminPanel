import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import memberService from "../../../services/MemberService";

const EditPartyModal = ({ show, onClickEdit, onCloseClick, party, onUpdateSuccess }) => {
  const [editedParty, setEditedParty] = useState({id:"", partyEn: "", partySi: "", partyTa: "" });

  useEffect(() => {
    if (show) {
      setEditedParty(party);
      console.log(party)
    }
  }, [show, party]); // Include party prop in the dependency array

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: editedParty.id,
      partyEn: editedParty.partyEn,
      partySi: editedParty.partySi,
      partyTa: editedParty.partyTa,
    },
    validationSchema: Yup.object({
      id: Yup.string().required("Please Enter party ID"),
      partyEn: Yup.string().required("Please Enter party in English"),
      partySi: Yup.string().required("Please Enter party in Sinhala"),
      partyTa: Yup.string().required("Please Enter party in Tamil"),
    }),
    onSubmit: async values => {
      try {
        const updateParty = {
          id: editedParty.id,
          partyEn: values.partyEn,
          partySi: values.partySi,
          partyTa: values.partyTa,
        };
        await memberService.editParty(updateParty);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Party updated successfully!",
        });
        validation.resetForm();
        onCloseClick(); // Close the modal
        onUpdateSuccess(); // Call the onUpdateSuccess function
      } catch (error) {
        console.error("Error editing party : ", error);
      }
    },
  });

    return (
    <Modal size="lg" isOpen={show} toggle={onCloseClick}  centered={true}>
      <div className="modal-content">
      <ModalHeader>
          <div className="h4">Edit Party</div>
          <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3"></button>
      </ModalHeader>
        <ModalBody className="px-4 py-5">
          <Form onSubmit={validation.handleSubmit}>
            <Row form>
                <Col xs={12}>
                  <div className="mb-3">
                    <Label
                      htmlFor="partyEn"
                      className="col-form-label col-lg-4"
                    >
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
                        validation.touched.partyEn &&
                        validation.errors.partyEn
                          ? true
                          : false
                      }
                    />
                    {validation.touched.partyEn &&
                    validation.errors.partyEn ? (
                      <FormFeedback type="invalid">
                        {validation.errors.partyEn}
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <Label
                      htmlFor="partySi"
                      className="col-form-label col-lg-4"
                    >
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
                        validation.touched.partySi &&
                        validation.errors.partySi
                          ? true
                          : false
                      }
                    />
                    {validation.touched.partySi &&
                    validation.errors.partySi ? (
                      <FormFeedback type="invalid">
                        {validation.errors.partySi}
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <Label
                      htmlFor="partyTa"
                      className="col-form-label col-lg-4"
                    >
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
                        validation.touched.partyTa &&
                        validation.errors.partyTa
                          ? true
                          : false
                      }
                    />
                    {validation.touched.partyTa &&
                    validation.errors.partyTa ? (
                      <FormFeedback type="invalid">
                        {validation.errors.partyTa}
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
  )
}

EditPartyModal.propTypes = {
  onCloseClick: PropTypes.func,
  onClickEdit: PropTypes.func,
  show: PropTypes.any,
  party: PropTypes.object,
  onUpdateSuccess: PropTypes.func, // Add prop type for onUpdateSuccess
}
export default EditPartyModal
