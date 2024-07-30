import React from "react";
import headerlogoimage from "../assets/images/logo.svg";
function Header() {
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
        </div>
      </nav>
    </div>
  );
}
export default Header;
