import React, { useEffect, useState, useMemo } from "react"
import { useFormik } from "formik"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import DeleteModal from "../../../components/Common/DeleteModal"
import EditPositionModal from "./EditPositionModal"
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

const Position = () => {
  const [positionList, setPositionList] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const [position, setPosition] = useState({})
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [editPositionModal, setEditPositionModal] = useState(false)

  //Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  //View data in the table
  const fetchData = async () => {
    try {
      const fetchedData = await officerService.getPosition()
      const allPositionArray = fetchedData.AllPositions || []
      const mappedData = allPositionArray.map((item, index) => ({
        displayId: allPositionArray.length - index,
        id: item.id,
        positionEn: item.position_en,
        positionSi: item.position_si,
        positionTa: item.position_ta,
      }))
      setPositionList(mappedData)
    } catch (error) {
      console.error("Error fetching position:", error)
    }
  }

  //Add position
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      positionEn: "",
      positionSi: "",
      positionTa: "",
    },
    validationSchema: Yup.object({
      positionEn: Yup.string().required(
        "Please Enter Position Name in English"
      ),
      positionSi: Yup.string().required(
        "Please Enter Position Name in Sinhala"
      ),
      positionTa: Yup.string().required("Please Enter Position Name in Tamil"),
    }),

    onSubmit: async values => {
      try {
        const { result, errorMessage } = await officerService.addPosition(values);
        if (errorMessage) {
          const formattedErrorMessage = errorMessage.replace(/\n/g, '<br>');
          Swal.fire({
            title: 'Error',
            html: formattedErrorMessage,
            icon: 'error',
            allowOutsideClick: false
          });
        } else {
          await Swal.fire("Position Added Successfully!", "", "success");
          setRefreshTable(prevRefresh => !prevRefresh);
          validation.resetForm();
        }
      } catch (error) {
        Swal.fire('Error', 'An error occurred while adding position', 'error');
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
        Header: "Position",
        accessor: "positionEn",
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
  const onClickDelete = position => {
    setPosition(position)
    setDeleteModal(true)
  }

  const handleDeletePosition = async () => {
    try {
      await officerService.deletePosition(position.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error("Error deleting position:", error.response.data.error);
      } else {
        // If the error structure is different or if there's no response message
        console.error("Error deleting position:", error);
      }
    }
  }

  const toggle = () => {
    setModal(!modal)
  }
  //Edit
  const onClickEdit = position => {
    setPosition(position)
    setEditPositionModal(true)
  }

  const onUpdateSuccess = () => {
    setRefreshTable(prevRefresh => !prevRefresh);
  };

  const handleEditPosition = arg => {
    setPosition({
      id: arg.id,
      positionEn: arg.positionEn,
      positionSi: arg.positionSi,
      positionTa: arg.positionTa,
    })
    validation.setValues({
      positionEn: arg.positionEn || "",
      positionSi: arg.positionSi || "",
      positionTa: arg.positionTa || "",
    })
    toggle()
  }



  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(false)}
        onDeleteClick={handleDeletePosition}
      />
      <EditPositionModal
        show={editPositionModal}
        onCloseClick={() => setEditPositionModal(false)}
        onClickEdit={handleEditPosition}
        position={position} // Pass the editedDivision state as position prop
        onUpdateSuccess={onUpdateSuccess}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Officer" breadcrumbItem="Position" />
          <Row>
            <Col xl={4}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Add Position</CardTitle>
                  <Form onSubmit={validation.handleSubmit}>
                    <div className="mb-3">
                      <Label
                        htmlFor="divname"
                        className="col-form-label col-lg-6"
                      >
                        English
                      </Label>
                      <Input
                        id="positionEn"
                        name="positionEn"
                        type="text"
                        className="form-control"
                        placeholder="Name of  position"
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
                        placeholder="பதவியின் பெயர்"
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
                  <CardTitle className="h4">Edit | Delete Position </CardTitle>
                  <div className="table-responsive">
                    <TableContainer
                      columns={columns}
                      data={positionList}
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

Position.propTypes = {
  // Define prop types if needed
}

export default Position
