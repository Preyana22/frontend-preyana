import React, { useState, useEffect } from "react";
import logoimage from "../assets/images/footer-logo.svg";
import mobileapp from "../assets/images/mobileapp.jpg";

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
                    <a href="/about">About</a>
                  </li>
                  <li>
                    <a href="/careers">Careers</a>
                  </li>
                  <li>
                    <a href="/mobile">Mobile</a>
                  </li>
                  <li>
                    <a href="/blog">Blog</a>
                  </li>
                  <li>
                    <a href="/howweworks">How we works</a>
                  </li>
                </ul>
              </div>

              <div className="col-12 col-md-6 col-lg-3 col-xl-3 footer-widget ftr-contact">
                <h3 className="footer-heading">Contact Us</h3>
                <ul className="list-unstyled">
                  <li>
                    <a href="/helpfaq">Help/FAQ</a>
                  </li>
                  <li>
                    <a href="press">Press</a>
                  </li>
                  <li>
                    <a href="/affilates">Affilates</a>
                  </li>
                  <li>
                    <a href="/hotelowners">Hotel owners</a>
                  </li>
                  <li>
                    <a href="/partners">Partners</a>
                  </li>
                  <li>
                    <a href="/advertise">Advertise with us</a>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-md-6 col-lg-3 col-xl-3 footer-widget ftr-links">
                <h3 className="footer-heading">More</h3>
                <ul className="list-unstyled">
                  <li>
                    <a href="/airlinefees">Airline Fees</a>
                  </li>
                  <li>
                    <a href="/airlines">Airlines</a>
                  </li>
                  <li>
                    <a href="/lowfare">Low fare tips</a>
                  </li>
                  <li>
                    <a href="/badges">Badges & certificates</a>
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
                  © 2024 <a href="#">Preyana</a>
                </p>
              </div>
              <div className="col-12 col-md-10 col-lg-10 col-xl-10" id="terms">
                <ul className="list-unstyled list-inline">
                  <li className="list-inline-item">
                    <a href="/privacy">Privacy</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="/terms">Terms & Condition</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="/adchoices">Ad Choices</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#" className="font-weight-bold">
                      Preyana.com
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">
                      <img src={logoimage} alt="footer logo" />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <ul className="social-links list-inline list-unstyled">
                      <li className="list-inline-item">
                        <a href="#">
                          <span>
                            <i className="fa fa-facebook"></i>
                          </span>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#">
                          <span>
                            <i className="fa fa-twitter"></i>
                          </span>
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a href="#">
                          <span>
                            <i className="fa fa-youtube-play"></i>
                          </span>
                        </a>
                      </li>

                      <li className="list-inline-item">
                        <a href="#">
                          <span>
                            <i className="fa fa-instagram"></i>
                          </span>
                        </a>
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
