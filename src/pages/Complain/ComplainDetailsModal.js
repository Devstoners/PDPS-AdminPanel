import React, {useState} from "react"
import PropTypes from "prop-types"
import {
  Button, FormFeedback, Input, Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap"
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";

const ComplainDetailsModal = props => {
  const { isOpen, toggle } = props
  const [photoIndex, setphotoIndex] = useState(0);
  const [isGallery, setisGallery] = useState(false);
  const images = [img1, img2, img3, img4, img5, img6];
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
        <ModalHeader toggle={toggle}> {"{Complain - Topic & Date}"} </ModalHeader> {/* From the DB */}
        <ModalBody>
          <div className="mb-3">
            <Label
                htmlFor="description"
                className="col-form-label col-lg-2"
            >
              Description
            </Label>
            <Input
                id="description"
                name="description"
                type="textarea"
                rows = {4}
                className="form-control"
                disabled={true}
                //value={validation.values.description || ""}
            />
          </div>

          <div className="popup-gallery d-flex flex-wrap mb-3">
            {isGallery ? (
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    enableZoom={true}
                    onCloseRequest={() => {
                      setisGallery(false);
                    }}
                    onMovePrevRequest={() => {
                      setphotoIndex((photoIndex + images.length - 1) % images.length);
                    }}
                    onMoveNextRequest={() => {
                      setphotoIndex((photoIndex + 1) % images.length);
                    }}
                    imageCaption={"Project " + parseFloat(photoIndex + 1)}
                />
            ) : null}

            <div className="img-fluid float-left">
              <img
                  src={img1}
                  onClick={() => {
                    setisGallery(true);
                    setphotoIndex(0);
                  }}
                  alt=""
                  width="120"
              />
            </div>
            <div className="img-fluid float-left">
              <img
                  src={img2}
                  onClick={() => {
                    setisGallery(true);
                    setphotoIndex(1);
                  }}
                  alt=""
                  width="120"
              />
            </div>
          </div>

          <div className="mb-3">
            <Label className="form-label">Status</Label>
            <Input
                id="description"
                name="description"
                type="text"
                className="form-control"
                disabled={true}
                //value={validation.values.description || ""}
            />

          </div>

          <div className="mb-3">
            <Label
                htmlFor="action"
                className="col-form-label col-lg-2"
            >
              {"{Action(s) with Dates}"}
            </Label>
            <Input
                id="action"
                name="action"
                type="textarea"
                rows = {5}
                className="form-control"
                disabled={true}
                //value={validation.values.action || ""}
            />
          </div>

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
}

export default ComplainDetailsModal
