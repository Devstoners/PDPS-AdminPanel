import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form, CardHeader, CardTitle,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { editProfile, resetProfileFlag } from "../../store/actions";

const UserProfile = () => {

   //meta title
   document.title="PDPS";

  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);

  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }));

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setname(obj.displayName);
        setemail(obj.email);
        setidx(obj.uid);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        setname(obj.username);
        setemail(obj.email);
        setidx(obj.uid);
      }
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, success]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: name || '',
      idx : idx || '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    }
  });


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Settings" breadcrumbItem="Profile" />

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">{email}</p>
                        <p className="mb-0">Id no: #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
          <Col xl={6}>
            <Card>
              <CardBody>
                <CardTitle className="mb-4">Password Reset</CardTitle>
                <Form>
                  <Row className="mb-4">
                    <Label
                        htmlFor="o-password"
                        className="form-label"
                    >
                      Old Password
                    </Label>
                    <Col sm={12}>
                      <Input
                          type="password"
                          className="form-control"
                          id="o-password"
                          placeholder="Enter Your Existing Password"
                      />
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Label
                        htmlFor="n-password"
                        className="form-label"
                    >
                      New Password
                    </Label>
                    <Col sm={12}>
                      <Input
                          type="password"
                          className="form-control"
                          id="n-password"
                          placeholder="Enter New Password"
                      />
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Label
                        htmlFor="cn-password"
                        className="form-label"
                    >
                      Confirm New Password
                    </Label>
                    <Col sm={12}>
                      <Input
                          type="password"
                          className="form-control"
                          id="cn-password"
                          placeholder="Re-Enter Your New Password"
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-end">
                    <Col sm={12}>
                      <div className="text-end mt-4">
                        <Button
                            type="submit"
                            color="primary"
                            className="btn btn-success save-user"
                        >
                          Update
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>


            <Col xl={6}>
            <Card>
            <CardBody>
              <h4 className="card-title mb-4">Change Display Name</h4>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Input
                    name="username"
                    // value={name}
                    className="form-control"
                    placeholder="Enter Display Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.username || ""}
                    invalid={
                      validation.touched.username && validation.errors.username ? true : false
                    }
                  />
                  {validation.touched.username && validation.errors.username ? (
                    <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </div>
                <div className="text-end mt-4">
                  <Button type="submit" className="btn btn-success save-user">
                    Update
                  </Button>
                </div>
              </Form>
            </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Change Profile Picture</h4>
                <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                >
                  <div className="d-flex gap-3">
                    <Input className="form-control" type="file" id="formFile" />
                  </div>
                  <div className="text-end mt-4">
                    <button type="submit" className="btn btn-success save-user" >
                      Update
                    </button>
                  </div>
                </Form>
              </CardBody>
            </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
