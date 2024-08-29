import React from "react";
import { useEffect, useState } from "react";
import searchForm from "../container/search-form/search-form";
import { Typeahead } from "react-bootstrap-typeahead";
import Form from "react-bootstrap/Form";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { connect } from "react-redux";
import { findFlights, fetchFlights } from "../actions";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import "./body.css";
import flight1 from "../assets/images/flight1.jpg";
import axios from "axios";

import flightimage from "../assets/images/flightimage.svg";
import sideimage from "../assets/images/banner.svg";
import inoutimage from "../assets/images/inoutimage.svg";
import locationimage from "../assets/images/locationimage.svg";
import calendarimage from "../assets/images/calendarimage.svg";
import Header from "../Layout/Header";
import SearchFlight from "./search-flight/SearchFlight";

const isDate = (date) => {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

const ErrorLabel = (props) => {
  return <label style={{ color: "red" }}>{props.message}</label>;
};

export const Body = (props) => {
  const [airportsData, setAirports] = useState([]);
  const [openOptions, setOpenOptions] = useState(false);
  const [tripOptions, setTripOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    infant: 1,
  });
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  useEffect(() => {
    const getAirports = async () => {
      try {
        const { data } = await axios.get(
          `http://3.128.255.176:3000/airlines/airports`
        );
        console.log(data);
        setAirports(data);
        // setAirports(data.results);
      } catch (error) {
        console.log(error);
      }
    };
    getAirports();
  }, []);

  //console.log("airportsData.results"+airportsData.data);
  // var result1 =airportsData;
  var result1 = airportsData.data;

  var data1 = [];

  if (result1) {
    data1 = result1.map((t) =>
      t.city_name == null
        ? "abc"
        : t.city_name + "(" + t.iata_code + "-" + t.name + ")"
    );
    //data1 = result1.map(t=>t.IATAcode==null?'abc':t.IATAcode);
  }

  const dummyairports = [
    "LHR",
    "CDG",
    "BCN",
    "LAX",
    "MEL",
    "SYD",
    "AKL",
    "DEL",
    "SIN",
    "HKG",
  ];
  const airports = data1 ? dummyairports : dummyairports;
  console.log("airports" + airports);
  const navigate = useNavigate();
  let origin, destination, cabinclass;
  let criteria;

  const [isReturn, setFlightType] = useState(false);
  const [status, setFormValid] = useState({ isValid: false });
  console.log(status);
  let invalidFields = {};
  const handleSubmit1 = (event) => {
    let cabinValue;
    console.log(cabinclass.state.text);
    if (cabinclass.state.text == "Premium Economy") {
      cabinValue = "premium_economy";
    } else {
      cabinValue = cabinclass.state.text;
    }
    console.log(isReturn);
    event.preventDefault();
    const { flights } = props;
    invalidFields = {};
    let Adults = [];
    let adultsData = {
      type: "adult",
    };
    let childData = {
      type: "child",
    };

    let infantData = {
      type: "infant_without_seat",
    };
    console.log(options);
    console.log(options.adult);
    for (var i = 1; i <= options.adult; i++) {
      console.log(adultsData);
      Adults.push(adultsData);
    }
    for (var i = 1; i <= options.children; i++) {
      console.log(childData);
      Adults.push(childData);
    }
    for (var i = 1; i <= options.infant; i++) {
      console.log(infantData);
      Adults.push(infantData);
    }
    console.log(Adults);
    console.log("origin.state.text" + origin.state.text);
    const origin_city = origin.state.text;

    const destination_city = destination.state.text;

    if (isReturn === false) {
      criteria = {
        origin: origin_city,
        destination: destination_city,
        departureDate: event.target.dateOfDep.value,

        //numOfPassengers: event.target.passengers.value,
        numOfPassengers: Adults,
        cabin_class: cabinValue,
      };
    } else {
      criteria = {
        origin: origin_city,
        destination: destination_city,
        departureDate: event.target.dateOfDep.value,
        returnDate: event.target.returnDate.value,
        //numOfPassengers: event.target.passengers.value,
        numOfPassengers: Adults,
        cabin_class: cabinValue,
      };
    }
    console.log(criteria);

    if (!cabin_details.includes(cabinclass.state.text)) {
      invalidFields.cabinclass = true;
    }

    if (!isDate(criteria.departureDate)) {
      invalidFields.departureDate = true;
    }
    if (!isDate(criteria.departureDate)) {
      invalidFields.departureDate = true;
    }
    if (Object.keys(invalidFields).length > 0) {
      setFormValid({ isValid: false, ...invalidFields });
      return;
    }

    setFormValid({ isValid: true });

    props.findFlights({ flights, criteria });

    navigate("/results");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const { flights } = props;
    invalidFields = {};

    if (isReturn === false) {
      criteria = {
        origin: origin.state.text,
        destination: destination.state.text,
        departureDate: event.target.dateOfDep.value,

        numOfPassengers: event.target.numOfPassengers.value,
        cabin_class: cabinclass.state.text,
      };
    } else {
      criteria = {
        origin: origin.state.text,
        destination: destination.state.text,
        departureDate: event.target.dateOfDep.value,
        returnDate: event.target.dateOfReturn.value,
        numOfPassengers: event.target.numOfPassengers.value,
        cabin_class: cabinclass.state.text,
      };
    }
    console.log(criteria);
    /* if (event.target.flightType[1].checked ) {
        criteria.returnDate = event.target.dateOfReturn.value;
        if (!isDate(event.target.dateOfReturn.value)) {
          invalidFields.returnDate = true;
        }
      }*/

    if (!airports.includes(criteria.origin)) {
      invalidFields.origin = true;
    }
    if (
      !airports.includes(criteria.destination) ||
      criteria.origin === criteria.destination
    ) {
      invalidFields.destination = true;
    }
    if (!isDate(criteria.departureDate)) {
      invalidFields.departureDate = true;
    }
    if (!isDate(criteria.departureDate)) {
      invalidFields.departureDate = true;
    }
    if (Object.keys(invalidFields).length > 0) {
      setFormValid({ isValid: false, ...invalidFields });
      return;
    }

    setFormValid({ isValid: true });
    props.findFlights({ flights, criteria });

    navigate("/results");
  };
  const mystyle = {
    background:
      "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)) 0% 0% / cover, url(../assets/images/homepage-slider.jpg) 50% 0%",
    height: "100%",
    width: "1510px",
    marginRight: "0px",
    float: "left",
    display: "block",
  };

  /* const airports = [
        'LHR',
        'CDG',
        'BCN',
        'LAX',
        'MEL',
        'SYD',
        'AKL',
        'DEL',
        'SIN',
        'HKG'
       
      ];*/

  const cabin_details = ["Economy", "Premium Economy", "Business", "First"];

  return (
    <>
      <section className="innerpage-wrapper">
        <div id="search-result-page" className="">
        <div className="container">
        <SearchFlight />
            <div className="row">
              <div className="col-12 col-md-12 col-lg-12 col-xl-12 content-side">
                <div className="row pb-4">
                  <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                    <h2 className="font-weight-bold">
                      Flights Deals to Top Destination
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                    <div className="grid-block main-block f-grid-block">
                      <a href="flight-detail-left-sidebar.html">
                        <div className="main-img f-img">
                          <img
                            src={flightimage}
                            className="img-fluid"
                            alt="flight-img"
                          />
                        </div>
                      </a>
                      <div className="block-info f-grid-info">
                        <div className="f-grid-desc">
                          <span className="f-grid-time">
                            <i className="fa fa-clock-o"></i>6 hours - 30
                            minutes
                          </span>
                          <h3 className="block-title">
                            <a href="flight-detail-left-sidebar.html">
                              Sydney to Paris
                            </a>
                          </h3>
                          <p className="block-minor">
                            <span>Fr 5379,</span> Oneway Flight
                          </p>

                          <ul className="list-unstyled list-inline offer-price-1">
                            <li className="price">
                              $568.00<span className="divider">|</span>
                              <span className="pkg">2 Stay</span>
                            </li>
                          </ul>

                          <p>
                            Lorem ipsum dolor sit amet, ad duo fugit aeque
                            fabulas, in lucilius prodesset pri. Veniam delectus
                            ei{" "}
                          </p>
                        </div>

                        <div className="f-grid-timing">
                          <ul className="list-unstyled">
                            <li>
                              <span>
                                <i className="fa fa-plane"></i>
                              </span>
                              <span className="date">Aug, 02-2017 </span>(8:40
                              PM)
                            </li>
                            <li>
                              <span>
                                <i className="fa fa-plane"></i>
                              </span>
                              <span className="date">Aug, 03-2017 </span>(8:40
                              PM)
                            </li>
                          </ul>
                        </div>

                        <div className="grid-btn">
                          <a
                            href="flight-detail-left-sidebar.html"
                            className="btn btn-orange btn-block btn-lg"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                    <div className="grid-block main-block f-grid-block">
                      <a href="flight-detail-left-sidebar.html">
                        <div className="main-img f-img">
                          <img
                            src={flightimage}
                            className="img-fluid"
                            alt="flight-img"
                          />
                        </div>
                      </a>

                      <div className="block-info f-grid-info">
                        <div className="f-grid-desc">
                          <span className="f-grid-time">
                            <i className="fa fa-clock-o"></i>6 hours - 30
                            minutes
                          </span>
                          <h3 className="block-title">
                            <a href="flight-detail-left-sidebar.html">
                              Sydney to Paris
                            </a>
                          </h3>
                          <p className="block-minor">
                            <span>Fr 5379,</span> Oneway Flight
                          </p>
                          <ul className="list-unstyled list-inline offer-price-1">
                            <li className="price">
                              $568.00<span className="divider">|</span>
                              <span className="pkg">2 Stay</span>
                            </li>
                          </ul>

                          <p>
                            Lorem ipsum dolor sit amet, ad duo fugit aeque
                            fabulas, in lucilius prodesset pri. Veniam delectus
                            ei{" "}
                          </p>
                        </div>

                        <div className="f-grid-timing">
                          <ul className="list-unstyled">
                            <li>
                              <span>
                                <i className="fa fa-plane"></i>
                              </span>
                              <span className="date">Aug, 02-2017 </span>(8:40
                              PM)
                            </li>
                            <li>
                              <span>
                                <i className="fa fa-plane"></i>
                              </span>
                              <span className="date">Aug, 03-2017 </span>(8:40
                              PM)
                            </li>
                          </ul>
                        </div>

                        <div className="grid-btn">
                          <a
                            href="flight-detail-left-sidebar.html"
                            className="btn btn-orange btn-block btn-lg"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                    <div className="grid-block main-block f-grid-block">
                      <a href="flight-detail-left-sidebar.html">
                        <div className="main-img f-img">
                          <img
                            src={flightimage}
                            className="img-fluid"
                            alt="flight-img"
                          />
                        </div>
                      </a>

                      <div className="block-info f-grid-info">
                        <div className="f-grid-desc">
                          <span className="f-grid-time">
                            <i className="fa fa-clock-o"></i>6 hours - 30
                            minutes
                          </span>
                          <h3 className="block-title">
                            <a href="flight-detail-left-sidebar.html">
                              Sydney to Paris
                            </a>
                          </h3>
                          <p className="block-minor">
                            <span>Fr 5379,</span> Oneway Flight
                          </p>
                          <ul className="list-unstyled list-inline offer-price-1">
                            <li className="price">
                              $568.00<span className="divider">|</span>
                              <span className="pkg">2 Stay</span>
                            </li>
                          </ul>
                          <p>
                            Lorem ipsum dolor sit amet, ad duo fugit aeque
                            fabulas, in lucilius prodesset pri. Veniam delectus
                            ei{" "}
                          </p>
                        </div>

                        <div className="f-grid-timing">
                          <ul className="list-unstyled">
                            <li>
                              <span>
                                <i className="fa fa-plane"></i>
                              </span>
                              <span className="date">Aug, 02-2017 </span>(8:40
                              PM)
                            </li>
                            <li>
                              <span>
                                <i className="fa fa-plane"></i>
                              </span>
                              <span className="date">Aug, 03-2017 </span>(8:40
                              PM)
                            </li>
                          </ul>
                        </div>

                        <div className="grid-btn">
                          <a
                            href="flight-detail-left-sidebar.html"
                            className="btn btn-orange btn-block btn-lg"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                    <div className="grid-block main-block f-grid-block">
                      <a href="flight-detail-left-sidebar.html">
                        <div className="main-img f-img">
                          <img
                            src={flightimage}
                            className="img-fluid"
                            alt="flight-img"
                          />
                        </div>
                      </a>

                      <div className="block-info f-grid-info">
                        <div className="f-grid-desc">
                          <span className="f-grid-time">
                            <i className="fa fa-clock-o"></i>6 hours - 30
                            minutes
                          </span>
                          <h3 className="block-title">
                            <a href="flight-detail-left-sidebar.html">
                              Sydney to Paris
                            </a>
                          </h3>
                          <p className="block-minor">
                            <span>Fr 5379,</span> Oneway Flight
                          </p>
                          <ul className="list-unstyled list-inline offer-price-1">
                            <li className="price">
                              $568.00<span className="divider">|</span>
                              <span className="pkg">2 Stay</span>
                            </li>
                          </ul>

                          <p>
                            Lorem ipsum dolor sit amet, ad duo fugit aeque
                            fabulas, in lucilius prodesset pri. Veniam delectus
                            ei{" "}
                          </p>
                        </div>

                        <div className="f-grid-timing">
                          <ul className="list-unstyled">
                            <li>
                              <span>
                                <i className="fa fa-plane"></i>
                              </span>
                              <span className="date">Aug, 02-2017 </span>(8:40
                              PM)
                            </li>
                            <li>
                              <span>
                                <i className="fa fa-plane"></i>
                              </span>
                              <span className="date">Aug, 03-2017 </span>(8:40
                              PM)
                            </li>
                          </ul>
                        </div>

                        <div className="grid-btn">
                          <a
                            href="flight-detail-left-sidebar.html"
                            className="btn btn-orange btn-block btn-lg"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         </div>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state) => ({
  flights: state.flights,
});

const mapDispatchToProps = {
  findFlights,
  fetchFlights,
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);