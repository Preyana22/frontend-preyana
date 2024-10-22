import React from "react";
import headerlogoimage from "../assets/images/Preyana_Logo.png";
import { Link } from "react-router-dom";

function Header() {
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
        </div>
      </nav>
    </div>
  );
}
export default Header;
