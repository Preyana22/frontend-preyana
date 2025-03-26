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
import hotelimage from "../../assets/images/coming-soon.png";
import planeIcon from "../../assets/images/planeIcon.svg";
import hotelIcon from "../../assets/images/hotel.svg";
import inoutimage from "../../assets/images/inoutimage.svg";
import locationimage from "../../assets/images/locationimage.svg";
import calendarimage from "../../assets/images/calendarimage.svg";
import destination_1 from "../../assets/images/destination_1.jpg";
import destination_2 from "../../assets/images/destination_2.jpg";
import coming_soon from "../../assets/images/coming_soon.jpg";
import { Alert, Carousel } from "react-bootstrap";
import "./search-flight.css";
import { debounce } from "lodash";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const isDate = (date) => {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};
// Get today's date in yyyy-mm-dd format
const today = new Date().toISOString().split("T")[0];

const ErrorLabel = (props) => {
  return <label style={{ color: "red" }}>{props.message}</label>;
};

var cabin_details = ["Economy", "Premium Economy", "Business", "First"];

const countryCodeMapping = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BR: "Brazil",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  CV: "Cabo Verde",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  KY: "Cayman Islands",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  KM: "Comoros",
  CD: "Democratic Republic of the Congo",
  CG: "Republic of the Congo",
  CR: "Costa Rica",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  SZ: "Eswatini",
  ET: "Ethiopia",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GR: "Greece",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "North Korea",
  KR: "South Korea",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Laos",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MR: "Mauritania",
  MU: "Mauritius",
  MX: "Mexico",
  FM: "Micronesia",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Romania",
  RU: "Russia",
  RW: "Rwanda",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  SS: "South Sudan",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syria",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TG: "Togo",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
};

