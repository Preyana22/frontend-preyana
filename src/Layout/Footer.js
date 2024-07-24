import React, { useState, useEffect } from 'react';

const Footer = () => {

   return (
    <>
    <section id="footer" className="ftr-heading-o ftr-heading-mgn-1">
        
    <div id="footer-top" className="banner-padding ftr-top-grey ftr-text-white">
        <div className="container">
            <div className="row">
                        
                <div className="col-12 col-md-6 col-lg-3 col-xl-3 footer-widget ftr-contact">
                    <h3 className="footer-heading">CONTACT US</h3>
                    <ul className="list-unstyled">
                        <li><span><i className="fa fa-map-marker"></i></span>29 Land St, Lorem City, CA</li>
                        <li><span><i className="fa fa-phone"></i></span>+00 123 4567</li>
                        <li><span><i className="fa fa-envelope"></i></span>info@preyana.com</li>
                    </ul>
                </div>
                
                <div className="col-12 col-md-6 col-lg-2 col-xl-2 footer-widget ftr-links">
                    <h3 className="footer-heading">COMPANY</h3>
                    <ul className="list-unstyled">
                        <li><a href="/home">Home</a></li>
                        <li><a href="/hotels">Hotel</a></li>
                    </ul>
                </div>
                
                <div className="col-12 col-md-6 col-lg-3 col-xl-3 footer-widget ftr-links ftr-pad-left">
                    <h3 className="footer-heading">RESOURCES</h3>
                    <ul className="list-unstyled">
                        <li><a href="#">Blogs</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="/">Login</a></li>
                        <li><a href="/registration">Register</a></li>
                        <li><a href="#">Site Map</a></li>
                    </ul>
                </div>

                <div className="col-12 col-md-6 col-lg-4 col-xl-4 footer-widget ftr-about">
                    <h3 className="footer-heading">ABOUT US</h3>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit.</p>
                    <ul className="social-links list-inline list-unstyled">
                        <li className="list-inline-item"><a href="#"><span><i className="fa fa-facebook"></i></span></a></li>
                        <li className="list-inline-item"><a href="#"><span><i className="fa fa-twitter"></i></span></a></li>
                        <li className="list-inline-item"><a href="#"><span><i className="fa fa-google-plus"></i></span></a></li>
                        <li className="list-inline-item"><a href="#"><span><i className="fa fa-pinterest-p"></i></span></a></li>
                        <li className="list-inline-item"><a href="#"><span><i className="fa fa-instagram"></i></span></a></li>
                        <li className="list-inline-item"><a href="#"><span><i className="fa fa-linkedin"></i></span></a></li>
                        <li className="list-inline-item"><a href="#"><span><i className="fa fa-youtube-play"></i></span></a></li>
                    </ul>
                </div>
                
            </div>
        </div>
    </div>

    <div id="footer-bottom" className="ftr-bot-black">
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-6 col-lg-6 col-xl-6" id="copyright">
                    <p>© 2022 <a href="#">Preyana</a>. All rights reserved.</p>
                </div>
                
                <div className="col-12 col-md-6 col-lg-6 col-xl-6" id="terms">
                    <ul className="list-unstyled list-inline">
                        <li className="list-inline-item"><a href="#">Terms & Condition</a></li>
                        <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
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
