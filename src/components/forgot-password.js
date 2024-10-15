import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sideimage from "../assets/images/flight-1.jpg";
import destination_1 from "../assets/images/destination_1.jpg";
import destination_2 from "../assets/images/destination_2.jpg";

import googleimage from "../assets/images/google.png";
import facebookimage from "../assets/images/facebook.png";
import axios from "axios";
import { Carousel } from "react-bootstrap";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear validation errors when input changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const newErrors = {};
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Form is valid, submit the data or perform other actions
        console.log("Form data:", formData);
        const configuration = {
          method: "post",
          url: "http://192.168.1.92:3000/authentication/forgot-password",
          data: {
            email: formData.email,
          },
        };
        const result = await axios(configuration);

        alert(result.data.message);
        navigate("/login");
      } catch (error) {
        // console.error("Login error:", error);
        if (error.response) {
          // Check if the error status is 400
          if (error.response.status === 400) {
            console.log("Bad Request", error.response.data); // Log the error response
            alert(`Error: ${error.response.data.message}`); // Show error message to user
          } else {
            // Handle other status codes
            alert(`Error: ${error.response.status}`);
          }
        } else {
          // Handle network or other errors
          console.log("Error", error);
          alert("Something went wrong. Please try again later.");
        }
      }
    }
  };

  return (
    <>
      <section class="innerpage-wrapper">
        <div id="forgot-password" class="innerpage-section-padding">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="flex-content">
                  <div class="custom-form custom-form-fields">
                    <h3>Forgot Password</h3>
                    <p>
                      When you fill in your registered email address, you will
                      be sent instructions on how to reset your password.
                    </p>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label class="custom-label">Email</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />

                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>

                      <button class="btn btn-orange btn-block">Send</button>
                    </form>

                    <div className="other-links">
                      <p className="link-line">
                        Already Have An Account ?{" "}
                        <Link class="link-text" to="/login">
                          {" "}
                          Sign In
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
                    </div>
                  </div>

                  <div className="col-12 col-md-7 col-lg-7 col-xl-7 my-auto">
                    <div className="flex-content-img ">
                      <Carousel
                        controls={false}
                        indicators={false}
                        interval={1500}
                      >
                        <Carousel.Item>
                          <img
                            style={{ height: "500px" }}
                            className="d-block w-100"
                            src={sideimage}
                            alt="First slide"
                          />
                        </Carousel.Item>
                        <Carousel.Item>
                          <img
                            style={{ height: "500px" }}
                            className="d-block w-100"
                            src={destination_1}
                            alt="Second slide"
                          />
                        </Carousel.Item>
                        <Carousel.Item>
                          <img
                            style={{ height: "500px" }}
                            className="d-block w-100"
                            src={destination_2}
                            alt="Third slide"
                          />
                        </Carousel.Item>
                      </Carousel>

                      {/* <img
                      src={sideimage}
                      className="img-fluid custom-form-img"
                      alt="registration-img"
                    /> */}
                    </div>
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

export default ForgotPassword;