const SearchFlight = ({ onSearch, ...props }) => {
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
  const [isRotated, setIsRotated] = useState(false);

  const handleSearch = async () => {
    if (typeof onSearch === "function") {
      onSearch(); // Call the search function to initiate loading

      // Simulate a delay to mimic fetching data
      await new Promise((resolve) => {
        // alert();
        setTimeout(resolve, 4000);
      });
      // You would replace this with actual API call and handle results
    } else {
      console.error("onSearch is not a function", onSearch);
    }
  };

  // Toggle dropdown open/close
  const toggleDropdown = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  // Handler for swapping origin and destination
  const handleSwap = () => {
    const originTemp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(originTemp);

    // Toggle rotation state
    setIsRotated(!isRotated);
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
      localStorage.removeItem("flightsData");
      localStorage.removeItem("searchCriteria");
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

  const [originAirports, setOriginAirports] = useState([]);
  const [destinationAirports, setDestinationAirports] = useState([]);

  const getAirports = debounce(async (search, type) => {
    if (!search) {
      // Clear previous results if search is blank
      type === "origin" ? setOriginAirports([]) : setDestinationAirports([]);
      return;
    }

    try {
      const { data } = await axios.get(apiUrl + `/airlines/airports/` + search);

      const airports = data.data
        ? data.data.map((t) => {
            const countryName =
              countryCodeMapping[t.iata_country_code] || "Unknown Country";
            const cityName = t.city_name || "";
            return t.iata_city_code == null
              ? "abc"
              : `${t.name}, ${cityName} (${t.iata_code}), ${countryName}`;
          })
        : [];

      // Set results for origin or destination based on the type parameter
      type === "origin"
        ? setOriginAirports(airports)
        : setDestinationAirports(airports);
    } catch (error) {
      console.log(error);
    }
  }, 300);

  const navigate = useNavigate();
  let origin, destination, cabinclass;
  let criteria;

  const [isReturn, setIsReturn] = useState(true);
  const [status, setFormValid] = useState({ isValid: false });

  let invalidFields = {};

  const getCabinClassValue = () => {
    const cabinClassElement = document.getElementById("cabinclass");
    const cabinClassValue = cabinClassElement ? cabinClassElement.value : "";
    return cabinClassValue;
  };

  // Function to extract the second part (after splitting and trimming)
  const getSecondPart = (stateText) => {
    const parts = stateText.split(","); // Split by commas
    let secondPart = parts[1]
      ? parts[1].replace(/\s*\(.*\)/, "").trim() // Remove "(IND)" if present
      : "";

    // If secondPart is empty, check for value inside brackets
    if (!secondPart) {
      const match = parts[1] ? parts[1].match(/\(([^)]+)\)/) : null;
      if (match && match[1]) {
        secondPart = match[1].trim(); // Get the matched value inside parentheses
      } else {
        console.log("No match found for second part");
      }
    }

    return secondPart;
  };

  const handleSubmit1 = (event) => {
    let cabinValue;
    const cabinClassValue = getCabinClassValue();

    if (cabinClassValue === "Premium Economy") {
      cabinValue = "premium_economy";
    } else {
      cabinValue = cabinClassValue;
    }

    event.preventDefault();
    const { flights } = props;
    invalidFields = {};
    let Adults = [];
    let adultsData = { type: "adult" };
    let childData = { type: "child" };
    let infantData = { type: "infant_without_seat" };

    for (var i = 1; i <= options.adult; i++) {
      Adults.push(adultsData);
    }
    for (var i = 1; i <= options.children; i++) {
      Adults.push(childData);
    }
    for (var i = 1; i <= options.infant; i++) {
      Adults.push(infantData);
    }

    const originStateText = origin.state.text;
    const originCode = originStateText
      ? originStateText.match(/\(([^)]+)\)/)[1]
      : "";
    const origin_city = originCode;

    const destinationStateText = destination.state.text;
    const destinationCode = destinationStateText
      ? destinationStateText.match(/\(([^)]+)\)/)[1]
      : "";
    const destination_city = destinationCode;

    const originparts = originStateText.split(","); // Split by commas

    // Get the second part for origin and destination
    const originSecondPart = getSecondPart(originStateText);
    const destinationSecondPart = getSecondPart(destinationStateText);

    if (isReturn === false) {
      criteria = {
        origin: origin_city,
        destination: destination_city,
        departureDate: event.target.dateOfDep.value,
        numOfPassengers: Adults,
        cabin_class: cabinValue,
        origin_city_name: originSecondPart,
        destination_city_name: destinationSecondPart,
      };
    } else {
      criteria = {
        origin: origin_city,
        destination: destination_city,
        departureDate: event.target.dateOfDep.value,
        returnDate: event.target.returnDate.value,
        numOfPassengers: Adults,
        cabin_class: cabinValue,
        origin_city_name: originSecondPart,
        destination_city_name: destinationSecondPart,
      };
    }

    if (!cabin_details.includes(cabinClassValue)) {
      invalidFields.cabinclass = true;
    }

    if (!criteria.departureDate || !isDate(criteria.departureDate)) {
      invalidFields.dateOfDep = true;
    } else {
      invalidFields.dateOfDep = false;
    }

    // Check if departure date is selected first
    if (isReturn) {
      if (!criteria.departureDate) {
        // Show validation if departure date is not selected
        invalidFields.dateOfDep =
          "Please select a departure date before the return date.";
      } else if (!criteria.returnDate || !isDate(criteria.returnDate)) {
        // Show validation if return date is invalid or not selected
        invalidFields.returnDate = "Please select a valid return date.";
      } else {
        // Clear validation if both dates are selected correctly
        invalidFields.dateOfDep = false;
        invalidFields.returnDate = false;
      }
    } else {
      // If it's a one-way trip, no need for return date validation
      invalidFields.returnDate = false;
    }

    if (!criteria.destination) {
      invalidFields.destination = true;
    } else {
      invalidFields.destination = false;
    }

    if (!criteria.origin) {
      invalidFields.origin = true;
    } else {
      invalidFields.origin = false;
    }

    if (
      criteria.origin &&
      criteria.destination &&
      criteria.origin === criteria.destination
    ) {
      invalidFields.destination = true;
    }

    // Only consider fields where the value is true
    const hasInvalidFields = Object.values(invalidFields).some(
      (value) => value
    );

    if (hasInvalidFields) {
      setFormValid({ isValid: false, ...invalidFields });
      return;
    }

    setFormValid({ isValid: true });
    props.findFlights({ flights, criteria });

    navigate("/results");
  };

  useEffect(() => {
    const type = "origin";
    getAirports(keyword, type);
    localStorage.setItem("options", JSON.stringify(options));
    localStorage.setItem("isReturn", JSON.stringify(isReturn)); // Store isReturn
    setSelectedCabinClass(cabin_details[0]);
    localStorage.setItem("cabinclass", JSON.stringify([cabin_details[0]]));
  }, [cabin_details, openOptions, options, isReturn]);
  // Handle tab click
  const [activeTab, setActiveTab] = useState("flights");
  const handleTabClick = (e, tabName) => {
    e.preventDefault();
    setActiveTab(tabName);
    
    if (tabName === "hotels") {
      // Hide flights-info-container completely
      const flightInfo = document.querySelector(".flights-info-container.row");
      const topdeal = document.getElementById("topdeal");
      if (topdeal) {
      
        topdeal.style.display = "none"; // Hide element completely
      }
      if (flightInfo) {
        flightInfo.classList.add("tab-pane", "fade");
        flightInfo.classList.add("tab-pane", "fade");
        // flightInfo.classList.add("tab-pane", "fade");
         flightInfo.style.display = "none"; // Hide element completely
      }
      // Navigate to "/"
    } 
    if (tabName === "flights") {
      // Show the flights-info-container when Flights tab is selected
      const flightInfo = document.querySelector(".flights-info-container.row");
      const topdeal = document.getElementById("topdeal");
      if (topdeal) {
        topdeal.style.display = ""; // Hide element completely
      }
      if (flightInfo) {
        flightInfo.classList.remove("tab-pane", "fade");
        flightInfo.style.display = "";
      }
    }
    
  };

  return (
    <>
      <div className="row pb-5">
        <div className="col-12 col-md-12 col-lg-5 col-xl-5 my-auto">
          <h2 className="font-weight-bold">
            Plan hassle-free travels to <br></br>your dream destinations
          </h2>
          <h4 className="font-weight-light sub-title-text">
            Preyana strives to ensure that your journey begins with genuine
            connections and authentic experiences.
          </h4>
        </div>
        <div className="col-12 col-md-12 col-lg-7 col-xl-7" id="banner-sec">
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
              <div className="col-md-12 p-0">
                <ul className="nav nav-tabs justify-content-left">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      href="#flights"
                      onClick={(e) => handleTabClick(e, "flights")}
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
                    <a className="nav-link" 
                      href="#hotels"  
                      onClick={(e) => handleTabClick(e, "hotels")} 
                      data-bs-toggle="tab">
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
                        <div className="row mt-0">
                          {/* Trip Type Selection */}
                          <div className="col-12 col-md-6 col-lg-4 col-xl-3 col-sm-12 col-xs-12">
                          <div className="form-group">

                          <Form.Group className="mb-0">
                            <Form.Check
                              inline
                              checked={isReturn}
                              type="radio"
                              label="Round Trip"
                              name="flightType"
                              id="formHorizontalRadios2"
                              onChange={() => setFlightType(true)}
                            />
                            <Form.Check
                              inline
                              style={{ marginLeft: '20px' }}
                              checked={!isReturn}
                              type="radio"
                              label="One Way"
                              name="flightType"
                              id="formHorizontalRadios1"
                              onChange={() => setFlightType(false)}
                            />
                          </Form.Group>
                        </div>

                          </div>

                          {/* Cabin Class Selection */}
                          <div className="col-12 col-md-6 col-lg-4 col-xl-3 col-sm-12 col-xs-12 ">
                            
                            <Form.Group controlId="cabinclass">
                              {/* <label
                                htmlFor="cabinclass"
                                className="form-label"
                              >
                                Cabin Class
                              </label> */}
                              <div className="select-container">
                                <Form.Control
                                  as="select"
                                  value={selectedCabinClass}
                                  onChange={handleCabinClassChange}
                                  onFocus={() => toggleDropdown(true)}
                                  onBlur={() => toggleDropdown(false)}
                                  className="border-0 bg-transparent"
                                >
                                  <option value="">Select Cabin Class</option>
                                  {cabin_details.map((cabin, index) => (
                                    <option key={index} value={cabin}>
                                      {cabin}
                                    </option>
                                  ))}
                                </Form.Control>
                                <i
                                  className={`cabin-arrow ${
                                    isDropdownOpen
                                      ? "fa fa-chevron-up"
                                      : "fa fa-chevron-down"
                                  }`}
                                  aria-hidden="true"
                                ></i>
                              </div>
                              {status.cabinclass && (
                                <ErrorLabel message="Please select cabin class" />
                              )}
                            </Form.Group>
                          </div>
                          

                          {/* Passengers Options */}
                          <div className="col-12 col-md-6 col-lg-4 col-xl-3 col-sm-12 col-xs-12">
                            <div className="form-group">
                              {/* <label
                                htmlFor="passengers"
                                className="form-label"
                              >
                                Passengers
                              </label> */}
                              <div
                                className="headerSearchItem"
                                ref={dropdownSearchRef}
                              >
                                {/* Passengers Options Arrow */}
                                <span
                                  onClick={() => setOpenOptions(!openOptions)}
                                  className={`headerSearchText ${
                                    openOptions
                                      ? "optionarrow-up"
                                      : "optionarrow-down"
                                  }`}
                                >
                                  <i className="fa fa-user"></i>{" "}
                                  {options.adult +
                                    options.children +
                                    options.infant ===
                                  1
                                    ? ` ${
                                        options.adult +
                                        options.children +
                                        options.infant
                                      } Traveler`
                                    : ` ${
                                        options.adult +
                                        options.children +
                                        options.infant
                                      } Travelers`}
                                  <i
                                    className={`passenger-arrow ${
                                      openOptions
                                        ? "fa fa-chevron-up"
                                        : "fa fa-chevron-down"
                                    }`}
                                    aria-hidden="true"
                                  ></i>
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
                                        <br />
                                        <small>(Ages 2 to 17)</small>
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
                                      <span className="optionText">
                                        Infant <br />
                                        <small>(under 2 years)</small>
                                      </span>
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
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                    <div className="form-group left-icon">
                                      <Form.Group controlId="origin">
                                        {/* <Form.Label>Origin</Form.Label> */}
                                        <Typeahead
                                          labelKey="origin"
                                          options={originAirports}
                                          placeholder="From"
                                          ref={(ref) => (origin = ref)}
                                          selected={selectedOrigin}
                                          onChange={handleOriginChange}
                                          onInputChange={(input) => {
                                            getAirports(input, "origin");
                                          }} // Calls getAirports when typing
                                          emptyLabel="Search by city or airport" // Custom message when no matches are found
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
                                    className="col-12 col-md-1 col-lg-1 col-xl-1 col-sm-12 col-xs-12 interchange-icon mb-3"
                                    onClick={handleSwap}
                                  >
                                    <img
                                      src={inoutimage}
                                      alt="swap icon"
                                      className={isRotated ? "rotated" : ""}
                                    />
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                    <div className="form-group left-icon">
                                      <Form.Group controlId="destination">
                                        {/* <Form.Label>Destination</Form.Label> */}
                                        <Typeahead
                                          labelKey="destination"
                                          options={destinationAirports}
                                          placeholder="To"
                                          ref={(ref) => (destination = ref)}
                                          selected={selectedDestination}
                                          onChange={handleDestinationChange}
                                          onInputChange={(input) => {
                                            getAirports(input, "destination");
                                          }} // Calls getAirports when typing
                                          emptyLabel="Search by city or airport" // Custom message when no matches are found
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

                                  <div className="col-12 col-md-12 col-lg-5 col-xl-5 col-sm-12 col-xs-12">
                                    <div className="row">
                                      <div className="col-12 col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                          <Form.Group controlId="formGriddateOfDep">
                                            {/* <Form.Label>
                                              Departure Date
                                            </Form.Label> */}
                                            <Form.Control
                                              type="date"
                                              className="form-control dpd1"
                                              name="dateOfDep"
                                              placeholder="Departure Date"
                                              // required
                                              min={today} // Set the minimum date to today
                                              value={selectedDateOfDep} // Bind the input value to the state
                                              onChange={handleDateOfDepChange}
                                            />
                                            {status.dateOfDep && (
                                              <ErrorLabel message="Please enter a valid depature date"></ErrorLabel>
                                            )}
                                            <img
                                              src={calendarimage}
                                              alt="from-to-image"
                                              className="input-icon"
                                            />
                                          </Form.Group>
                                        </div>
                                      </div>

                                      <div className="col-12 col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12">
                                        <div className="form-group">
                                          <Form.Group controlId="formGriddateOfReturn">
                                            {/* <Form.Label>Return Date</Form.Label> */}
                                            <Form.Control
                                              type="date"
                                              className="form-control dpd1"
                                              name="returnDate"
                                              // required
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
                                  <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                                    <button
                                      className="btn btn-orange searchbtn"
                                      onClick={handleSearch}
                                    >
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
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                    <div className="form-group left-icon">
                                      <Form.Group controlId="origin">
                                        {/* <Form.Label>Origin</Form.Label> */}
                                        <Typeahead
                                          labelKey="origin"
                                          options={originAirports}
                                          placeholder="From"
                                          ref={(ref) => (origin = ref)}
                                          selected={selectedOrigin} // Find the airport object based on selected IATA code
                                          onChange={handleOriginChange}
                                          onInputChange={(input) => {
                                            getAirports(input, "origin");
                                          }} // Calls getAirports when typing
                                          emptyLabel="Search by city or airport" // Custom message when no matches are found
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
                                    className="col-12 col-md-1 col-lg-1 col-xl-1 col-sm-12 col-xs-12 interchange-icon mb-3"
                                    onClick={handleSwap}
                                  >
                                    <img
                                      src={inoutimage}
                                      alt="swap icon"
                                      title="swap icon"
                                      className={isRotated ? "rotated" : ""}
                                    />
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                      <Form.Group controlId="destination">
                                        {/* <Form.Label>Destination</Form.Label> */}
                                        <Typeahead
                                          labelKey="destination"
                                          options={destinationAirports}
                                          placeholder="To"
                                          ref={(ref) => (destination = ref)}
                                          selected={selectedDestination}
                                          onChange={handleDestinationChange}
                                          onInputChange={(input) => {
                                            getAirports(input, "destination");
                                          }} // Calls getAirports when typing
                                          emptyLabel="Search by city or airport" // Custom message when no matches are found
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

                                  <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                      <Form.Group controlId="formGriddateOfDep">
                                        {/* <Form.Label>Departure Date</Form.Label> */}
                                        <Form.Control
                                          type="date"
                                          className="form-control dpd1"
                                          name="dateOfDep"
                                          placeholder="Departure Date"
                                          // required
                                          min={today} // Set the minimum date to today
                                          value={selectedDateOfDep} // Bind the input value to the state
                                          onChange={handleDateOfDepChange}
                                        />
                                        {status.dateOfDep && (
                                          <ErrorLabel message="Please enter a valid depature date"></ErrorLabel>
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
                                    <button
                                      className="btn btn-orange searchbtn"
                                      onClick={handleSearch}
                                      style={{ marginTop: "-0.2rem" }}
                                    >
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
                      <div className="col-12 col-md-12 col-lg-12 col-xl-12 mb-3">
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
                                src={coming_soon}
                                alt="First slide"
                              />
                            </Carousel.Item>
                            {/* <Carousel.Item>
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
                            </Carousel.Item> */}
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
