import React, { useEffect, Fragment } from "react";
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
import SearchForm from "./container/search-form/search-form";
import FlightsGrid from "./components/flights-grid/flights-grid";
import BookingGrid from "./components/booking/booking-grid";
import { getFlights } from "./actions";
import Header from "./components/Head";
import Body from "./components/Body";
import MyComponent from "./components/booking/booking-grid";
import Contacts from "./components/contact-details/contact-grid";
import Login from "./components/Login";
import Registration from "./components/Registration";
import InnerHeader from "./Layout/Header";
import Footer from "./Layout/Footer";
function App(props) {
  useEffect(() => {
    props.getFlights();
  }, [(props.flights || []).legnth]);
  const flights = props.flights;
  const { origin, destination, departureDate, returnDate } =
    props.filters || {};
  return (
    <BrowserRouter className="App" basename="/preyana"> 

      <Routes>
        <Route
          path="/"
          element={
            <Fragment>
              <InnerHeader />
              <Login />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/search"
          element={
            <Fragment>
              <InnerHeader />
              <Body />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/results"
          element={
            <FlightsGrid
              flights={props.flights}
              criteria={{ origin, destination, date: departureDate }}
            ></FlightsGrid>
          }
        />
        <Route
          path="/registration"
          element={
            <Fragment>
              <InnerHeader />
              <Registration />
              <Footer />
            </Fragment>
          }
        />
        <Route
          path="/booking"
          element={<MyComponent flights={props.flights}></MyComponent>}
        />
        <Route
          path="/contacts"
          element={<Contacts flights={props.flights}></Contacts>}
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