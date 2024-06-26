import React, { useEffect } from "react"
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback } from "reactstrap"

import { withRouter, Link,useHistory } from "react-router-dom";

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

// action
import { registerUser, apiError } from "../../store/actions"

//redux
import { useSelector, useDispatch } from "react-redux"
import RegisterService from "../../services/RegisterService"
import Swal from "sweetalert2";
// import images
import logoImg from "../../assets/images/logo.svg"
import loginService from "../../services/LoginService"


const Register = props => {

  //meta title
  document.title = "PDPS"
  const history = useHistory();
  const dispatch = useDispatch()

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: "",
      password: "",
      cpassword:'',
    },
    validationSchema: Yup.object({

      username: Yup.string().required("Please Enter Your Username"),

      password: Yup.string().required("Password is required"),
      cpassword: Yup.string().when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password and Confirm password need to be the same"
        ),
      }),
    }),

    onSubmit: async (values) => {
      console.log(values);
      try {
        const data = await RegisterService.register(values);

        if (data.status === 201) {

          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "You have successfully activated the account. Please log in.!"
          })
          history.push("/login")


        } else {
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.error || "Something went wrong!"
          });
          dispatch(apiError(data.error || "Something went wrong!"));
        }
      }catch (error) {
        console.error("Error during registration:", error);
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!"
        });
        dispatch(apiError("Somethingkjhhiu went wrong!"));
      }
    }
  })

  const { user, registrationError, loading } = useSelector(state => ({
    user: state.Account.user,
    registrationError: state.Account.registrationError,
    loading: state.Account.loading
  }))
  //console.log("user", user)

  useEffect(() => {
    dispatch(apiError(""))
  }, [])

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h4 className="text-primary"> Register</h4>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logoImg}
                            alt=""
                            className="img-thumbnail rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      {/*{user && user ? (*/}
                      {/*  <Alert color="success">*/}
                      {/*    Register User Successfully*/}
                      {/*  </Alert>*/}
                      {/*) : null}*/}

                      {/*{registrationError && registrationError ? (*/}
                      {/*  <Alert color="danger">{registrationError}</Alert>*/}
                      {/*) : null}*/}


                      <div className="mb-3">
                        <Label className="form-label">Username</Label>
                        <Input
                          name="username"
                          type="text"
                          placeholder="Enter username"
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
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={
                            validation.touched.password && validation.errors.password ? true : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="cpassword"
                          type="password"
                          placeholder="Enter Password Confirmation"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.cpassword || ""}
                          invalid={
                            validation.touched.cpassword && validation.errors.cpassword ? true : false
                          }
                        />
                        {validation.touched.cpassword && validation.errors.cpassword ? (
                          <FormFeedback type="invalid">{validation.errors.cpassword}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="mt-4">
                        <button
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account ?{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
                    {" "}
                    Login
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} PDPS
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Register
