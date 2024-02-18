import React, { useEffect, useState, useMemo } from "react"
import { useFormik } from "formik"
import PropTypes from "prop-types"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import DeleteModal from "../../../components/Common/DeleteModal"
import EditDivisionModal from "./EditDivisionModal"
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
import memberService from "../../../services/MemberService"

const Division = () => {
  const [divisionList, setDivisionList] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const [editedDivision, setEditedDivision] = useState({})
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [editDivisionModal, setEditDivisionModal] = useState(false)

  //Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  //View data in the table
  const fetchData = async () => {
    try {
      const fetchedData = await memberService.getDivision()
      const allDivisionArray = fetchedData.AllDivisions || []
      const mappedData = allDivisionArray.map((item, index) => ({
        displayId: allDivisionArray.length - index,
        id: item.id,
        divisionEn: item.division_en,
        divisionSi: item.division_si,
        divisionTa: item.division_ta,
      }))
      setDivisionList(mappedData)
    } catch (error) {
      console.error("Error fetching party:", error)
    }
  }

  //Add division
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      divisionEn: "",
      divisionSi: "",
      divisionTa: "",
    },
    validationSchema: Yup.object({
      divisionEn: Yup.string().required(
        "Please Enter Division Name in English"
      ),
      divisionSi: Yup.string().required(
        "Please Enter Division Name in Sinhala"
      ),
      divisionTa: Yup.string().required("Please Enter Division Name in Tamil"),
    }),
    onSubmit: async values => {
      try {
        await memberService.addDivision(values)
        await Swal.fire("Division Added Successfully!", "", "success")
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
      } catch (error) {
        console.error("Error", error)
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
        Header: "Division",
        accessor: "divisionEn",
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
  const onClickDelete = division => {
    setEditedDivision(division)
    setDeleteModal(true)
  }

  const handleDeleteDivision = async () => {
    try {
      await memberService.deleteDivision(editedDivision.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting division:", error)
    }
  }

  const toggle = () => {
    setModal(!modal)
  }
  //Edit
  const onClickEdit = division => {
    setEditedDivision(division)
    setEditDivisionModal(true)
  }

  const onUpdateSuccess = () => {
    setRefreshTable(prevRefresh => !prevRefresh);
  };

  const handleEditDivision = arg => {
    setEditedDivision({
      id: arg.id,
      divisionEn: arg.divisionEn,
      divisionSi: arg.divisionSi,
      divisionTa: arg.divisionTa,
    })
    validation.setValues({
      divisionEn: arg.divisionEn || "",
      divisionSi: arg.divisionSi || "",
      divisionTa: arg.divisionTa || "",
    })
    toggle()
  }



  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(false)}
        onDeleteClick={handleDeleteDivision}
      />
      <EditDivisionModal
        show={editDivisionModal}
        onCloseClick={() => setEditDivisionModal(false)}
        onClickEdit={handleEditDivision}
        division={editedDivision} // Pass the editedDivision state as division prop
        onUpdateSuccess={onUpdateSuccess}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Member" breadcrumbItem="Division" />
          <Row>
            <Col xl={4}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Add Division</CardTitle>
                  <Form onSubmit={validation.handleSubmit}>
                    <div className="mb-3">
                      <Label
                        htmlFor="divname"
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
                  <CardTitle className="h4">Edit | Delete Division </CardTitle>
                  <div className="table-responsive">
                    <TableContainer
                      columns={columns}
                      data={divisionList}
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

Division.propTypes = {
  // Define prop types if needed
}

export default Division
