
import React from "react"
//import { Modal, ModalBody } from "reactstrap"
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
const EditModal = ({ show, onCloseClick }) => {
  return ( 
            <Modal>
                    <ModalHeader> Add User </ModalHeader>
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
                              <Label className="form-label">Type</Label>
							  
							   <Select
								name = "type"
								isMulti={true}
								onChange={() => {}}
								className="select2-selection"
								/>
                              
                                
                              {validation.touched.type &&
                                validation.errors.type ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.type}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Party</Label>
                              <Select
								name = "party"
								isMulti={false}
								onChange={() => {}}
								className="select2-selection"
                                onBlur={validation.handleBlur}
                                value={validation.values.party || ""}
                                invalid={
                                  validation.touched.party &&
                                    validation.errors.party
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.party &&
                                validation.errors.party ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.party}
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


export default EditModal
				  