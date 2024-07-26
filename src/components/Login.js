import React, { useState } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer"; // Import the Footer component
import sideimage from "../assets/images/login.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [login, setLogin] = useState();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear validation errors when input changes
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
          url: "http://192.168.1.170:3000/authentication/log-in",
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
            <div className="row">
              <div className="col-md-12">
                <div className="flex-content">
                  <div className="custom-form custom-form-fields">
                    <h3>Login</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.username ? "is-invalid" : ""
                          }`}
                          placeholder="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                        />
                        <span>
                          <i className="fa fa-user"></i>
                        </span>
                        {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <input
                          type="password"
                          className={`form-control ${
                            errors.password ? "is-invalid" : ""
                          }`}
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <span>
                          <i className="fa fa-lock"></i>
                        </span>
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div className="checkbox">
                        <label>
                          <input type="checkbox" /> Remember me
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
                        New Here ? <a href="/registration">Signup</a>
                      </p>
                      <a className="simple-link" href="/forgot">
                        Forgot Password ?
                      </a>
                    </div>
                  </div>

                  <div className="flex-content-img custom-form-img">
                    <img
                      src={sideimage}
                      className="img-fluid"
                      alt="registration-img"
                    />
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
