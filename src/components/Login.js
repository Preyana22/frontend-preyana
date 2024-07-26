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
          url: "http://192.168.1.49:3000/authentication/log-in",
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
      <div className="wrapper">
        <div id="myOverlay" className="overlay">
          <span
            className="closebtn"
            /*onClick="closeSearch()" */ title="Close Overlay"
          >
            ×
          </span>
          <div className="overlay-content">
            <form>
              <div className="form-group">
                <div className="input-group">
                  <input
                    className="float-left"
                    type="text"
                    placeholder="Search.."
                    name="search"
                  />
                  <button className="float-left" type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div id="top-bar" className="tb-text-white">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6">
                <div id="info">
                  <ul className="list-unstyled list-inline">
                    <li className="list-inline-item">
                      <span>
                        <i className="fa fa-map-marker"></i>
                      </span>
                      29 Land St, Lorem City, CA
                    </li>
                    <li className="list-inline-item">
                      <span>
                        <i className="fa fa-phone"></i>
                      </span>
                      +00 123 4567
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div id="links">
                  <ul className="list-unstyled list-inline">
                    <li className="list-inline-item">
                      <a href="/">
                        <span>
                          <i className="fa fa-lock"></i>
                        </span>
                        Login
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="/registration">
                        <span>
                          <i className="fa fa-plus"></i>
                        </span>
                        Sign Up
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <form>
                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <div className="form-group currency">
                              <span>
                                <i className="fa fa-angle-down"></i>
                              </span>
                              <select className="form-control">
                                <option value="">$</option>
                                <option value="">£</option>
                              </select>
                            </div>
                          </li>
                          <li className="list-inline-item">
                            <div className="form-group language">
                              <span>
                                <i className="fa fa-angle-down"></i>
                              </span>
                              <select className="form-control">
                                <option value="">EN</option>
                                <option value="">UR</option>
                                <option value="">FR</option>
                                <option value="">IT</option>
                              </select>
                            </div>
                          </li>
                        </ul>
                      </form>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav
          className="navbar navbar-expand-xl sticky-top navbar-custom main-navbar p-1"
          id="mynavbar-1"
        >
          <div className="container">
            <a href="/home" className="navbar-brand py-1 m-0">
              <img style={{ width: "300px" }} />
            </a>
            <div className="header-search d-xl-none my-auto ml-auto py-1">
              <a href="#" className="search-button" /*onClick="openSearch()"*/>
                <span>
                  <i className="fa fa-search"></i>
                </span>
              </a>
            </div>
            <button
              className="navbar-toggler ml-2"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              id="sidebarCollapse"
            >
              <i className="fa fa-navicon py-1"></i>
            </button>

            <div className="collapse navbar-collapse" id="myNavbar1">
              <ul className="navbar-nav ml-auto navbar-search-link">
                {/* <li className="nav-item  active">
                         <a href="/home" className="nav-link" id="navbarDropdown" role="button"  aria-haspopup="true" aria-expanded="false">Home<span><i className="fa fa-angle-down "></i></span></a>
                        
                     </li>
                   
                     <li className="nav-item dropdown">
                         <a href="#" className="nav-link" data-toggle="dropdown">Hotel<span><i className="fa fa-angle-down"></i></span></a>
                         <ul className="dropdown-menu">
                            
                             <li><a className="dropdown-item" href="/hotels">Grid View Left Sidebar</a></li>
                            
                         </ul>
                     </li>
                    <li className="nav-item ">
                         <a href="#" className="nav-link">About</a>
                         
                     </li>
                     <li className="nav-item ">
                         <a href="#" className="nav-link">Contact</a>
                         
                     </li> */}
                <li className="dropdown-item search-btn">
                  <a
                    href="#"
                    className="search-button" /*onClick="openSearch()"*/
                  >
                    <span>
                      <i className="fa fa-search"></i>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <section className="page-cover" id="cover-login">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="page-title">Login 1</h1>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/home">Home</a>
                </li>
                <li className="breadcrumb-item">Login 1</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="innerpage-wrapper">
        <div id="login" className="innerpage-section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="flex-content">
                  <div className="custom-form custom-form-fields">
                    <h3>Login</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
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
                      <a className="simple-link" href="#">
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
      <section id="best-features" className="banner-padding black-features">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <div className="b-feature-block">
                <span>
                  <i className="fa fa-dollar"></i>
                </span>
                <h3>Best Price Guarantee</h3>
                <p>
                  Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in
                  lucilius prodesset pri. Veniam delectus ei vis.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="b-feature-block">
                <span>
                  <i className="fa fa-lock"></i>
                </span>
                <h3>Safe and Secure</h3>
                <p>
                  Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in
                  lucilius prodesset pri. Veniam delectus ei vis.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="b-feature-block">
                <span>
                  <i className="fa fa-thumbs-up"></i>
                </span>
                <h3>Best Travel Agents</h3>
                <p>
                  Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in
                  lucilius prodesset pri. Veniam delectus ei vis.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="b-feature-block">
                <span>
                  <i className="fa fa-bars"></i>
                </span>
                <h3>Travel Guidelines</h3>
                <p>
                  Lorem ipsum dolor sit amet, ad duo fugit aeque fabulas, in
                  lucilius prodesset pri. Veniam delectus ei vis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="newsletter-1"
        className="section-padding back-size newsletter"
      >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 col-xl-12 text-center">
              <h2>Subscribe Our Newsletter</h2>
              <p>Subscibe to receive our interesting updates</p>
              <form>
                <div className="form-group">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control input-lg"
                      placeholder="Enter your email address"
                      required
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-lg">
                        <i className="fa fa-envelope"></i>
                      </button>
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default Login;