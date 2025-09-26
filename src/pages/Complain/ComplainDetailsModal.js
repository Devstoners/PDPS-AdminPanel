import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  Button, Input, Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap"
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const ComplainDetailsModal = props => {
  const { isOpen, toggle, complaint } = props
  const [photoIndex, setphotoIndex] = useState(0);
  const [isGallery, setisGallery] = useState(false);
  
  // Create images array from img1, img2, img3 fields, filtering out null/undefined values
  const images = [complaint?.img1, complaint?.img2, complaint?.img3]
    .filter(img => img && img.trim() !== '')
    .map(img => `http://127.0.0.1:8000/storage/${img}`);
  
  console.log("Complaint data:", complaint);
  console.log("Complaint images:", images);

  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className="exampleModal"
      tabIndex="-1"
      toggle={toggle}
      scrollable={true}
      size="xl"
    >
      <div className="modal-content">
        <ModalHeader toggle={toggle}>Complaint Details - {complaint?.cdate} - {complaint?.ctime}</ModalHeader>
        <ModalBody>
          {/* Complain field - moved to top */}
          <div className="mb-3">
            <Label htmlFor="complain" className="col-form-label col-lg-2">
              Complain
            </Label>
            <Input
              id="complain"
              name="complain"
              type="textarea"
              rows={4}
              value={complaint?.complainText || ""}
              readOnly
            />
          </div>

          {/* Name field - optional */}
          {complaint?.cname && (
            <div className="mb-3">
              <Label htmlFor="cname" className="col-form-label col-lg-2">
                Name
              </Label>
              <Input
                id="cname"
                name="cname"
                value={complaint?.cname || ""}
                readOnly
              />
            </div>
          )}

          {/* Telephone field - optional */}
          {complaint?.tel && (
            <div className="mb-3">
              <Label htmlFor="tel" className="col-form-label col-lg-2">
                Telephone
              </Label>
              <Input
                id="tel"
                name="tel"
                value={complaint?.tel || ""}
                readOnly
              />
            </div>
          )}

          {/* Images section - only show if there are images */}
          {images.length > 0 && (
            <div className="mb-3">
              <Label className="form-label">Images</Label>
              <div className="popup-gallery d-flex flex-wrap">
                {isGallery && images.length > 0 && (
                  <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    enableZoom={true}
                    onCloseRequest={() => setisGallery(false)}
                    onMovePrevRequest={() => {
                      setphotoIndex((photoIndex + images.length - 1) % images.length);
                    }}
                    onMoveNextRequest={() => {
                      setphotoIndex((photoIndex + 1) % images.length);
                    }}
                    imageCaption={`Image ${photoIndex + 1} of ${images.length}`}
                  />
                )}

                {images.map((image, index) => (
                  <div className="img-fluid float-left" key={index}>
                    <img
                      src={image}
                      onClick={() => {
                        setisGallery(true);
                        setphotoIndex(index);
                      }}
                      alt={`Complaint ${index + 1}`}
                      width="120"
                      style={{ marginRight: '10px', marginBottom: '10px', cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            <Label htmlFor="action" className="col-form-label col-lg-2">
              Action
            </Label>
            <Input
              id="action"
              name="action"
              type="textarea"
              rows={5}
              className="form-control"
              style={{ borderColor: 'red' }}
              value={complaint?.action || "No action taken yet"}
              readOnly
            />
          </div>

          {/* Action Date & Time field - only show if action exists */}
          {complaint?.actionCreatedAt && (
            <div className="mb-3">
              <Label htmlFor="actionDateTime" className="col-form-label col-lg-2">
                Action Date & Time
              </Label>
              <Input
                id="actionDateTime"
                name="actionDateTime"
                value={new Date(complaint.actionCreatedAt).toLocaleString()}
                readOnly
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  )
}

ComplainDetailsModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  complaint: PropTypes.shape({
    cname: PropTypes.string,
    tel: PropTypes.string,
    complainText: PropTypes.string,
    cdate: PropTypes.string,
    ctime: PropTypes.string,
    action: PropTypes.string,
    actionCreatedAt: PropTypes.string,
    img1: PropTypes.string,
    img2: PropTypes.string,
    img3: PropTypes.string
  })
}

export default ComplainDetailsModal