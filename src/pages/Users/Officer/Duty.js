import React, { useEffect, useState, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
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
  Button,
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import TableContainer from "../../../components/Common/TableContainer"
import DeleteModal from "components/Common/DeleteModal"
import Swal from "sweetalert2"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import officerService from "../../../services/OfficerService"
import Select from "react-select"

const Duty = props => {
  document.title = "Admin | PDPS"

  // State variables
  const [refreshTable, setRefreshTable] = useState(false)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [dutyList, setDutyList] = useState([])
  const [duty, setDuty] = useState(null)
  const [levels, setLevels] = useState([])
  const [levelEdit, setLevelEdit] = useState({})

  const baseUrl = "http://127.0.0.1:8000"

  // Fetch all levels 
  useEffect(() => {
    const fetchLevels = async () => {
      const result = await officerService.getLevel()
      if (result?.AllLevels) {
        setLevels(result.AllLevels)
        // console.log(levels)
      } else {
        console.error("Error fetching levels:", result)
      }
    }
    fetchLevels()
  }, [])

  //View data in the table
  const fetchData = async () => {
    try {
      const fetchedData = await officerService.getDuty()
      const allDutyArray = fetchedData.AllSubjects || []

      const mappedData = allDutyArray.map((item, index) => {
        return {
          displayId: allDutyArray.length - index,
          id: item.id,
          dutyEn: item.subject_en,
          dutySi: item.subject_si,
          dutyTa: item.subject_ta,
          levelId:item.level.id,
          levelEn: item.level.level_en,
        }
      })
      setDutyList(mappedData)
    } catch (error) {
      console.error("Error fetching duty data:", error)
    }
  }

  // Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      dutyEn: (duty && duty.dutyEn) || "",
      dutySi: (duty && duty.dutySi) || "",
      dutyTa: (duty && duty.dutyTa) || "",
      level: duty?.level?.value || "",
    },
    validationSchema: Yup.object({
      dutyEn: Yup.string().required("Please Enter Duty Name in English"),
      dutySi: Yup.string().required("Please Enter Duty Name in Sinhala"),
      dutyTa: Yup.string().required("Please Enter Duty Name in Tamil"),
      level: Yup.string().required("Please Select Duty Level"),
    }),
    onSubmit: handleSubmit,
  })

  // Submit handler
  async function handleSubmit(values) {
    // console.log("Form values before submission:", values);
    try {
      const formData = new FormData()
      formData.append("dutyEn", values.dutyEn)
      formData.append("dutySi", values.dutySi)
      formData.append("dutyTa", values.dutyTa)
      formData.append("level", values.level)
      let result
      if (isEdit) {
        formData.append("id", duty.id)
        // console.log(duty.id)
        formData.append("_method", "PUT")
        result = await officerService.editDuty(formData)
      } else {
        result = await officerService.addDuty(formData)
      }

      if (result.errorMessage) {
        const formattedErrorMessage = result.errorMessage.replace(/\n/g, "<br>")
        Swal.fire({
          title: "Error",
          html: formattedErrorMessage,
          icon: "error",
          allowOutsideClick: false,
        })
      } else {
        await Swal.fire(
          isEdit
            ? "Duty Edited Successfully!"
            : "Duty Added Successfully!",
          "",
          "success"
        )
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
      }
    } catch (error) {
      Swal.fire(
        "Error",
        `An error occurred while ${isEdit ? "editing" : "adding"} duty`,
        "error"
      )
    }
    toggle()
  }

  // Modal toggle function
  const toggle = () => {
    setModal(!modal)
  }

  // Handle edit click
  const handleUserClick = dutyData => {
    // console.log("Duty Data:", dutyData); 
  
    const selectedLevel = {
      value: dutyData.levelId,  // Access the level ID
      label: dutyData.levelEn,  // Access the level label
    };
  
    // console.log("Selected Level:", selectedLevel);
    setDuty({
      id: dutyData.id,
      dutyEn: dutyData.dutyEn,
      dutySi: dutyData.dutySi,
      dutyTa: dutyData.dutyTa,
      level: selectedLevel,  // Store the level data here
    });
    setLevelEdit(selectedLevel); // Set the selected level
    // console.log("Level Edit:", levelEdit);
    setIsEdit(true);  // Toggle edit mode
    toggle();  // Open the modal
  };

  // setTimeout(() => {
  //   console.log("Level Edit after timeout:", levelEdit);
  // }, 100);
  
  // useEffect(() => {
  //   console.log("Level Edit state updated:", levelEdit);
  // }, [levelEdit]);

  // // Fetch level data when editing the form
  // useEffect(() => {
  //   if (duty) {
  //     const selectedLevel = {
  //       value: duty.level.levelId,
  //       label: duty.level.levelEn,
  //     }
  //     setLevelEdit(selectedLevel)
  //   }
  // }, [duty])


  // Delete duty
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = duty => {
    setDuty(duty)
    setDeleteModal(true)
  }

  const handleDeleteDuty = async () => {
    try {
      await officerService.deleteDuty(duty.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting duty:", error)
    }
  }

  // Add new duty
  const handleAddNewClick = () => {
    setLevelEdit(null)
    setModal(true)
    setDuty(null)
    setIsEdit(false)
    validation.resetForm()
  }

 
  // Columns configuration
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "displayId",
        disableFilters: true,
      },

      {
        Header: "Duty",
        accessor: "dutyEn",
        disableFilters: true,
      },

      {
        Header: "Duty Level",
        accessor: "levelEn",
        disableFilters: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-3">
            <Link
              to="#"
              className="text-success"
              onClick={() => handleUserClick(row.original)}
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              <UncontrolledTooltip placement="top" target="edittooltip">
                Edit
              </UncontrolledTooltip>
            </Link>
            <Link
              to="#"
              className="text-danger"
              onClick={() => onClickDelete(row.original)}
            >
              <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
              <UncontrolledTooltip placement="top" target="deletetooltip">
                Delete
              </UncontrolledTooltip>
            </Link>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteDuty}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Duty" breadcrumbItem="Duty List" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="text-sm-end">
                    <Button
                      type="button"
                      color="primary"
                      className="btn mb-2 me-2"
                      onClick={handleAddNewClick}
                    >
                      <i className="mdi mdi-plus-circle-outline me-1" />
                      Add New
                    </Button>
                  </div>
                  <TableContainer
                    columns={columns}
                    data={dutyList}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className=""
                  />
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!duty ? "Edit Duty" : "Add Duty"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={validation.handleSubmit}
                        encType="multipart/form-data"
                      >
                        <Row form>
                          <Col xs={12}>
                            {/* Duty Level */}
                            <div className="mb-3">
                              <Label className="form-label">Duty Level</Label>
                              <Select
                                name="level"
                                isMulti={false}
                                value={levelEdit} // Selected level state
                                onChange={selectedOption => {
                                  setLevelEdit(selectedOption) // Set selected level                       
                                  validation.setFieldValue(
                                    "level",
                                    selectedOption?.value
                                  ) // Update Formik's value for level
                                  // console.log("Formik level value:", validation.values.level);
                                }}
                                options={(levels || []).map(level => ({
                                  value: level.id,
                                  label: level.level_en, // Mapping levels to Select options
                                }))}
                                onBlur={() =>
                                  validation.setFieldTouched("level", true)
                                } // Formik validation
                                className={
                                  validation.touched.level &&
                                  validation.errors.level
                                    ? "is-invalid"
                                    : ""
                                }
                              />
                              {validation.touched.level &&
                                validation.errors.level && (
                                  <FormFeedback type="invalid">
                                    {validation.errors.level}
                                  </FormFeedback>
                                )}
                            </div>

                            {/* Duty Name - English */}
                            <div className="mb-3">
                              <Label htmlFor="dutyEn"> Duty Name - English </Label>
                              <Input
                                id="dutyEn"
                                name="dutyEn"
                                type="text"
                                className="form-control"
                                placeholder="Post in English"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.dutyEn || ""}
                                invalid={
                                  validation.touched.dutyEn &&
                                  validation.errors.dutyEn
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.dutyEn &&
                              validation.errors.dutyEn ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.dutyEn}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/* Duty Name - Sinhala */}
                            <div className="mb-3">
                              <Label htmlFor="dutySi"> Duty Name - Sinhala </Label>
                              <Input
                                id="dutySi"
                                name="dutySi"
                                type="text"
                                className="form-control"
                                 placeholder="තනතුර සිංහ‌ල භාෂාවෙන්"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.dutySi || ""}
                                invalid={
                                  validation.touched.dutySi &&
                                  validation.errors.dutySi
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.dutySi &&
                              validation.errors.dutySi ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.dutySi}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/* Duty Name - Tamil */}
                            <div className="mb-3">
                              <Label htmlFor="dutyTa">
                                {" "}
                                Duty Name - Tamil{" "}
                              </Label>
                              <Input
                                id="dutyTa"
                                name="dutyTa"
                                type="text"
                                className="form-control"
                                placeholder="தமிழில் இடுகையிடவும்"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.dutyTa || ""}
                                invalid={
                                  validation.touched.dutyTa &&
                                  validation.errors.dutyTa
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.dutyTa &&
                              validation.errors.dutyTa ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.dutyTa}
                                </FormFeedback>
                              ) : null}
                            </div>
                          
                          </Col>
                        </Row>

                        {/* Submit button */}
                        <Row>
                          <Col>
                            <div className="text-end d-flex gap-3">
                              <button
                                type="submit"
                                className="btn btn-success save-user"
                              >
                                {" "}
                                Save{" "}
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={toggle}
                              >
                                Close
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </ModalBody>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}
export default withRouter(Duty)
