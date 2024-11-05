import React, { useEffect, Fragment, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// import "./css/atomic.css";
// import "./css/blue-violet.css";
import "./css/bootstrap-4.4.1.min.css";
// import "./css/brown.css";
// import "./css/caribbean-green.css";
import "./css/custom.css";
import "./css/datepicker.css";
// import "./css/egg-blue.css";
import "./css/flexslider.css";
import "./css/font-awesome.min.css";
import "./css/jquery-ui.min.css";
import "./css/jquery.colorpanel.css";
//import './css/jquery.mCustomScrollbar.min.css';
// import "./css/lightblue.css";
import "./css/magnific-popup.css";
import "./css/orange.css";
import "./css/owl.carousel.css";
import "./css/owl.theme.css";
//import './css/pigment-green.css';
//import './css/pink.css';
//import './css/purple.css';
//import './css/red.css';
import "./css/responsive.css";
import "./css/slick-theme.css";
import "./css/slick.css";
import "./css/style.css";

import { connect } from "react-redux";
import FlightsGrid from "./components/flights-grid/flights-grid";
import { getFlights } from "./actions";
import Header from "./components/Head";
import Body from "./components/Body";
import MyComponent from "./components/booking/booking-grid";
import Contacts from "./components/contact-details/contact-grid";
import Login from "./components/Login";
import Registration from "./components/Registration";
import InnerHeader from "./Layout/Header";
import Footer from "./Layout/Footer";
import ForgotPassword from "./components/forgot-password";
import ChangePassword from "./components/change-password";
import ResetPassword from "./components/reset-password";
import About from "./components/about";
import Careers from "./components/careers";
import Mobile from "./components/mobile";
import Blog from "./components/blog";
import HowWeWorks from "./components/howweworks";
import HelpFaq from "./components/helporfaq";
import Press from "./components/press";
import Affilates from "./components/affilates";
import HotelOwners from "./components/hotel-owners";
import Partners from "./components/partners";
import AdvertiseWithUs from "./components/advertise-with-us";
import AirlineFees from "./components/airline-fees";
import LowFareTips from "./components/low-fare-tips";
import BadgesAndCertificates from "./components/badges-and-certificates";
import Privacy from "./components/privacy";
import TermsAndCondition from "./components/terms-and-condition";
import AdChoices from "./components/ad-choices";
import MyBookings from "./components/booking/my-bookings/my-bookings";
import SingleBookingDetails from "./components/booking/single-booking/single-booking-details";
import Success from "./components/success";
import FareOption from "./components/fare-option/fare-option";
import Profile from "./components/profile";

function App(props) {
  const [marginToggled, setMarginToggled] = useState(false);
  useEffect(() => {
    props.getFlights();
  }, [(props.flights || []).legnth]);

  const flights = props.flights;
  const { origin, destination, departureDate, returnDate } =
    props.filters || {};

  const handleBrandClick = () => {
    setMarginToggled((prev) => !prev);
  };

  return (
    <BrowserRouter className="App" basename="/">
      <Routes>
        <Route
          path="/"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <Body />
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/login"
          element={
            <Fragment>
              <Header />
              <Login />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/search"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <Body />
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/results"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <FlightsGrid
                  flights={props.flights}
                  criteria={{ origin, destination, date: departureDate }}
                ></FlightsGrid>
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/registration"
          element={
            <Fragment>
              <Header />
              <Registration />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/booking"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <MyComponent flights={props.flights}></MyComponent>
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/contacts"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <Contacts flights={props.flights}></Contacts>
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/forgot"
          element={
            <Fragment>
              <Header />
              <ForgotPassword />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/change"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <ChangePassword />
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/reset"
          element={
            <Fragment>
              <Header />
              <ResetPassword />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/about"
          element={
            <Fragment>
              <Header />
              <About />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/careers"
          element={
            <Fragment>
              <Header />
              <Careers />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/mobile"
          element={
            <Fragment>
              <Header />
              <Mobile />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/blog"
          element={
            <Fragment>
              <Header />
              <Blog />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/howweworks"
          element={
            <Fragment>
              <Header />
              <HowWeWorks />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/helpfaq"
          element={
            <Fragment>
              <Header />
              <HelpFaq />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/press"
          element={
            <Fragment>
              <Header />
              <Press />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/affilates"
          element={
            <Fragment>
              <Header />
              <Affilates />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/hotelowners"
          element={
            <Fragment>
              <Header />
              <HotelOwners />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/partners"
          element={
            <Fragment>
              <Header />
              <Partners />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/advertise"
          element={
            <Fragment>
              <Header />
              <AdvertiseWithUs />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/airlinefees"
          element={
            <Fragment>
              <Header />
              <AirlineFees />
              <Footer />
            </Fragment>
          }
        />
        {/* <Route
          path="/airlines"
          element={
            <Fragment>
              <Header />
              <Airlines />
              <Footer />
            </Fragment>
          }
        /> */}
        <Route
          path="/lowfare"
          element={
            <Fragment>
              <Header />
              <LowFareTips />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/badges"
          element={
            <Fragment>
              <Header />
              <BadgesAndCertificates />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/privacy"
          element={
            <Fragment>
              <Header />
              <Privacy />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/terms"
          element={
            <Fragment>
              <Header />
              <TermsAndCondition />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/adchoices"
          element={
            <Fragment>
              <Header />
              <AdChoices />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/mybookings"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <MyBookings />
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/singlebooking"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />

              <div className={marginToggled ? "responsive-margin" : ""}>
                <SingleBookingDetails />
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/success"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <Success />
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/fareoption"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <FareOption />
              </div>
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/profile"
          element={
            <Fragment>
              <InnerHeader onBrandClick={handleBrandClick} />
              <div className={marginToggled ? "responsive-margin" : ""}>
                <Profile />
              </div>
              <Footer />
            </Fragment>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => ({
  flights: state.flights,
  routes: state.routes,
  filters: state.filters,
});

const mapDispatchToProps = {
  getFlights,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
