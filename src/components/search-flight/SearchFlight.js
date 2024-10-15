import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Form from "react-bootstrap/Form";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { connect } from "react-redux";
import { findFlights } from "../../actions";
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

var cabin_details = ["Economy", "Premium Economy", "Business", "First"];

export const SearchFlight = (props) => {
  const [airportsData, setAirports] = useState([]);
  const [openOptions, setOpenOptions] = useState(false);
  const [tripOptions, setTripOptions] = useState(false);
  const [keyword, setKeyword] = useState("IN");
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    infant: 0,
  });
  const dropdownRef = useRef(null);
  const dropdownSearchRef = useRef(null);
  const [selectedCabinClass, setSelectedCabinClass] = useState();
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [selectedDateOfDep, setSelectedDateOfDep] = useState("");
  const [selectedDateOfRet, setSelectedDateOfRet] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown open/close
  const toggleDropdown = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  // Handler for swapping origin and destination
  const handleSwap = () => {
    const originTemp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(originTemp);
  };

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

  const handleCabinClassChange = (event) => {
    const selectedCabin = event.target.value;
    setSelectedCabinClass(selectedCabin);

    localStorage.setItem("cabinclass", JSON.stringify([selectedCabin]));

    // Update status based on whether a selection was made
    if (selectedCabin) {
      setFormValid({ isValid: false });
    } else {
      setFormValid({ isValid: true });
    }
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

  // Close the dropdown if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTripOptions(false);
      }
      if (
        dropdownSearchRef.current &&
        !dropdownSearchRef.current.contains(event.target)
      ) {
        setOpenOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, dropdownSearchRef]);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      let newValue;

      // Determine the new value based on the operation
      if (operation === "i") {
        // Increment, but restrict based on max values
        if (name === "adult" && prev[name] < 6) {
          newValue = prev[name] + 1;
        } else if (name === "children" && prev[name] < 5) {
          newValue = prev[name] + 1;
        } else if (name === "infant" && prev[name] < 4) {
          newValue = prev[name] + 1;
        } else {
          newValue = prev[name]; // No change if limit is reached
        }
      } else {
        // Decrement, but restrict adult to minimum 1 and children/infants to minimum 0
        newValue = prev[name] - 1;
      }

      // Make sure the values don't fall below the minimums
      const updatedOptions = {
        ...prev,
        [name]:
          name === "adult" ? Math.max(1, newValue) : Math.max(0, newValue),
      };

      // Store the updated options in local storage
      localStorage.setItem("options", JSON.stringify(updatedOptions));

      return updatedOptions;
    });
  };

  const getAirports = async (search) => {
    if (!search) {
      // If search is blank, null, or undefined, do not proceed
      return;
    }
    try {
      const { data } = await axios.get(
        `http://192.168.1.92:3000/airlines/airports/` + search
      );

      if (data.data) {
        // console.log("result1", result1);
        //  t.iata_city_code == null ? "abc" : t.name + "(" + t.iata_code + ")";
        setAirports(
          data.data.map((t) =>
            t.iata_city_code == null ? "abc" : t.name + " (" + t.iata_code + ")"
          )
        );

        //data1 = result1.map(t=>t.IATAcode==null?'abc':t.IATAcode);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  let origin, destination, cabinclass;
  let criteria;

  const [isReturn, setIsReturn] = useState(false);
  const [status, setFormValid] = useState({ isValid: false });
  // console.log(status);
  let invalidFields = {};

  const getCabinClassValue = () => {
    const cabinClassElement = document.getElementById("cabinclass");
    const cabinClassValue = cabinClassElement ? cabinClassElement.value : "";
    return cabinClassValue;
  };
  const handleSubmit1 = (event) => {
    let cabinValue;
    const cabinClassValue = getCabinClassValue();

    if (cabinClassValue == "Premium Economy") {
      cabinValue = "premium_economy";
    } else {
      cabinValue = cabinClassValue;
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

    const originStateText = origin.state.text;
    const originCode = originStateText.match(/\(([^)]+)\)/)[1]; // Extracts the code within parentheses
    console.log(originCode); // Output: IND
    const origin_city = originCode;

    const destinationStateText = destination.state.text;
    const destinationCode = destinationStateText.match(/\(([^)]+)\)/)[1]; // Extracts the code within parentheses
    console.log(destinationCode); // Output: IND

    const destination_city = destinationCode;

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

    if (!cabin_details.includes(cabinClassValue)) {
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

    // Check if origin and destination are the same
    if (
      criteria.origin &&
      criteria.destination &&
      criteria.origin === criteria.destination
    ) {
      invalidFields.destination = true;
    }

    if (Object.keys(invalidFields).length > 0) {
      setFormValid({ isValid: false, ...invalidFields });
      return;
    }

    setFormValid({ isValid: true });

    props.findFlights({ flights, criteria });
    console.log("flights", flights);
    console.log("criteria", criteria);
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
        cabin_class: selectedCabinClass,
      };
    } else {
      criteria = {
        origin: origin.state.text,
        destination: destination.state.text,
        departureDate: event.target.dateOfDep.value,
        returnDate: event.target.dateOfReturn.value,
        numOfPassengers: event.target.numOfPassengers.value,
        cabin_class: selectedCabinClass,
      };
    }
    // console.log(criteria);
    /* if (event.target.flightType[1].checked ) {
        criteria.returnDate = event.target.dateOfReturn.value;
        if (!isDate(event.target.dateOfReturn.value)) {
          invalidFields.returnDate = true;
        }
      }*/

    if (!airportsData.includes(criteria.origin)) {
      invalidFields.origin = true;
    }
    if (
      !airportsData.includes(criteria.destination) ||
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

  // Set the first option as selected when cabin_details changes
  useEffect(() => {
    getAirports(keyword);
    // if (cabin_details.length > 0) {
    //   const cabinclass = [cabin_details[0]];
    //   setSelectedCabinClass(cabinclass);
    //   localStorage.setItem("cabinclass", JSON.stringify(cabinclass));
    // }
    localStorage.setItem("options", JSON.stringify(options));
    localStorage.setItem("isReturn", JSON.stringify(isReturn)); // Store isReturn
  }, [cabin_details, openOptions, options, isReturn]);

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
                          {/* Trip Type Selection */}
                          <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                            <div className="form-group">
                              <label htmlFor="tripType" className="form-label">
                                Trip Type
                              </label>
                              <div
                                className="headerSearchTripItem"
                                ref={dropdownRef}
                              >
                                <span
                                  onClick={() => setTripOptions(!tripOptions)}
                                  className={`headerSearchTripText ${
                                    tripOptions ? "arrow-up" : "arrow-down"
                                  }`}
                                >
                                  {isReturn ? "Round Trip" : "One Way"}
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
                                              }, 100);
                                            }}
                                          />
                                          <Form.Check
                                            inline
                                            checked={!isReturn}
                                            type="radio"
                                            label="One Way"
                                            name="flightType"
                                            id="formHorizontalRadios1"
                                            onChange={(e) => {
                                              setFlightType(false);
                                              setTimeout(() => {
                                                setTripOptions(false);
                                              }, 100);
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

                          {/* Cabin Class Selection */}
                          <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                            <Form.Group controlId="cabinclass">
                              <label
                                htmlFor="cabinclass"
                                className="form-label"
                              >
                                Cabin Class
                              </label>
                              <div className="select-container">
                                <Form.Control
                                  as="select"
                                  value={selectedCabinClass}
                                  onChange={handleCabinClassChange}
                                  onFocus={() => toggleDropdown(true)}
                                  onBlur={() => toggleDropdown(false)}
                                >
                                  <option value="">Select Cabin Class</option>
                                  {cabin_details.map((cabin, index) => (
                                    <option key={index} value={cabin}>
                                      {cabin}
                                    </option>
                                  ))}
                                </Form.Control>
                                <span
                                  className={`arrow ${
                                    isDropdownOpen
                                      ? "cabinarrow-up"
                                      : "cabinarrow-down"
                                  }`}
                                ></span>
                              </div>
                              {status.cabinclass && (
                                <ErrorLabel message="Please select cabin class" />
                              )}
                            </Form.Group>
                          </div>

                          {/* Passengers Options */}
                          <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                            <div className="form-group">
                              <label
                                htmlFor="passengers"
                                className="form-label"
                              >
                                Passengers
                              </label>
                              <div
                                className="headerSearchItem"
                                ref={dropdownSearchRef}
                              >
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
                                    {/* Adult Counter */}
                                    <div className="optionItem">
                                      <span className="optionText">Adult</span>
                                      <div className="optionCounter">
                                        <button
                                          type="button"
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
                                          type="button"
                                          disabled={options.adult >= 6}
                                          className="optionCounterButton"
                                          onClick={() =>
                                            handleOption("adult", "i")
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    {/* Children Counter */}
                                    <div className="optionItem">
                                      <span className="optionText">
                                        Children
                                      </span>
                                      <div className="optionCounter">
                                        <button
                                          type="button"
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
                                          type="button"
                                          disabled={options.children >= 5}
                                          className="optionCounterButton"
                                          onClick={() =>
                                            handleOption("children", "i")
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>

                                    {/* Infant Counter */}
                                    <div className="optionItem">
                                      <span className="optionText">Infant</span>
                                      <div className="optionCounter">
                                        <button
                                          type="button"
                                          disabled={options.infant <= 0}
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
                                          type="button"
                                          disabled={options.infant >= 4}
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
                                        <Form.Label>Origin</Form.Label>
                                        <Typeahead
                                          labelKey="origin"
                                          options={airportsData}
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
                                  {/* Swap Button */}
                                  <div
                                    className="col-12 col-md-1 col-lg-1 col-xl-1 interchange-icon"
                                    onClick={handleSwap}
                                  >
                                    <img src={inoutimage} alt="swap icon" />
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                                    <div className="form-group left-icon">
                                      <Form.Group controlId="destination">
                                        <Form.Label>Destination</Form.Label>
                                        <Typeahead
                                          labelKey="destination"
                                          options={airportsData}
                                          placeholder="To"
                                          ref={(ref) => (destination = ref)}
                                          selected={selectedDestination}
                                          onChange={handleDestinationChange}
                                          onInputChange={(input) => {
                                            getAirports(input);
                                          }} // Calls getAirports when typing
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
                                            <Form.Label>
                                              Departure Date
                                            </Form.Label>
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
                                            <Form.Label>Return Date</Form.Label>
                                            <Form.Control
                                              type="date"
                                              className="form-control dpd1"
                                              name="returnDate"
                                              required
                                              placeholder="Return Date"
                                              min={selectedDateOfDep} // Set the minimum date to the selected departure date
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
                                    <button className="btn btn-orange searchbtn">
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
                                        <Form.Label>Origin</Form.Label>
                                        <Typeahead
                                          labelKey="origin"
                                          options={airportsData}
                                          id="origin"
                                          placeholder="From"
                                          ref={(ref) => (origin = ref)}
                                          selected={selectedOrigin} // Find the airport object based on selected IATA code
                                          onChange={handleOriginChange}
                                          onInputChange={(input) => {
                                            getAirports(input);
                                          }} // Calls getAirports when typing
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
                                  {/* Swap Button */}
                                  <div
                                    className="col-12 col-md-1 col-lg-1 col-xl-1 interchange-icon"
                                    onClick={handleSwap}
                                  >
                                    <img src={inoutimage} alt="swap icon" />
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3">
                                    <div className="form-group">
                                      <Form.Group controlId="destination">
                                        <Form.Label>Destination</Form.Label>
                                        <Typeahead
                                          labelKey="destination"
                                          id="destination"
                                          options={airportsData}
                                          placeholder="To"
                                          ref={(ref) => (destination = ref)}
                                          selected={selectedDestination}
                                          onChange={handleDestinationChange}
                                          onInputChange={(input) => {
                                            getAirports(input);
                                          }} // Calls getAirports when typing
                                        />
                                        {status.destination && (
                                          <ErrorLabel message="Please enter a valid airport"></ErrorLabel>
                                        )}
                                        {status.sameLocation && (
                                          <ErrorLabel message="Please select different location"></ErrorLabel>
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
                                        <Form.Label>Departure Date</Form.Label>
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
                                    <button className="btn btn-orange searchbtn">
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
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchFlight);
