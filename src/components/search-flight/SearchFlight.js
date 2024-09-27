import React from "react";
import { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Form from "react-bootstrap/Form";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { connect } from "react-redux";
import { findFlights, fetchFlights } from "../../actions";
import Button from "react-bootstrap/Button";
import { useLocation, useNavigate } from "react-router-dom";
import "../body.css";
import axios from "axios";
import flightimage from "../../assets/images/flightimage.svg";
import sideimage from "../../assets/images/banner.svg";
import planeIcon from "../../assets/images/planeIcon.svg";
import hotelIcon from "../../assets/images/hotel.svg";
import inoutimage from "../../assets/images/inoutimage.svg";
import locationimage from "../../assets/images/locationimage.svg";
import calendarimage from "../../assets/images/calendarimage.svg";
import destination_1 from "../../assets/images/destination_1.jpg";
import destination_2 from "../../assets/images/destination_2.jpg";
import { Carousel } from "react-bootstrap";
const isDate = (date) => {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};
// Get today's date in yyyy-mm-dd format
const today = new Date().toISOString().split("T")[0];

const ErrorLabel = (props) => {
  return <label style={{ color: "red" }}>{props.message}</label>;
};

export const SearchFlight = (props) => {
  const [airportsData, setAirports] = useState([]);
  const [openOptions, setOpenOptions] = useState(false);
  const [tripOptions, setTripOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    infant: 0,
  });

  const [selectedCabinClass, setSelectedCabinClass] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [selectedDateOfDep, setSelectedDateOfDep] = useState("");
  const [selectedDateOfRet, setSelectedDateOfRet] = useState("");
  // Clear localStorage when navigating to the home page
  const location = useLocation();
  // Load saved cabin class from localStorage on component mount
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "search") {
      localStorage.removeItem("cabinclass");
      localStorage.removeItem("origin");
      localStorage.removeItem("destination");
      localStorage.removeItem("dateOfDeparture");
      localStorage.removeItem("dateOfReturn");
      localStorage.removeItem("options");
      localStorage.removeItem("isReturn");
    }

    const savedCabinClass = localStorage.getItem("cabinclass");
    const savedOrigin = localStorage.getItem("origin");
    const savedDestination = localStorage.getItem("destination");
    const savedDateOfDep = JSON.parse(localStorage.getItem("dateOfDeparture"));
    const savedDateOfRet = JSON.parse(localStorage.getItem("dateOfReturn"));
    const storedOptions = localStorage.getItem("options");
    const storedTripType = localStorage.getItem("isReturn");

    if (storedTripType) {
      setIsReturn(JSON.parse(storedTripType));
    }

    if (storedOptions) {
      setOptions(JSON.parse(storedOptions));
    }

    if (savedDateOfDep) {
      setSelectedDateOfDep(savedDateOfDep);
    }

    if (savedDateOfRet) {
      setSelectedDateOfRet(savedDateOfRet);
    }

    if (savedOrigin) {
      setSelectedOrigin(JSON.parse(savedOrigin));
    }

    if (savedDestination) {
      setSelectedDestination(JSON.parse(savedDestination));
    }

    if (savedCabinClass) {
      setSelectedCabinClass(JSON.parse(savedCabinClass));
    }
  }, [location.pathname]);

  // Handle the change event of the Origin Typeahead
  const handleOriginChange = (selected) => {
    setSelectedOrigin(selected);
    localStorage.setItem("origin", JSON.stringify(selected));
  };

  // Handle the change event of the Destination Typeahead
  const handleDestinationChange = (selected) => {
    setSelectedDestination(selected);
    localStorage.setItem("destination", JSON.stringify(selected));
  };

  // Handle the change event of the Typeahead component
  const handleCabinClassChange = (selected) => {
    setSelectedCabinClass(selected);
    localStorage.setItem("cabinclass", JSON.stringify(selected));
  };

  const [dateOfDep, setDateOfDep] = useState("");
  const [returnDate, setDateOfRet] = useState("");
  // Handle dateOfDep change
  const handleDateOfDepChange = (event) => {
    const selectedDate = event.target.value; // Get the value directly
    setDateOfRet(selectedDate);
    setSelectedDateOfDep(selectedDate); // Set state directly
    localStorage.setItem("dateOfDeparture", JSON.stringify(selectedDate));
  };

  // Handle dateOfRet change
  const handleDateOfRetChange = (event) => {
    const selectedDate = event.target.value; // Get the value directly
    setDateOfRet(selectedDate);
    setSelectedDateOfRet(selectedDate); // Set state directly
    localStorage.setItem("dateOfReturn", JSON.stringify(selectedDate));
  };

  const setFlightType = (value) => {
    setIsReturn(value);
    // Store the selected trip type in local storage
    localStorage.setItem("isReturn", JSON.stringify(value));
  };

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      const newValue = operation === "i" ? prev[name] + 1 : prev[name] - 1;
      const updatedOptions = {
        ...prev,
        [name]:
          name === "adult" ? Math.max(1, newValue) : Math.max(0, newValue), // Ensuring adult is at least 1 and children/infants are at least 0
      };

      // Store the updated options in local storage
      localStorage.setItem("options", JSON.stringify(updatedOptions));

      return updatedOptions;
    });
  };

  useEffect(() => {
    const getAirports = async () => {
      try {
        const { data } = await axios.get(`http://192.168.1.92:3000/airports`);
        // console.log(data);
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
    // console.log("result1", result1);
    data1 = result1.map((t) => (t.city_name == null ? "abc" : t.iata_code));
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
  const airports = data1 ? data1 : dummyairports;
  // console.log("airports list" + airports);
  const navigate = useNavigate();
  let origin, destination, cabinclass;
  let criteria;

  const [isReturn, setIsReturn] = useState(false);
  const [status, setFormValid] = useState({ isValid: false });
  // console.log(status);
  let invalidFields = {};
  const handleSubmit1 = (event) => {
    let cabinValue;
    // console.log(cabinclass.state.text);
    if (cabinclass.state.text == "Premium Economy") {
      cabinValue = "premium_economy";
    } else {
      cabinValue = cabinclass.state.text;
    }
    // console.log(isReturn);
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
    // console.log(options);
    console.log(options.adult);
    for (var i = 1; i <= options.adult; i++) {
      // console.log(adultsData);
      Adults.push(adultsData);
    }
    for (var i = 1; i <= options.children; i++) {
      // console.log(childData);
      Adults.push(childData);
    }
    for (var i = 1; i <= options.infant; i++) {
      // console.log(infantData);
      Adults.push(infantData);
    }
    // console.log(Adults);
    // console.log("origin.state.text" + origin.state.text);
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
    // console.log(criteria);

    if (!cabin_details.includes(cabinclass.state.text)) {
      invalidFields.cabinclass = true;
    }

    if (!isDate(criteria.departureDate)) {
      invalidFields.departureDate = true;
    }
    if (!isDate(criteria.departureDate)) {
      invalidFields.departureDate = true;
    }

    if (!criteria.destination) {
      invalidFields.destination = true;
    }
    if (!criteria.origin) {
      invalidFields.origin = true;
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
    // console.log(criteria);
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
      <div className="row pb-5">
        <div className="col-12 col-md-5 col-lg-5 col-xl-5 my-auto">
          <h2 style={{ fontFamily: "Lato" }} className="font-weight-bold">
            Plan hassle-free travels to <br></br>your dream destinations
          </h2>
          <h4 className="font-weight-light sub-title-text">
            Preyana strives to ensure that your journey begins with genuine
            connections and authentic experiences.
          </h4>
        </div>
        <div className="col-12 col-md- col-lg-7 col-xl-7" id="banner-sec">
          <img
            src={sideimage}
            className="img-fluid banner-image"
            alt="banner-img"
            width={600}
            height={400}
          />
        </div>
      </div>
      <section className="flexslider-container mt-5">
        <div className="search-tabs" id="search-tabs-1">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <ul className="nav nav-tabs justify-content-left">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      href="#flights"
                      data-bs-toggle="tab"
                    >
                      <span>
                        <img
                          src={planeIcon}
                          className="img-fluid plane_hotel_icon"
                          alt="plane-img"
                        />
                      </span>
                      <span className="d-md-inline-flex d-none st-text">
                        Flights
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#hotels" data-bs-toggle="tab">
                      <span>
                        <img
                          src={hotelIcon}
                          className="img-fluid plane_hotel_icon"
                          alt="plane-img"
                        />
                      </span>
                      <span className="d-md-inline-flex d-none st-text">
                        Hotels
                      </span>
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div id="flights" className="tab-pane in active">
                    <div className="page-search-form">
                      <Form onSubmit={handleSubmit1}>
                        <div className="row mt-3">
                          <div className="col-12 col-md-6 col-lg-2 col-xl-2">
                            <div className="form-group">
                              <div className="headerSearchTripItem">
                                <span
                                  onClick={() => setTripOptions(!tripOptions)}
                                  className={`headerSearchTripText ${
                                    tripOptions ? "arrow-up" : "arrow-down"
                                  }`}
                                >
                                  {isReturn == true ? "Rounds Trip" : "One Way"}
                                </span>
                                {tripOptions && (
                                  <div className="tripoptions">
                                    <div className="tripoptionItem">
                                      <div className="tripoptionCounter">
                                        <Form.Group className="mb-0">
                                          <Form.Check
                                            inline
                                            checked={isReturn}
                                            type="radio"
                                            label="Round Trip"
                                            name="flightType"
                                            id="formHorizontalRadios2"
                                            onChange={(e) => {
                                              setFlightType(true);
                                              setTimeout(() => {
                                                setTripOptions(false);
                                              }, 100); // Delay hiding to ensure the selection is registered
                                            }}
                                          />
                                          <Form.Check
                                            inline
                                            checked={!isReturn}
                                            type="radio"
                                            label="One way"
                                            name="flightType"
                                            id="formHorizontalRadios1"
                                            onChange={(e) => {
                                              setFlightType(false);
                                              setTimeout(() => {
                                                setTripOptions(false);
                                              }, 100); // Delay hiding to ensure the selection is registered
                                            }}
                                          />
                                        </Form.Group>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-2 col-xl-2">
                            <Form.Group controlId="cabinclass">
                              <Typeahead
                                labelKey="cabinclass"
                                options={cabin_details}
                                id="cabinclass"
                                placeholder="Cabin Class"
                                ref={(ref) => (cabinclass = ref)}
                                selected={selectedCabinClass}
                                onChange={handleCabinClassChange}
                              />

                              {status.cabinclass && (
                                <ErrorLabel message="Please select cabin className"></ErrorLabel>
                              )}
                            </Form.Group>
                          </div>
                          <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                            <div className="form-group">
                              <div className="headerSearchItem">
                                <span
                                  onClick={() => setOpenOptions(!openOptions)}
                                  className={`headerSearchText ${
                                    openOptions
                                      ? "optionarrow-up"
                                      : "optionarrow-down"
                                  }`}
                                >
                                  {`${options.adult} adult · ${options.children} children · ${options.infant} infant`}
                                </span>
                                {openOptions && (
                                  <div className="options">
                                    <div className="optionItem">
                                      <span className="optionText">Adult</span>
                                      <div className="optionCounter">
                                        <button
                                          disabled={options.adult <= 1}
                                          className="optionCounterButton"
                                          onClick={() =>
                                            handleOption("adult", "d")
                                          }
                                        >
                                          -
                                        </button>
                                        <span className="optionCounterNumber">
                                          {options.adult}
                                        </span>
                                        <button
                                          className="optionCounterButton"
                                          onClick={() =>
                                            handleOption("adult", "i")
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    <div className="optionItem">
                                      <span className="optionText">
                                        Children
                                      </span>
                                      <div className="optionCounter">
                                        <button
                                          disabled={options.children <= 0}
                                          className="optionCounterButton"
                                          onClick={() =>
                                            handleOption("children", "d")
                                          }
                                        >
                                          -
                                        </button>
                                        <span className="optionCounterNumber">
                                          {options.children}
                                        </span>
                                        <button
                                          className="optionCounterButton"
                                          onClick={() =>
                                            handleOption("children", "i")
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    <div className="optionItem">
                                      <span className="optionText">Infant</span>
                                      <div className="optionCounter">
                                        <button
                                          disabled={options.infant <= 1}
                                          className="optionCounterButton"
                                          onClick={() =>
                                            handleOption("infant", "d")
                                          }
                                        >
                                          -
                                        </button>
                                        <span className="optionCounterNumber">
                                          {options.infant}
                                        </span>
                                        <button
                                          className="optionCounterButton"
                                          onClick={() =>
                                            handleOption("infant", "i")
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="tab-content">
                          {isReturn === true && (
                            <div
                              id="tab-round-trip"
                              className="tab-pane in active"
                            >
                              <div className="pg-search-form">
                                <div className="row">
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                                    <div className="form-group left-icon">
                                      <Form.Group controlId="origin">
                                        <Typeahead
                                          labelKey="origin"
                                          options={airports}
                                          placeholder="From"
                                          ref={(ref) => (origin = ref)}
                                          selected={selectedOrigin}
                                          onChange={handleOriginChange}
                                        />
                                        {status.origin && (
                                          <ErrorLabel message="Please enter a valid airport"></ErrorLabel>
                                        )}
                                        <img
                                          src={locationimage}
                                          alt="from-to-image"
                                          className="input-icon"
                                        />
                                      </Form.Group>
                                    </div>
                                  </div>
                                  <div className="">
                                    <img src={inoutimage} alt="from-to-image" />
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                                    <div className="form-group left-icon">
                                      <Form.Group controlId="destination">
                                        <Typeahead
                                          labelKey="destination"
                                          options={airports}
                                          placeholder="To"
                                          ref={(ref) => (destination = ref)}
                                          selected={selectedDestination}
                                          onChange={handleDestinationChange}
                                        />
                                        {status.destination && (
                                          <ErrorLabel message="Please enter a valid airport"></ErrorLabel>
                                        )}
                                        <img
                                          src={locationimage}
                                          alt="from-to-image"
                                          className="input-icon"
                                        />
                                      </Form.Group>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-12 col-lg-4 col-xl-4">
                                    <div className="row">
                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <Form.Group controlId="formGriddateOfDep">
                                            <Form.Control
                                              type="date"
                                              className="form-control dpd1"
                                              name="dateOfDep"
                                              placeholder="Departure Date"
                                              required
                                              min={today} // Set the minimum date to today
                                              value={selectedDateOfDep} // Bind the input value to the state
                                              onChange={handleDateOfDepChange}
                                            />
                                            {status.dateOfDep && (
                                              <ErrorLabel message="Please enter a valid return date"></ErrorLabel>
                                            )}
                                            <img
                                              src={calendarimage}
                                              alt="from-to-image"
                                              className="input-icon"
                                            />
                                          </Form.Group>
                                        </div>
                                      </div>

                                      <div className="col-6 col-md-6">
                                        <div className="form-group">
                                          <Form.Group controlId="formGriddateOfReturn">
                                            <Form.Control
                                              type="date"
                                              className="form-control dpd1"
                                              name="returnDate"
                                              required
                                              placeholder="Return Date"
                                              min={dateOfDep} // Set the minimum date to today
                                              value={selectedDateOfRet} // Bind the input value to the state
                                              onChange={handleDateOfRetChange}
                                            />
                                            {status.returnDate && (
                                              <ErrorLabel message="Please enter a valid return date"></ErrorLabel>
                                            )}

                                            <img
                                              src={calendarimage}
                                              alt="from-to-image"
                                              className="input-icon"
                                            />
                                          </Form.Group>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-12 col-lg-1 col-xl-1">
                                    <button className="btn btn-orange">
                                      Search
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {isReturn === false && (
                            <div
                              id="tab-one-way"
                              className="tab-pane in active"
                            >
                              <div className="pg-search-form">
                                <div className="row">
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                                    <div className="form-group left-icon">
                                      <Form.Group controlId="origin">
                                        <Typeahead
                                          labelKey="origin"
                                          options={airports}
                                          id="origin"
                                          placeholder="From"
                                          ref={(ref) => (origin = ref)}
                                          selected={selectedOrigin}
                                          onChange={handleOriginChange}
                                        />
                                        {status.origin && (
                                          <ErrorLabel message="Please enter a valid airport"></ErrorLabel>
                                        )}
                                        <img
                                          src={locationimage}
                                          alt="from-to-image"
                                          className="input-icon"
                                        />
                                      </Form.Group>
                                    </div>
                                  </div>
                                  <div className="">
                                    <img src={inoutimage} alt="from-to-image" />
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                                    <div className="form-group">
                                      <Form.Group controlId="destination">
                                        <Typeahead
                                          labelKey="destination"
                                          id="destination"
                                          options={airports}
                                          placeholder="To"
                                          ref={(ref) => (destination = ref)}
                                          selected={selectedDestination}
                                          onChange={handleDestinationChange}
                                        />
                                        {status.destination && (
                                          <ErrorLabel message="Please enter a valid airport"></ErrorLabel>
                                        )}

                                        <img
                                          src={locationimage}
                                          alt="from-to-image"
                                          className="input-icon"
                                        />
                                      </Form.Group>
                                    </div>
                                  </div>

                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                                    <div className="form-group">
                                      <Form.Group controlId="formGriddateOfDep">
                                        <Form.Control
                                          type="date"
                                          className="form-control dpd1"
                                          name="dateOfDep"
                                          placeholder="Departure Date"
                                          required
                                          min={today} // Set the minimum date to today
                                          value={selectedDateOfDep} // Bind the input value to the state
                                          onChange={handleDateOfDepChange}
                                        />
                                        {status.dateOfDep && (
                                          <ErrorLabel message="Please enter a valid return date"></ErrorLabel>
                                        )}
                                        <img
                                          src={calendarimage}
                                          alt="from-to-image"
                                          className="input-icon"
                                        />
                                      </Form.Group>
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-12 col-lg-1 col-xl-1">
                                    <button className="btn btn-orange">
                                      Search
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Form>
                    </div>
                  </div>
                  <div id="hotels" className="tab-pane in border-0">
                    <div className="m-4">
                      <div className="col-12 col-md-12 col-lg-12 col-xl-12 mb-5">
                        <h4>
                          <strong>Coming Soon!!!!</strong>
                        </h4>
                        <span>
                          Stay tuned to discover and book the perfect
                          accommodations for your next adventure.
                        </span>
                      </div>
                      <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="flex-content-img p-0">
                          <Carousel
                            controls={false}
                            indicators={false}
                            interval={1500}
                          >
                            <Carousel.Item>
                              <img
                                style={{ height: "500px", width: "1000px" }}
                                className="d-block w-100"
                                src={sideimage}
                                alt="First slide"
                              />
                            </Carousel.Item>
                            <Carousel.Item>
                              <img
                                style={{ height: "500px", width: "1000px" }}
                                className="d-block"
                                src={destination_1}
                                alt="Second slide"
                              />
                            </Carousel.Item>
                            <Carousel.Item>
                              <img
                                style={{ height: "500px", width: "1000px" }}
                                className="d-block"
                                src={destination_2}
                                alt="Third slide"
                              />
                            </Carousel.Item>
                          </Carousel>

                          {/* <img
                      src={sideimage}
                      className="img-fluid custom-form-img"
                      alt="registration-img"
                    /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchFlight);
