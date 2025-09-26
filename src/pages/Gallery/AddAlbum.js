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
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])

  const fetchData = async () => {
    try {
      const fetchedData = await galleryService.getGallery();
      const allGalleryArray = fetchedData.AllGalleries || [];
      console.log("all data : ", allGalleryArray);

      // Map over each item in allGalleryArray and extract images property
      const mappedData = allGalleryArray.map((item, index) => {
        // Extract images property from the item
        const images = item.images || [];
        
        // Format dates
        const createdDate = new Date(item.created_at);
        const updatedDate = new Date(item.updated_at);
        
        // Check if created and updated dates are the same (within 5 minutes tolerance)
        const timeDiff = Math.abs(updatedDate.getTime() - createdDate.getTime());
        const isSameDate = timeDiff < 300000; // Less than 5 minutes difference
        
        return {
          displayId: allGalleryArray.length - index,
          id: item.id,
          topicEn: item.topic_en,
          topicSi: item.topic_si,
          topicTa: item.topic_ta,
          Date: createdDate.toLocaleDateString(),
          EditAt: isSameDate ? "" : updatedDate.toLocaleDateString(),
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
        .nullable()
        .test("fileType", "Please upload only image files", value =>
          value && value.length > 0 ? value.every(file => file.type.includes("image/")) : true
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
      
      // Handle existing images (for edit mode)
      if (isEdit) {
        // Send existing images with their order
        formData.append("existing_images", JSON.stringify(existingImages.map((img, index) => ({
          id: img.id,
          image_path: img.image_path,
          order: index
        }))))
        
        // Send deleted images (images that were in original data but not in current state)
        const originalImageIds = gallery?.images?.map(img => img.id) || [];
        const currentImageIds = existingImages.map(img => img.id);
        const deletedImageIds = originalImageIds.filter(id => !currentImageIds.includes(id));
        if (deletedImageIds.length > 0) {
          formData.append("deleted_images", JSON.stringify(deletedImageIds));
        }
        
        // Check if images were modified (deleted, reordered, or new images added)
        const originalImageOrder = gallery?.images?.map(img => img.id) || [];
        const currentImageOrder = existingImages.map(img => img.id);
        const hasImageChanges = deletedImageIds.length > 0 || 
                               newImages.length > 0 || 
                               JSON.stringify(originalImageOrder) !== JSON.stringify(currentImageOrder);
        
        if (hasImageChanges) {
          formData.append("images_modified", "true");
          console.log("Images were modified - will update gallery timestamp");
          console.log("Deleted images:", deletedImageIds);
          console.log("New images count:", newImages.length);
          console.log("Original order:", originalImageOrder);
          console.log("Current order:", currentImageOrder);
        }
      }
      
      // Handle new images
      if (newImages.length > 0) {
        newImages.forEach((file, index) => {
          formData.append(`new_image_${index}`, file)
        })
      }

      let result
      if (isEdit) {
        formData.append("id", values.id)
        formData.append("_method", "PUT")
        result = await galleryService.editGallery(formData)
      } else {
        // For new gallery, use the original albumimages
        values.albumimages.forEach((file, index) => {
          formData.append(`image_${index}`, file)
        })
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
        // Refresh the table data to get updated information
        setRefreshTable(prevRefresh => !prevRefresh)
        validation.resetForm()
        // Clear the image states
        setExistingImages([])
        setNewImages([])
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
    const existingImagesData = galleryData.images?.map(image => ({
      id: image.id,
      name: image.image_path.split('/').pop(), // Extracting file name from URL
      size: 0, // Assuming file size as 0 for existing images
      preview: `http://127.0.0.1:8000/storage/${image.image_path}`, // Laravel storage link
      image_path: image.image_path,
      isExisting: true
    })) || [];
    console.log("Gallery data:", galleryData);
    console.log("Gallery images:", galleryData.images);
    console.log("Existing images data:", existingImagesData);
    setGallery({
      id: galleryData.id,
      topicEn: galleryData.topicEn,
      topicSi: galleryData.topicSi,
      topicTa: galleryData.topicTa,
      images: galleryData.images // Store original images for comparison
    });
    setExistingImages(existingImagesData);
    setNewImages([]);
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
    setExistingImages([])
    setNewImages([])
  }

  // Handle delete existing image
  const handleDeleteExistingImage = (imageId) => {
    // For now, just remove from local state
    // The actual deletion will happen when the form is submitted
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    console.log('Image marked for deletion:', imageId);
  };

  // Handle delete new image
  const handleDeleteNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle reorder existing images
  const handleReorderExistingImages = (fromIndex, toIndex) => {
    const newImages = [...existingImages];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    setExistingImages(newImages);
    console.log('Image order changed locally');
  };

  // Handle reorder new images
  const handleReorderNewImages = (fromIndex, toIndex) => {
    const newImagesList = [...newImages];
    const [removed] = newImagesList.splice(fromIndex, 1);
    newImagesList.splice(toIndex, 0, removed);
    setNewImages(newImagesList);
  };

  // Columns configuration
  const columns = useMemo(
    () => [
      { Header: "No", accessor: "displayId", disableFilters: true },
      { Header: "Album", accessor: "topicEn", disableFilters: true },
      { Header: "Uploaded On", accessor: "Date", disableFilters: true },
      { Header: "Edited On", accessor: "EditAt", disableFilters: true },
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
                  <Modal isOpen={modal} toggle={toggle} size="xl" scrollable>
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
                              
                              {/* Existing Images (Edit Mode) */}
                              {isEdit && existingImages.length > 0 && (
                                <div className="mb-4">
                                  <Label className="form-label fw-bold">Existing Images</Label>
                                  
                                  <div className="row g-3">
                                    {existingImages.map((image, index) => (
                                      <div key={image.id} className="col-lg-4 col-md-6">
                                        <Card className="shadow-sm border h-100">
                                          <div className="p-3">
                                            <div className="text-center mb-3">
                                              <img
                                                height="120"
                                                width="120"
                                                className="img-fluid rounded border"
                                                alt={image.name}
                                                src={image.preview}
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                  console.log("Image failed to load:", e.target.src);
                                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik02MCA0NUw1MCA1NUw3MCA1NUw2MCA0NVoiIGZpbGw9IiNEOUQ5RDkiLz4KPHBhdGggZD0iTTQ1IDc1TDU1IDY1TDc1IDg1TDY1IDk1TDQ1IDc1WiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K';
                                                }}
                                              />
                                            </div>
                                            <div className="text-center">
                                              <p className="mb-2 text-muted small text-truncate" title={image.name}>
                                                {image.name}
                                              </p>
                                              <div className="d-flex justify-content-center gap-2">
                                                <Button
                                                  size="sm"
                                                  color="info"
                                                  onClick={() => {
                                                    if (index > 0) {
                                                      handleReorderExistingImages(index, index - 1);
                                                    }
                                                  }}
                                                  disabled={index === 0}
                                                  title="Move Up"
                                                >
                                                  <i className="mdi mdi-arrow-up" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  color="info"
                                                  onClick={() => {
                                                    if (index < existingImages.length - 1) {
                                                      handleReorderExistingImages(index, index + 1);
                                                    }
                                                  }}
                                                  disabled={index === existingImages.length - 1}
                                                  title="Move Down"
                                                >
                                                  <i className="mdi mdi-arrow-down" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  color="danger"
                                                  onClick={() => handleDeleteExistingImage(image.id)}
                                                  title="Delete Image"
                                                >
                                                  <i className="mdi mdi-delete" />
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </Card>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* New Images Dropzone */}
                              <div className="mb-3">
                                <Label className="form-label">
                                  {isEdit ? "Add New Images" : "Upload Images"}
                                </Label>
                              <Dropzone
                                onDrop={acceptedFiles => {
                                  console.log("Accepted files:", acceptedFiles);
                                    if (isEdit) {
                                      setNewImages(prev => [...prev, ...acceptedFiles]);
                                    } else {
                                      validation.setFieldValue("albumimages", acceptedFiles);
                                    }
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
                              {/* New Images Preview (for both add and edit modes) */}
                              {!isEdit && Array.isArray(validation.values.albumimages) &&
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
                              }

                              {/* New Images Preview (for edit mode) */}
                              {isEdit && newImages.length > 0 && (
                                <div className="mb-4">
                                  <Label className="form-label fw-bold">New Images</Label>
                                  <div className="row g-3">
                                    {newImages.map((file, index) => (
                                      <div key={index} className="col-lg-4 col-md-6">
                                        <Card className="shadow-sm border h-100">
                                          <div className="p-3">
                                            <div className="text-center mb-3">
                                              <img
                                                height="120"
                                                width="120"
                                                className="img-fluid rounded border"
                                                alt={file.name}
                                                src={URL.createObjectURL(file)}
                                                style={{ objectFit: 'cover' }}
                                              />
                                            </div>
                                            <div className="text-center">
                                              <p className="mb-1 text-muted small text-truncate" title={file.name}>
                                                {file.name}
                                              </p>
                                              <p className="mb-2 text-muted small">
                                                {formatBytes(file.size)}
                                              </p>
                                              <div className="d-flex justify-content-center gap-2">
                                                <Button
                                                  size="sm"
                                                  color="info"
                                                  onClick={() => {
                                                    if (index > 0) {
                                                      handleReorderNewImages(index, index - 1);
                                                    }
                                                  }}
                                                  disabled={index === 0}
                                                  title="Move Up"
                                                >
                                                  <i className="mdi mdi-arrow-up" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  color="info"
                                                  onClick={() => {
                                                    if (index < newImages.length - 1) {
                                                      handleReorderNewImages(index, index + 1);
                                                    }
                                                  }}
                                                  disabled={index === newImages.length - 1}
                                                  title="Move Down"
                                                >
                                                  <i className="mdi mdi-arrow-down" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  color="danger"
                                                  onClick={() => handleDeleteNewImage(index)}
                                                  title="Delete Image"
                                                >
                                                  <i className="mdi mdi-delete" />
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </Card>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
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
