import React, { useState } from "react";
import axios from "axios";
import sideimage from "../assets/images/flight-1.jpg";
import destination_1 from "../assets/images/destination_1.jpg";
import destination_2 from "../assets/images/destination_2.jpg";

import googleimage from "../assets/images/google.png";
import facebookimage from "../assets/images/facebook.png";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { Carousel } from "react-bootstrap";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const Registration = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [hidePassword, sethidePassword] = useState(true);
  const [hideConfirmPassword, sethideConfirmPassword] = useState(true);

  const [errors, setErrors] = useState({});
  const [register, setRegister] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear validation errors when input changes
  };

  //Toggle password visibility
  const managePasswordVisibility = () => {
    sethidePassword((hidePassword) => !hidePassword);
  };

  //Toggle password visibility
  const manageConfirmPasswordVisibility = () => {
    sethideConfirmPassword((hideConfirmPassword) => !hideConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form data
    const newErrors = {};
    
    // username validation
    const username = formData.username.trim();
    if (!username) {
      newErrors.username = "Username is required"; // checks if username is empty
    }
    if (username.length < 5) {
      newErrors.username = "Username must be at least 5 characters"; // checks if username is less than 5 characters
    } 
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      newErrors.username = "Username can only contain letters and numbers"; // checks if username contains only letters and numbers
    }

    // email validation
    if (formData.email.trim() === "") {
      newErrors.email = "Email is required"; // checks if email is empty
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"; // checks if email is in valid format
    }

    // password validation
    if (formData.password.trim() === "") {
      newErrors.password = "Password is required"; // checks if password is empty
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"; // checks if password is less than 8 characters
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password must include at least one special character"; // checks if password contains at least one special character
    }
    if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must include at least one number"; // checks if password contains at least one number
    }
    if (formData.confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Confirm Password is required"; // checks if confirm password is empty
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match"; // checks if password and confirm password match
    }
    if ( formData.username && formData.password && formData.password.includes(formData.username)) {
      newErrors.password = "Password cannot contain your username"; // checks if password contains username
    }
    if (formData.email === formData.password) {
      newErrors.email = "Email and password cannot be the same"; // checks if email and password are the same
    }

    // general validation
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Form is valid, submit the data or perform other actions
      console.log("Form data:", formData);

      const configuration = {
        method: "post",
        url: apiUrl + "/authentication/register",
        data: {
          email: formData.email,
          userName: formData.username,
          password: formData.password,
          google_id: null,
          facebook_id: null,
        },
      };
      console.log("configuration", configuration);
      await axios(configuration)

        .then((result) => {
          console.log("response", result.data);
          setRegister(true);
          alert(result.data.message);
          navigate("/login");
        })
        .catch((error) => {
          console.log(error);
          setRegister(false);
          if (error.response) {
            // Check if the error status is 400
            if (error.response.status === 400) {
              console.log("Bad Request", error.response.data); // Log the error response
              alert(`Error: ${error.response.data.message}`); // Show error message to user
            } else if (error.response.status === 409) {
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
        });
    }

  };
  return (
    <>
      <section className="innerpage-wrapper">
        <div id="registration" className="innerpage-section-padding">
          <div className="container ">
            <div className="row row-bg-color">
              <div className="col-12 col-md-5 col-lg-5 col-xl-5 my-auto">
                <div className="flex-content container-bg">
                  <div className="custom-form custom-form-fields">
                    <h3>Register</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label className="custom-label">Username</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.username ? "is-invalid" : ""
                          } input`}
                          //placeholder="Username"
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
                        <label className="custom-label">Email</label>
                        <input
                          type="email"
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

                      <div className="form-group">
                        <label className="custom-label">Password</label>
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
                            role="button"
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
                        <label className="custom-label">Confirm Password</label>
                        <input
                          type={hideConfirmPassword ? "password" : "text"}
                          className={`form-control ${
                            errors.confirmPassword ? "is-invalid" : ""
                          }`}
                          name="confirmPassword"
                          value={formData.confirmPassword}
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
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                      <button className="btn btn-orange btn-block">
                        Register
                      </button>
                    </form>

                    <div className="other-links">
                      <p className="link-line">
                        Already Have An Account ?{" "}
                        <Link className="link-text" to="/login">
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
                </div>
              </div>
              <div className="col-12 col-md-7 col-lg-7 col-xl-7 my-auto">
                <div className="flex-content-img ">
                  <Carousel controls={false} indicators={false}>
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
      </section>
    </>
  );
};
export default Registration;
