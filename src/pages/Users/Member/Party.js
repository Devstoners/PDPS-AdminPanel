import React, { useEffect, useState, useMemo } from "react"
import { useFormik } from "formik"
import PropTypes from "prop-types"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import DeleteModal from "../../../components/Common/DeleteModal"
import EditPartyModal from "./EditPartyModal"
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

const Party = () => {
  const [partyList, setPartyList] = useState([])
  const [refreshTable, setRefreshTable] = useState(false)
  const [party, setParty] = useState({})
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [editPartyModal, setEditPartyModal] = useState(false)

  //Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  //View data in the table
  const fetchData = async () => {
    try {
      const fetchedData = await memberService.getParty()
      const allPartyArray = fetchedData.AllParties || []
      const mappedData = allPartyArray.map((item, index) => ({
        displayId: allPartyArray.length - index,
        id: item.id,
        partyEn: item.party_en,
        partySi: item.party_si,
        partyTa: item.party_ta,
      }))
      setPartyList(mappedData)
    } catch (error) {
      console.error("Error fetching party:", error)
    }
  }

  //Add party
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      partyEn: "",
      partySi: "",
      partyTa: "",
    },
    validationSchema: Yup.object({
      partyEn: Yup.string().required(
        "Please Enter Party Name in English"
      ),
      partySi: Yup.string().required(
        "Please Enter Party Name in Sinhala"
      ),
      partyTa: Yup.string().required("Please Enter Party Name in Tamil"),
    }),
    onSubmit: async values => {
      try {
        await memberService.addParty(values)
        await Swal.fire("Party Added Successfully!", "", "success")
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
        Header: "Party",
        accessor: "partyEn",
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
  const onClickDelete = party => {
    setParty(party)
    setDeleteModal(true)
  }

  const handleDeleteParty = async () => {
    try {
      await memberService.deleteParty(party.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting party:", error)
    }
  }

  const toggle = () => {
    setModal(!modal)
  }
  //Edit
  const onClickEdit = party => {
    setParty(party)
    setEditPartyModal(true)
  }

  const onUpdateSuccess = () => {
    setRefreshTable(prevRefresh => !prevRefresh);
  };

  const handleEditParty = arg => {
    setParty({
      id: arg.id,
      partyEn: arg.partyEn,
      partySi: arg.partySi,
      partyTa: arg.partyTa,
    })
    validation.setValues({
      partyEn: arg.partyEn || "",
      partySi: arg.partySi || "",
      partyTa: arg.partyTa || "",
    })
    toggle()
  }



  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onCloseClick={() => setDeleteModal(false)}
        onDeleteClick={handleDeleteParty}
      />
      <EditPartyModal
        show={editPartyModal}
        onCloseClick={() => setEditPartyModal(false)}
        onClickEdit={handleEditParty}
        party={party} // Pass the editedDivision state as party prop
        onUpdateSuccess={onUpdateSuccess}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Member" breadcrumbItem="Party" />
          <Row>
            <Col xl={4}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Add Party</CardTitle>
                  <Form onSubmit={validation.handleSubmit}>
                    <div className="mb-3">
                      <Label
                        htmlFor="divname"
                        className="col-form-label col-lg-6"
                      >
                        English
                      </Label>
                      <Input
                        id="partyEn"
                        name="partyEn"
                        type="text"
                        className="form-control"
                        placeholder="Name of  party"
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
                        className="col-form-label col-lg-6"
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
                        className="col-form-label col-lg-6"
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
                  <CardTitle className="h4">Edit | Delete Party </CardTitle>
                  <div className="table-responsive">
                    <TableContainer
                      columns={columns}
                      data={partyList}
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

Party.propTypes = {
  // Define prop types if needed
}

export default Party
