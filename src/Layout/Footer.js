import React, { useState, useEffect } from "react";
import logoimage from "../assets/images/footer-logo.svg";
import mobileapp from "../assets/images/mobileapp.jpg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <section id="footer" className="ftr-heading-o ftr-heading-mgn-1">
        <div
          id="footer-top"
          className="banner-padding ftr-top-white text-black"
        >
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-3 col-xl-3 footer-widget ftr-links">
                <h3 className="footer-heading">Company</h3>
                <ul className="list-unstyled">
                  <li>
                  <Link to="/about"> About</Link>
                  </li>
                  <li>
                    <Link to="/careers">Careers </Link>
                  </li>
                  <li>
                     <Link to="/mobile">Mobile </Link>
                  </li>
                  <li>
                     <Link to="/blog">Blog </Link>
                  </li>
                  <li>
                     <Link to="/howweworks">How we works </Link>
                  </li>
                </ul>
              </div>

              <div className="col-12 col-md-6 col-lg-3 col-xl-3 footer-widget ftr-contact">
                <h3 className="footer-heading">Contact Us</h3>
                <ul className="list-unstyled">
                  <li>
                     <Link to="/helpfaq">Help/FAQ </Link>
                  </li>
                  <li>
                     <Link to="press">Press </Link>
                  </li>
                  <li>
                     <Link to="/affilates">Affilates </Link>
                  </li>
                  <li>
                     <Link to="/hotelowners">Hotel owners </Link>
                  </li>
                  <li>
                     <Link to="/partners">Partners </Link>
                  </li>
                  <li>
                     <Link to="/advertise">Advertise with us </Link>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-md-6 col-lg-3 col-xl-3 footer-widget ftr-links">
                <h3 className="footer-heading">More</h3>
                <ul className="list-unstyled">
                  <li>
                     <Link to="/airlinefees">Airline Fees </Link>
                  </li>
                  <li>
                     <Link to="/airlines">Airlines </Link>
                  </li>
                  <li>
                     <Link to="/lowfare">Low fare tips </Link>
                  </li>
                  <li>
                     <Link to="/badges">Badges & certificates </Link>
                  </li>
                </ul>
              </div>

              <div className="col-12 col-md-6 col-lg-3 col-xl-3 footer-widget ftr-about">
                <h3 className="footer-heading">Get the Preyana App</h3>
                <img src={mobileapp} alt="mobile app" width={150} />
              </div>
            </div>
          </div>
        </div>

        <div id="footer-bottom" className="ftr-bot-white">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-2 col-lg-2 col-xl-2" id="copyright">
                <p className="mt-1">
                  © 2024  <Link to="#">Preyana </Link>
                </p>
              </div>
              <div className="col-12 col-md-10 col-lg-10 col-xl-10" id="terms">
                <ul className="list-unstyled list-inline">
                  <li className="list-inline-item">
                     <Link to="/privacy">Privacy </Link>
                  </li>
                  <li className="list-inline-item">
                     <Link to="/terms">Terms & Condition </Link>
                  </li>
                  <li className="list-inline-item">
                     <Link to="/adchoices">Ad Choices </Link>
                  </li>
                  <li className="list-inline-item">
                     <Link to="#" className="font-weight-bold">
                      Preyana.com
                     </Link>
                  </li>
                  <li className="list-inline-item">
                     <Link to="#">
                      <img src={logoimage} alt="footer logo" />
                     </Link>
                  </li>
                  <li className="list-inline-item">
                    <ul className="social-links list-inline list-unstyled">
                      <li className="list-inline-item">
                         <Link to="#">
                          <span>
                            <i className="fa fa-facebook"></i>
                          </span>
                         </Link>
                      </li>
                      <li className="list-inline-item">
                         <Link to="#">
                          <span>
                            <i className="fa fa-twitter"></i>
                          </span>
                         </Link>
                      </li>
                      <li className="list-inline-item">
                         <Link to="#">
                          <span>
                            <i className="fa fa-youtube-play"></i>
                          </span>
                         </Link>
                      </li>

                      <li className="list-inline-item">
                         <Link to="#">
                          <span>
                            <i className="fa fa-instagram"></i>
                          </span>
                         </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
