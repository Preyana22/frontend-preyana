import React, { useState, useEffect } from "react";
import headerlogoimage from "../assets/images/logo.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";

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
          <a href="#" className="navbar-brand py-1 m-0">
            <img src={headerlogoimage} alt="header logo" />
          </a>

          <div className="collapse navbar-collapse" id="myNavbar1">
            <ul className="navbar-nav ml-auto navbar-search-link">
              {email && (
                <li className="nav-item ">
                  <button className="btn d-block text-left" onClick={logout}>
                    <i className="fa fa-power-off"></i>
                    <span> {"logout"}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
