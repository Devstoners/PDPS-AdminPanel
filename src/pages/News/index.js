import React, { useEffect, useState, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
import TableContainer from "../../components/Common/TableContainer"
import Select from "react-select"
import Swal from "sweetalert2"
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
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import Breadcrumbs from "components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"
import { useSelector, useDispatch } from "react-redux"
import newsService from "../../services/NewsService"

const News = props => {
  document.title = "Admin | PDPS"

  const dispatch = useDispatch()
  const [newsList, setNewsList] = useState([])
  const [editedNews, setEditedNews] = useState({})
  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [refreshTable, setRefreshTable] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await newsService.getNews()
        const allNewsArray = fetchedData.AllNews || []
        const mappedData = allNewsArray.map((item, index) => ({
        // const mappedData = allNewsArray.map(item => ({
          displayId:  allNewsArray.length - index,
          id: item.id,
          newsEnglish: item.news_en,
          newsSinhala: item.news_si,
          newsTamil: item.news_ta,
          // visibility: item.visibility === 1 ? "Yes" : "No",
          priority: item.priority !== null ? item.priority : null,
        }))
        setNewsList(mappedData)
      } catch (error) {
        console.error("Error fetching news:", error)
      }
    }
    fetchData()
  }, [refreshTable])

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      newsEnglish: "",
      newsSinhala: "",
      newsTamil: "",
      // visibility: "No",
      priority: null,
    },
    validationSchema: Yup.object({
      newsEnglish: Yup.string().required("Please Enter News in English"),
      newsSinhala: Yup.string().required("Please Enter News in Sinhala"),
      newsTamil: Yup.string().required("Please Enter News in Tamil"),
    }),
    onSubmit: async values => {
      try {
        const updateNews = {
          id: editedNews.id,
          newsEnglish: values.newsEnglish,
          newsSinhala: values.newsSinhala,
          newsTamil: values.newsTamil,
          // visibility: values.visibility === "Yes" ? 1 : 0,
          priority: values.priority,
        }
        await newsService.editNews(updateNews)
        // dispatch(onUpdateNews(updateNews))
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "News updated successfully!",
        })
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
        setModal(false)
      } catch (error) {
        console.error("Error editing news : ", error)
      }
    },
  })

  useEffect(() => {
    validation.setValues({
      newsEnglish: editedNews.newsEnglish || "",
      newsSinhala: editedNews.newsSinhala || "",
      newsTamil: editedNews.newsTamil || "",
      // visibility: editedNews.visibility === 1 ? "Yes" : "No",
      priority: editedNews.priority || null,
    })
  }, [editedNews])

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "displayId",
        disableFilters: true,
      },
      {
        Header: "News",
        accessor: "newsEnglish",
        disableFilters: true,
      },
      // {
      //   Header: "Visibility",
      //   accessor: "visibility",
      //   disableFilters: true,
      // },
      {
        Header: "Priority",
        accessor: "priority",
        disableFilters: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => handleNewsClick(cellProps.row.original)}
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
          )
        },
      },
    ],
    []
  )

  const toggle = () => {
    setModal(!modal)
  }

  const handleNewsClick = arg => {
    setEditedNews({
      id: arg.id,
      newsEnglish: arg.newsEnglish,
      newsSinhala: arg.newsSinhala,
      newsTamil: arg.newsTamil,
      // visibility: arg.visibility,
      priority: arg.priority,
    })
    validation.setValues({
      newsEnglish: arg.newsEnglish || "",
      newsSinhala: arg.newsSinhala || "",
      newsTamil: arg.newsTamil || "",
      // visibility: arg.visibility === "Yes" ? "Yes" : "No",
      priority: arg.priority !== null ? arg.priority.toString() : null,
    })
    toggle()
  }

  const onClickDelete = news => {
    setEditedNews(news)
    setDeleteModal(true)
  }

  const handleDeleteNews = async () => {
    try {
      const newsToDelete = newsList.find(item => item.id === editedNews.id)
      await newsService.deleteNews(newsToDelete.id)
      const updatedNewsList = newsList.filter(
        item => item.id !== newsToDelete.id
      )
      setNewsList(updatedNewsList)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting news:", error)
    }
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteNews}
        onCloseClick={() => setDeleteModal(false)}
      />

      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="News" breadcrumbItem="News" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={newsList}
                    isGlobalFilter={true}
                    handleNewsClick={handleNewsClick}
                    customPageSize={10}
                    className=""
                  />
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader tag="h4">Edit News</ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={e => {
                          e.preventDefault()
                          validation.handleSubmit()
                        }}
                      >
                        <Row form>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label
                                htmlFor="newsEnglish"
                                className="col-form-label col-lg-2"
                              >
                                English
                              </Label>
                              <Input
                                id="newsEnglish"
                                name="newsEnglish"
                                type="textarea"
                                className="form-control"
                                placeholder="Enter News..."
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.newsEnglish || ""}
                                invalid={
                                  validation.touched.newsEnglish &&
                                  validation.errors.newsEnglish
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.newsEnglish &&
                              validation.errors.newsEnglish ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.newsEnglish}
                                </FormFeedback>
                              ) : null}
                            </div>

                            <div className="mb-3">
                              <Label
                                htmlFor="newsSinhala"
                                className="col-form-label col-lg-2"
                              >
                                Sinhala
                              </Label>

                              <Input
                                id="newsSinhala"
                                name="newsSinhala"
                                type="textarea"
                                className="form-control"
                                placeholder="පුවත ඇතුලත් කරන්න..."
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.newsSinhala || ""}
                                invalid={
                                  validation.touched.newsSinhala &&
                                  validation.errors.newsSinhala
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.newsSinhala &&
                              validation.errors.newsSinhala ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.newsSinhala}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label
                                htmlFor="newsTamil"
                                className="col-form-label col-lg-2"
                              >
                                Tamil
                              </Label>

                              <Input
                                id="newsTamil"
                                name="newsTamil"
                                type="textarea"
                                className="form-control"
                                placeholder="செய்திகளை உள்ளிடவும்..."
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.newsTamil || ""}
                                invalid={
                                  validation.touched.newsTamil &&
                                  validation.errors.newsTamil
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.newsTamil &&
                              validation.errors.newsTamil ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.newsTamil}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/*<div className="mb-3">*/}
                            {/*  <Label*/}
                            {/*    htmlFor="visibility"*/}
                            {/*    className="col-form-label col-lg-2"*/}
                            {/*  >*/}
                            {/*    Visibility*/}
                            {/*  </Label>*/}
                            {/*  <Select*/}
                            {/*    name="visibility"*/}
                            {/*    isMulti={false}*/}
                            {/*    onChange={selectedOption =>*/}
                            {/*      validation.setFieldValue(*/}
                            {/*        "visibility",*/}
                            {/*        selectedOption.value*/}
                            {/*      )*/}
                            {/*    }*/}
                            {/*    className="select2-selection"*/}
                            {/*    options={[*/}
                            {/*      { label: "Yes", value: "Yes" },*/}
                            {/*      { label: "No", value: "No" },*/}
                            {/*    ]}*/}
                            {/*    onBlur={validation.handleBlur}*/}
                            {/*    defaultValue={{*/}
                            {/*      label: validation.values.visibility,*/}
                            {/*      value: validation.values.visibility,*/}
                            {/*    }}*/}
                            {/*    invalid={*/}
                            {/*      validation.touched.visibility &&*/}
                            {/*      validation.errors.visibility*/}
                            {/*        ? true*/}
                            {/*        : false*/}
                            {/*    }*/}
                            {/*  />*/}
                            {/*  {validation.touched.visibility &&*/}
                            {/*  validation.errors.visibility ? (*/}
                            {/*    <FormFeedback type="invalid">*/}
                            {/*      {validation.errors.visibility}*/}
                            {/*    </FormFeedback>*/}
                            {/*  ) : null}*/}
                            {/*</div>*/}

                            <div className="mb-3">
                              <Label
                                htmlFor="priority"
                                className="col-form-label col-lg-2"
                              >
                                Priority
                              </Label>
                              <Select
                                name="priority"
                                isMulti={false}
                                onChange={selectedOption =>
                                  validation.setFieldValue(
                                    "priority",
                                    selectedOption.value
                                  )
                                }
                                className="select2-selection"
                                options={[
                                  { label: "1", value: 1 },
                                  { label: "2", value: 2 },
                                  { label: "3", value: 3 },
                                ]}
                                onBlur={validation.handleBlur}
                                defaultValue={{
                                  label: validation.values.priority,
                                  value: validation.values.priority,
                                }}
                                invalid={
                                  validation.touched.priority &&
                                  validation.errors.priority
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.priority &&
                              validation.errors.priority ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.priority}
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(News)
