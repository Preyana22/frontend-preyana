import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import headerlogoimage from "../assets/images/Preyana_Logo.svg";
import userimage from "../assets/images/user.svg";

const Header = () => {
  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path

  const logout = () => {
    // Show a confirmation dialog
    if (window.confirm("Are you sure you want to log out?")) {
      // If the user confirms, clear localStorage and navigate to the home page
      localStorage.clear();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  const bookings = () => {
    navigate("/mybookings");
  };

  const changepassword = () => {
    navigate("/change");
  };

  useEffect(() => {
    if (!email || !userId) {
      navigate("/");
    }
  }, [email, userId]);

  return (
    <Navbar expand="lg" sticky="top" className="navbar-custom p-1">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            style={{ width: "150px", height: "auto" }}
            src={headerlogoimage}
            alt="header logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <i className="fa fa-bars"></i>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {email ? (
              <>
                <Nav.Item>
                  <Button
                    variant="link"
                    className={`nav-btn text-left ${
                      location.pathname === "/mybookings" ? "active" : ""
                    }`}
                    onClick={bookings}
                  >
                    My Bookings
                  </Button>
                </Nav.Item>
                <Nav.Item>
                  <Button
                    variant="link"
                    className={`nav-btn text-left ${
                      location.pathname === "/change" ? "active" : ""
                    }`}
                    onClick={changepassword}
                  >
                    Change Password
                  </Button>
                </Nav.Item>
                <Nav.Item>
                  <Button
                    variant="link"
                    className="nav-btn text-left"
                    onClick={logout}
                  >
                    <i className="fa fa-power-off"></i> Logout
                  </Button>
                </Nav.Item>
              </>
            ) : (
              <Nav.Item>
                <Link
                  to="/login"
                  className={`navbar-brand py-1 m-0 ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                >
                  <img
                    src={userimage}
                    className="img-fluid user-img"
                    alt="flight-img"
                  />
                  <span className="sign-in-label font-weight-bold">
                    Sign In
                  </span>
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
