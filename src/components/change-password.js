import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import sideimage from "../assets/images/flight-1.jpg";

import axios from "axios";
import { Carousel } from "react-bootstrap";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    newpassword: "",
    confirmpassword: "",
  });
  const [errors, setErrors] = useState({});
  const [hidePassword, sethidePassword] = useState(true);
  const [hideNewPassword, sethideNewPassword] = useState(true);
  const [hideConfirmPassword, sethideConfirmPassword] = useState(true);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear validation errors when input changes
  };

  //Toggle password visibility
  const managePasswordVisibility = () => {
    sethidePassword((hidePassword) => !hidePassword);
  };

  //Toggle password visibility
  const manageNewPasswordVisibility = () => {
    sethideNewPassword((hidePassword) => !hidePassword);
  };

  //Toggle password visibility
  const manageConfirmPasswordVisibility = () => {
    sethideConfirmPassword((hidePassword) => !hidePassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const newErrors = {};
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
    }

    if (formData.newpassword.trim() === "") {
      newErrors.newpassword = "New password is required";
    }

    if (formData.confirmpassword.trim() != formData.newpassword.trim()) {
      newErrors.confirmpassword =
        "Confirm password not matched with new password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Form is valid, submit the data or perform other actions
        console.log("Form data:", formData);
        const configuration = {
          method: "post",
          url: apiUrl + "/authentication/change-password",
          data: {
            userId: localStorage.getItem("userId"),
            currentPassword: formData.password,
            newPassword: formData.newpassword,
          },
        };

        const result = await axios(configuration);

        alert(result.data.message);
        navigate("/");
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
      <section className="innerpage-wrapper">
        <div id="forgot-password" className="">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="flex-content">
                  <div className="custom-form custom-form-fields">
                    <h3 className="font-weight-bold text-black">
                      Change Password
                    </h3>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label className="custom-label">Old Password</label>
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
                      <div className="form-group">
                        <label className="custom-label">New Password</label>
                        <input
                          type={hideNewPassword ? "password" : "text"}
                          className={`form-control ${
                            errors.newpassword ? "is-invalid" : ""
                          }`}
                          name="newpassword"
                          value={formData.newpassword}
                          onChange={handleChange}
                        />
                        <span>
                          <a
                            className="bg-transparent text-black"
                            onClick={manageNewPasswordVisibility}
                          >
                            <label className="hide-show-label">
                              {" "}
                              {hideNewPassword ? "Show" : "Hide"}
                            </label>
                          </a>
                        </span>
                        {errors.newpassword && (
                          <div className="invalid-feedback">
                            {errors.newpassword}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label className="custom-label">Confirm Password</label>
                        <input
                          type={hideConfirmPassword ? "password" : "text"}
                          className={`form-control ${
                            errors.confirmpassword ? "is-invalid" : ""
                          }`}
                          name="confirmpassword"
                          value={formData.confirmpassword}
                          onChange={handleChange}
                        />
                        <span>
                          <a
                            className="bg-transparent text-black"
                            onClick={manageConfirmPasswordVisibility}
                          >
                            <label className="hide-show-label">
                              {" "}
                              {hideConfirmPassword ? "Show" : "Hide"}
                            </label>
                          </a>
                        </span>
                        {errors.confirmpassword && (
                          <div className="invalid-feedback">
                            {errors.confirmpassword}
                          </div>
                        )}
                      </div>
                      <button className="btn btn-orange btn-block">Save</button>
                    </form>
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
