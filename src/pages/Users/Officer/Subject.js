import React, { useEffect, useState, useMemo } from "react"
import { useFormik } from "formik"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import DeleteModal from "../../../components/Common/DeleteModal"
import EditSubjectModal from "./EditSubjectModal"
import TableContainer from "../../../components/Common/TableContainer"
import { Link } from "react-router-dom"
import {
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  UncontrolledTooltip,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap"
import * as Yup from "yup"
import Swal from "sweetalert2"
import officerService from "../../../services/OfficerService"
import * as response from "autoprefixer"

const Subject = () => {
  const [subjectList, setSubjectList] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const [subject, setSubject] = useState({})
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [editSubjectModal, setEditSubjectModal] = useState(false)

  //Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  //View data in the table
  const fetchData = async () => {
    try {
      const fetchedData = await officerService.getSubject()
      const allSubjectArray = fetchedData.AllSubjects || []
      const mappedData = allSubjectArray.map((item, index) => ({
        displayId: allSubjectArray.length - index,
        id: item.id,
        subjectEn: item.subject_en,
        subjectSi: item.subject_si,
        subjectTa: item.subject_ta,
      }))
      setSubjectList(mappedData)
    } catch (error) {
      console.error("Error fetching subject:", error)
    }
  }

  //Add subject
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      subjectEn: "",
      subjectSi: "",
      subjectTa: "",
    },
    validationSchema: Yup.object({
      subjectEn: Yup.string().required(
        "Please Enter Subject Name in English"
      ),
      subjectSi: Yup.string().required(
        "Please Enter Subject Name in Sinhala"
      ),
      subjectTa: Yup.string().required("Please Enter Subject Name in Tamil"),
    }),

    onSubmit: async values => {
      try {
        const { result, errorMessage } = await officerService.addSubject(values);
        if (errorMessage) {
          const formattedErrorMessage = errorMessage.replace(/\n/g, '<br>');
          Swal.fire({
            title: 'Error',
            html: formattedErrorMessage,
            icon: 'error',
            allowOutsideClick: false
          });
        } else {
          await Swal.fire("Subject Added Successfully!", "", "success");
          setRefreshTable(prevRefresh => !prevRefresh);
          validation.resetForm();
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred while adding subject', 'error');
      }
    },
  })

  //Table headings
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "displayId",
        disableFilters: true,
      },
      {
        Header: "Subject",
        accessor: "subjectEn",
        disableFilters: true,
      },
      {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => (
          <div className="d-flex gap-3">
            <Link
              to="#"
              className="text-success"
              onClick={() => onClickEdit(cellProps.row.original)}
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              <UncontrolledTooltip placement="top" target="edittooltip">
                Edit
              </UncontrolledTooltip>
            </Link>
            <Link
              to="#"
              className="text-danger"
              onClick={() => onClickDelete(cellProps.row.original)}
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

  //Delete
  const onClickDelete = subject => {
    setSubject(subject)
    setDeleteModal(true)
  }

  const handleDeleteSubject = async () => {
    try {
      await officerService.deleteSubject(subject.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error("Error deleting subject:", error.response.data.error);
      } else {
        // If the error structure is different or if there's no response message
        console.error("Error deleting subject:", error);
      }
    }
  }

  const toggle = () => {
    setModal(!modal)
  }
  //Edit
  const onClickEdit = subject => {
    setSubject(subject)
    setEditSubjectModal(true)
  }

  const onUpdateSuccess = () => {
    setRefreshTable(prevRefresh => !prevRefresh);
  };

  const handleEditSubject = arg => {
    setSubject({
      id: arg.id,
      subjectEn: arg.subjectEn,
      subjectSi: arg.subjectSi,
      subjectTa: arg.subjectTa,
    })
    validation.setValues({
      subjectEn: arg.subjectEn || "",
      subjectSi: arg.subjectSi || "",
      subjectTa: arg.subjectTa || "",
    })
    toggle()
  }



  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(false)}
        onDeleteClick={handleDeleteSubject}
      />
      <EditSubjectModal
        show={editSubjectModal}
        onCloseClick={() => setEditSubjectModal(false)}
        onClickEdit={handleEditSubject}
        subject={subject} // Pass the editedDivision state as subject prop
        onUpdateSuccess={onUpdateSuccess}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Officer" breadcrumbItem="Subject" />
          <Row>
            <Col xl={4}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Add Subject</CardTitle>
                  <Form onSubmit={validation.handleSubmit}>
                    <div className="mb-3">
                      <Label
                        htmlFor="divname"
                        className="col-form-label col-lg-6"
                      >
                        English
                      </Label>
                      <Input
                        id="subjectEn"
                        name="subjectEn"
                        type="text"
                        className="form-control"
                        placeholder="Name of  subject"
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
                        placeholder="பதவியின் பெயர்"
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

                    <div>
                      <button type="submit" className="btn btn-primary w-md">
                        Add
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col xl={8}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">Edit | Delete Subject </CardTitle>
                  <div className="table-responsive">
                    <TableContainer
                      columns={columns}
                      data={subjectList}
                      isGlobalFilter={true}
                      customPageSize={10}
                      className=""
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

Subject.propTypes = {
  // Define prop types if needed
}

export default Subject
