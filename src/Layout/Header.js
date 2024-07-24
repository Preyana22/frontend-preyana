import React, { useState, useEffect } from "react";
import headerlogoimage from "../assets/images/logo.svg";

//import logo from '../assets/images/logo.jpg'; // Assuming logo.png is in the images folder
/* eslint-disable */
const Header = () => {
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
      {/* <div id="top-bar" className="tb-text-white">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div id="info">
                            <ul className="list-unstyled list-inline">
                                <li className="list-inline-item"><span><i className="fa fa-map-marker"></i></span>29 Land St, Lorem City, CA</li>
                                <li className="list-inline-item"><span><i className="fa fa-phone"></i></span>+00 123 4567</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div id="links">
                            <ul className="list-unstyled list-inline">
                                <li className="list-inline-item"><a href="/"><span><i className="fa fa-lock"></i></span>Login</a></li>
                                <li className="list-inline-item"><a href="/registration"><span><i className="fa fa-plus"></i></span>Sign Up</a></li>
                                <li className="list-inline-item">
                                    <form>
                                        <ul className="list-inline">
                                            <li className="list-inline-item">
                                                <div className="form-group currency">
                                                    <span><i className="fa fa-angle-down"></i></span>
                                                    <select className="form-control">
                                                        <option value="">$</option>
                                                        <option value="">£</option>
                                                    </select>
                                                </div>
                                            </li>
                                            <li className="list-inline-item">
                                                <div className="form-group language">
                                                    <span><i className="fa fa-angle-down"></i></span>
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
        </div> */}

      <nav
        className="navbar navbar-expand-xl sticky-top navbar-custom main-navbar p-1"
        id="mynavbar-1"
      >
        <div className="container">
          <a href="#" className="navbar-brand py-1 m-0">
            <img src={headerlogoimage} alt="header logo" />
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

          {/* <div className="collapse navbar-collapse" id="myNavbar1">
            <ul className="navbar-nav ml-auto navbar-search-link">
              <li className="nav-item  active">
                <a
                  href="/home"
                  className="nav-link"
                  id="navbarDropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Home
                  <span>
                    <i className="fa fa-angle-down "></i>
                  </span>
                </a>
              </li>

              <li className="nav-item dropdown">
                <a href="#" className="nav-link" data-toggle="dropdown">
                  Hotel
                  <span>
                    <i className="fa fa-angle-down"></i>
                  </span>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/hotels">
                      Grid View Left Sidebar
                    </a>
                  </li>
                </ul>
              </li>
          <li className="nav-item ">
                            <a href="#" className="nav-link">About</a>
                            
                        </li>
                        <li className="nav-item ">
                            <a href="#" className="nav-link">Contact</a>
                            
                        </li> 
              <li className="dropdown-item search-btn">
                <a
                  href="#"
                  className="search-button" /*onClick="openSearch()"
                >
                  <span>
                    <i className="fa fa-search"></i>
                  </span>
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </nav>
    </div>
  );
};

export default Header;
