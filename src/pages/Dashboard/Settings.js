import React, {useEffect, useState} from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Row,
  DropdownItem,
} from "reactstrap"

import avatar from "../../assets/images/users/avatar-1.jpg"
import complainService from "../../services/ComplainService";



const Settings = props => {
  const [complainCount, setComplainCount] = useState(0);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const fetchData = async () => {
      try {
        const data = await complainService.getCount()
        const complainCount = data.count;

        // Check if the component is still mounted before updating state
        if (isMounted) {
          setComplainCount(complainCount);
        }
      } catch (error) {
        console.error("Error fetching news count:", error);

        // Handle the error, e.g., set a default value for visibleNewsCount
        if (isMounted) {
          setComplainCount("0");
        }
      }
    };

    fetchData(); // Invoke the fetchData function

    // Cleanup function to update the mounted status
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <React.Fragment>
      <Col xl={4}>
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap align-items-start">
              <h5 className="card-title mb-3 me-2">Complains</h5>

              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle tag="a" className="text-muted font-size-16" role="button">
                  <i className="mdi mdi-dots-horizontal"></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem className="dropdown-item" href="#">Action</DropdownItem>
                  <DropdownItem className="dropdown-item" href="#">Another action</DropdownItem>
                  <DropdownItem className="dropdown-item" href="#">Something else here</DropdownItem>
                  <div className="dropdown-divider"></div>
                  <DropdownItem className="dropdown-item" href="#">Separated link</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <div className="d-flex flex-wrap">
              <div>
                <p className="text-muted mb-1">Total Complains</p>
                <h4 className="mb-3">{complainCount}</h4>
              </div>
              <div className="ms-auto align-self-end">
                <i className="bx bx-angry display-4 text-light"></i>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="d-flex flex-wrap align-items-start">
              <h5 className="card-title mb-3 me-2">User : Officers</h5>

              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle tag="a" className="text-muted font-size-16" role="button">
                  <i className="mdi mdi-dots-horizontal"></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem className="dropdown-item" href="#">Action</DropdownItem>
                  <DropdownItem className="dropdown-item" href="#">Another action</DropdownItem>
                  <DropdownItem className="dropdown-item" href="#">Something else here</DropdownItem>
                  <div className="dropdown-divider"></div>
                  <DropdownItem className="dropdown-item" href="#">Separated link</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <div className="d-flex flex-wrap">
              <div>
                <p className="text-muted mb-1">Total Officers</p>
                <h4 className="mb-3">43</h4>
              </div>
              <div className="ms-auto align-self-end">
                <i className="bx bx-group display-4 text-light"></i>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="d-flex flex-wrap align-items-start">
              <h5 className="card-title mb-3 me-2">User : Member</h5>

              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle tag="a" className="text-muted font-size-16" role="button">
                  <i className="mdi mdi-dots-horizontal"></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem className="dropdown-item" href="#">Action</DropdownItem>
                  <DropdownItem className="dropdown-item" href="#">Another action</DropdownItem>
                  <DropdownItem className="dropdown-item" href="#">Something else here</DropdownItem>
                  <div className="dropdown-divider"></div>
                  <DropdownItem className="dropdown-item" href="#">Separated link</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <div className="d-flex flex-wrap">
              <div>
                <p className="text-muted mb-1">Total Members</p>
                <h4 className="mb-3">60</h4>
              </div>
              <div className="ms-auto align-self-end">
                <i className="bx bx-group display-4 text-light"></i>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="d-flex flex-wrap align-items-start">
              <h5 className="card-title mb-3 me-2">User : Gramaniladari</h5>

              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle tag="a" className="text-muted font-size-16" role="button">
                  <i className="mdi mdi-dots-horizontal"></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem className="dropdown-item" href="#">Action</DropdownItem>
                  <DropdownItem className="dropdown-item" href="#">Another action</DropdownItem>
                  <DropdownItem className="dropdown-item" href="#">Something else here</DropdownItem>
                  <div className="dropdown-divider"></div>
                  <DropdownItem className="dropdown-item" href="#">Separated link</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <div className="d-flex flex-wrap">
              <div>
                <p className="text-muted mb-1">Total Gramaniladari</p>
                <h4 className="mb-3">54</h4>
              </div>
              <div className="ms-auto align-self-end">
                <i className="bx bx-group display-4 text-light"></i>
              </div>
            </div>
          </CardBody>
        </Card>

      </Col>
    </React.Fragment>
  )
}

export default Settings
