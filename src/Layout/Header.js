import React, { useEffect } from "react";
import headerlogoimage from "../assets/images/Preyana_Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import userimage from "../assets/images/user.svg";

//import logo from '../assets/images/logo.jpg'; // Assuming logo.png is in the images folder
/* eslint-disable */
const Header = () => {
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const bookings = () => {
    navigate("/mybookings");
  };
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email]);

  <style>
    {`
      #top-bar {
        background-color: #0e265a !important;
      }
      .search-tabs {
        bottom: 200px;
      }
    `}
  </style>;
  return (
    <div className="wrapper">
      <nav
        className="navbar navbar-expand-xl sticky-top navbar-custom main-navbar p-1"
        id="mynavbar-1"
      >
        <div className="container">
          <Link to="/" className="navbar-brand py-1 m-0">
            <img
              style={{ width: "150px", height: "auto" }}
              src={headerlogoimage}
              alt="header logo"
            />
          </Link>

          <div className="collapse navbar-collapse" id="myNavbar1">
            <ul className="navbar-nav ml-auto navbar-search-link">
              {email ? (
                <>
                  <li className="nav-item ">
                    <button
                      className="btn d-block text-left mt-2"
                      onClick={bookings}
                    >
                      <span> {"my bookings"}</span>
                    </button>
                  </li>
                  <li className="nav-item ">
                    <button className="btn d-block text-left" onClick={logout}>
                      <i className="fa fa-power-off"></i>
                      <span> {"logout"}</span>
                    </button>
                  </li>
                </>
              ) : (
                <Link to="/login" className="navbar-brand py-1 m-0">
                  <img
                    src={userimage}
                    className="img-fluid user-img"
                    alt="flight-img"
                  />
                  <span className="sign-in-label">Sign In</span>
                </Link>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
