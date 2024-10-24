import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Button, Container, Dropdown } from "react-bootstrap";
import headerlogoimage from "../assets/images/Preyana_Logo.svg";
import userimage from "../assets/images/user.svg";

const Header = () => {
  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
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

  const openProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    if (!email || !userId) {
      navigate("/");
    }
  }, [email, userId, userName]);

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
          <Nav className="ml-auto align-items-center">
            {email ? (
              <>
                <Nav.Item className="nav-item-border">
                  <Button
                    variant="link"
                    className="nav-btn text-left text-decoration-none"
                  >
                    <i className="fa fa-user-circle"></i> Hello {userName}
                  </Button>
                </Nav.Item>
                <Dropdown className="nav-item-border">
                  <Dropdown.Toggle variant="link" className="nav-link">
                    My Account
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Button} onClick={bookings}>
                      Your Trips
                    </Dropdown.Item>
                    <Dropdown.Item as={Button} onClick={openProfile}>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Button} onClick={changepassword}>
                      Change Password
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Nav.Item>
                  <Button
                    variant="link"
                    className="nav-btn text-left"
                    onClick={logout}
                  >
                    <i className="fa fa-power-off"></i> Log Out
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
