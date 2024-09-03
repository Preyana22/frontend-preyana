import React, { useState } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer"; // Import the Footer component
import sideimage from "../assets/images/login.jpg";
import destination_1 from "../assets/images/destination_1.jpg";
import destination_2 from "../assets/images/destination_2.jpg";
import destination_3 from "../assets/images/destination_3.jpg";

import { Link, useNavigate } from "react-router-dom";
import googleimage from "../assets/images/google.png";
import facebookimage from "../assets/images/facebook.png";
import axios from "axios";
import { Carousel } from "react-bootstrap";

const Login = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [login, setLogin] = useState();
  const [hidePassword, sethidePassword] = useState(true);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear validation errors when input changes
  };

  //Toggle password visibility
  const managePasswordVisibility = () => {
    sethidePassword((hidePassword) => !hidePassword);
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const newErrors = {};
    if (formData.username.trim() === "") {
      newErrors.username = "Username is required";
    }
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Form is valid, submit the data or perform other actions
        console.log("Form data:", formData);
        const configuration = {
          method: "post",
          url: "http://localhost:3000/authentication/log-in",
          data: {
            email: formData.username,
            password: formData.password,
          },
        };
        console.log("configuration");
        console.log(configuration);
        const result = await axios(configuration);
        console.log("result");
        console.log(result);
        localStorage.setItem("email", result.data.email);
        localStorage.setItem("userName", result.data.userName);
        localStorage.setItem("userId", result.data.id);
        setLogin(true);
        navigate("/search");
      } catch (error) {
        console.error("Login error:", error);
        setLogin(false);
        alert("Invalid username or password");
      }
    }
  };
  return (
    <>
      <section className="innerpage-wrapper">
        <div id="login" className="innerpage-section-padding">
          <div className="container">
            <div className="row row-bg-color">
              <div className="col-md-12">
                <div className="flex-content container-bg">
                  <div className="custom-form custom-form-fields">
                    <h3>Sign In</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label class="custom-label">Username</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.username ? "is-invalid" : ""
                          }`}
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                        />

                        {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label class="custom-label">Password</label>
                        <input
                          type={hidePassword ? "password" : "text"}
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <span>
                          <a
                            className="bg-transparent text-black"
                            onClick={managePasswordVisibility}
                          >
                            <label className="hide-show-label">
                              {" "}
                              {hidePassword ? "Show" : "Hide"}
                            </label>
                          </a>
                        </span>
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div className="checkbox">
                        <label style={{ display: "block" }}>
                          <input type="checkbox" /> Keep me signed in
                        </label>
                        <label>
                          By signing in, I agree to the Preyana's{" "}
                          <Link to="" class="link-text">
                            Terms and Conditions{" "}
                          </Link>
                          &{" "}
                          <Link to="" class="link-text">
                            Privacy statement{" "}
                          </Link>
                          .
                        </label>
                      </div>

                      <button className="btn btn-orange btn-block">
                        Login
                      </button>

                      {login === true ? (
                        <p className="text-success">
                          You Are Logged in Successfully
                        </p>
                      ) : login === false ? (
                        <p className="text-danger">
                          Invalid username or password
                        </p>
                      ) : (
                        ""
                      )}
                    </form>
                    <div className="other-links">
                      <p className="link-line">
                        Don't have an account?{" "}
                        <Link class="link-text" to="/registration">
                          Create One
                        </Link>
                      </p>

                      <p
                        className="link-line"
                        style={{ display: "inline-block" }}
                      >
                        or continue with{" "}
                        <Link to="/login">
                          <img
                            src={googleimage}
                            className="img-fluid plane_hotel_icon"
                            alt="plane-img"
                          />
                        </Link>
                        <Link to="/login">
                          <img
                            src={facebookimage}
                            className="img-fluid login-option-icon"
                            alt="plane-img"
                          />
                        </Link>
                      </p>

                      {/* <Link className="simple-link" to="/forgot">
                        {" "}
                        Forgot Password ?
                      </Link> */}
                    </div>
                  </div>

                  <div className="flex-content-img custom-form-img">
                    <Carousel
                      controls={false}
                      indicators={false}
                      interval={1500}
                    >
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          style={{ height: "400px" }}
                          src={destination_3}
                          alt="First slide"
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          style={{ height: "400px" }}
                          src={destination_1}
                          alt="Second slide"
                        />
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          style={{ height: "400px" }}
                          src={destination_2}
                          alt="Third slide"
                        />
                      </Carousel.Item>
                    </Carousel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Login;
