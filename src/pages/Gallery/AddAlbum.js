import React, { useEffect, useState, useMemo } from "react"
import { withRouter, Link } from "react-router-dom"
import { isEmpty } from "lodash"
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
import TableContainer from "../../components/Common/TableContainer"
import DeleteModal from "components/Common/DeleteModal"
import Swal from "sweetalert2"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Dropzone from "react-dropzone"
import galleryService from "../../services/GalleryService"

const Gallery = props => {
  document.title = "Admin | PDPS"

  // State variables
  const [galleryList, setGalleryList] = useState([])
  const [gallery, setGallery] = useState(null)
  const [refreshTable, setRefreshTable] = useState(false)
  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])

  const fetchData = async () => {
    try {
      const fetchedData = await galleryService.getGallery();
      const allGalleryArray = fetchedData.AllGalleries || [];
      console.log("all data : ", allGalleryArray);

      // Map over each item in allGalleryArray and extract images property
      const mappedData = allGalleryArray.map((item, index) => {
        // Extract images property from the item
        const images = item.images || [];
        return {
          displayId: allGalleryArray.length - index,
          id: item.id,
          topicEn: item.topic_en,
          topicSi: item.topic_si,
          topicTa: item.topic_ta,
          Date: item.created_at,
          images: images // Assign the extracted images property
        };
      });

      setGalleryList(mappedData);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    }
  };


  // Refresh the table
  useEffect(() => {
    fetchData()
  }, [refreshTable])

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (gallery && gallery.id) || "",
      topicEn: (gallery && gallery.topicEn) || "",
      topicSi: (gallery && gallery.topicSi) || "",
      topicTa: (gallery && gallery.topicTa) || "",
      albumimages: [],
    },
    validationSchema: Yup.object({
      topicEn: Yup.string().required("Please Enter topic in English"),
      topicSi: Yup.string().required("Please Enter topic in Sinhala"),
      topicTa: Yup.string().required("Please Enter topic in Tamil"),
      albumimages: Yup.array()
        .min(1, "Please upload at least one image")
        .nullable()
        .test("fileType", "Please upload only image files", value =>
          value.every(file => file.type.includes("image/"))
        ),
    }),
    onSubmit: handleSubmit,
  })

  // Submit handler
  async function handleSubmit(values) {
    try {
      const formData = new FormData()
      formData.append("topicEn", values.topicEn)
      formData.append("topicSi", values.topicSi)
      formData.append("topicTa", values.topicTa)
      values.albumimages.forEach((file, index) => {
        formData.append(`image_${index}`, file)
      })

      let result
      if (isEdit) {
        formData.append("id", values.id)
        formData.append("_method", "PUT")
        result = await galleryService.editGallery(formData)
      } else {
        result = await galleryService.addGallery(formData)
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
            ? "Gallery Edited Successfully!"
            : "Gallery Added Successfully!",
          "",
          "success"
        )
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
      }
    } catch (error) {
      Swal.fire(
        "Error",
        `An error occurred while ${isEdit ? "editing" : "adding"} gallery`,
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
  const handleUserClick = arg => {
    const galleryData = arg;
    // Check if galleryData.images exists before accessing it
    const existingImages = galleryData.images?.map(image => ({
      name: image.image_path.split('/').pop(), // Extracting file name from URL
      size: 0, // Assuming file size as 0 for existing images
      preview: image.image_path // Setting preview URL
    })) || [];
    console.log(existingImages);
    setGallery({
      id: galleryData.id,
      topicEn: galleryData.topicEn,
      topicSi: galleryData.topicSi,
      topicTa: galleryData.topicTa,
      albumimages: existingImages // Set existing images
    });
    setIsEdit(true);
    toggle();
  };





  // Delete gallery
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = gallery => {
    setGallery(gallery)
    setDeleteModal(true)
  }

  const handleDeleteGallery = async () => {
    try {
      await galleryService.deleteGallery(gallery.id)
      setDeleteModal(false)
      setRefreshTable(prevRefresh => !prevRefresh)
    } catch (error) {
      console.error("Error deleting gallery:", error)
    }
  }

  // Add new gallery
  const handleAddNewClick = () => {
    setModal(true)
    setGallery(null)
    setIsEdit(false)
    validation.resetForm()
    setSelectedFiles([])
  }

  // Columns configuration
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "displayId", disableFilters: true },
      { Header: "Gallery", accessor: "topicEn", disableFilters: true },
      { Header: "Date", accessor: "Date", disableFilters: true },
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

  // Define the formatBytes function
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteGallery}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs breadcrumbItem="Gallery" />
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
                    data={galleryList}
                    isGlobalFilter={true}
                    customPageSize={10}
                    className=""
                  />
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!gallery ? "Edit Gallery" : "Add Gallery"}
                    </ModalHeader>
                    <ModalBody>
                      <Form
                        onSubmit={validation.handleSubmit}
                        encType="multipart/form-data"
                      >
                        {/* Album Title - English */}
                        <Row form>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label htmlFor="topicEn">
                                {" "}
                                Album Title - English{" "}
                              </Label>
                              <Input
                                id="topicEn"
                                name="topicEn"
                                type="text"
                                className="form-control"
                                placeholder="Add Album Title"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.topicEn || ""}
                                invalid={
                                  validation.touched.topicEn &&
                                  validation.errors.topicEn
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.topicEn &&
                              validation.errors.topicEn ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.topicEn}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/* Album Title - Sinhala */}
                            <div className="mb-3">
                              <Label htmlFor="topicSi">
                                {" "}
                                Album Title - Sinhala{" "}
                              </Label>
                              <Input
                                id="topicSi"
                                name="topicSi"
                                type="text"
                                className="form-control"
                                placeholder="ඇල්බමයෙ මාතෘකාව ඇතුලත් කරන්න"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.topicSi || ""}
                                invalid={
                                  validation.touched.topicSi &&
                                  validation.errors.topicSi
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.topicSi &&
                              validation.errors.topicSi ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.topicSi}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/* Album Title - Tamil */}
                            <div className="mb-3">
                              <Label htmlFor="topicTa">
                                {" "}
                                Album Title - Tamil{" "}
                              </Label>
                              <Input
                                id="topicTa"
                                name="topicTa"
                                type="text"
                                className="form-control"
                                placeholder="ஆல்பத்தின் தலைப்பைச் சேர்க்கவும்"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.topicTa || ""}
                                invalid={
                                  validation.touched.topicTa &&
                                  validation.errors.topicTa
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.topicTa &&
                              validation.errors.topicTa ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.topicTa}
                                </FormFeedback>
                              ) : null}
                            </div>

                            {/* Album Images */}
                            <div className="mb-3">
                              <Label htmlFor="albumimages">Album Images</Label>
                              <Dropzone
                                onDrop={acceptedFiles => {
                                  console.log("Accepted files:", acceptedFiles);
                                  validation.setFieldValue(
                                    "albumimages",
                                    acceptedFiles
                                  )
                                }}
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div className="dropzone" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <div className="dz-message needsclick">
                                      <div className="mb-3">
                                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                                      </div>
                                      <h4>
                                        Drop images here or click to upload.
                                      </h4>
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                              {validation.touched.albumimages &&
                                validation.errors.albumimages && (
                                  <div className="text-danger">
                                    {validation.errors.albumimages}
                                  </div>
                                )}
                            </div>

                            {/* Preview of uploaded images */}
                            <div className="dropzone-previews mt-3" id="file-previews">
                              {Array.isArray(validation.values.albumimages) ?
                                validation.values.albumimages.map((f, i) => (
                                  <Card
                                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                    key={i + "-file"}
                                  >
                                    <div className="p-2">
                                      <Row className="align-items-center">
                                        <Col className="col-auto">
                                          <img
                                            data-dz-thumbnail=""
                                            height="80"
                                            className="avatar-sm rounded bg-light"
                                            alt={f.name}
                                            src={URL.createObjectURL(f)}
                                          />
                                        </Col>
                                        <Col>
                                          <Link to="#" className="text-muted font-weight-bold">
                                            {f.name}
                                          </Link>
                                          <p className="mb-0">
                                            <strong>{formatBytes(f.size)}</strong>
                                          </p>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Card>
                                ))
                                :
                                <Card
                                  className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                >
                                  <div className="p-2">
                                    <Row className="align-items-center">
                                      <Col className="col-auto">
                                        <img
                                          data-dz-thumbnail=""
                                          height="80"
                                          className="avatar-sm rounded bg-light"
                                          alt={validation.values.albumimages.split('/').pop()}
                                          src={validation.values.albumimages}
                                        />
                                      </Col>
                                      <Col>
                                        <Link to="#" className="text-muted font-weight-bold">
                                          {validation.values.albumimages.split('/').pop()}
                                        </Link>
                                        <p className="mb-0">
                                          <strong>{formatBytes(0)}</strong>
                                        </p>
                                      </Col>
                                    </Row>
                                  </div>
                                </Card>
                              }
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

export default withRouter(Gallery)
