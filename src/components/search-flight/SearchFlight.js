import React, { useRef, useEffect, useState } from "react";
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
import sideimage from "../../assets/images/login-signup-signin-img.png";
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
import Select from "react-select";
import "./search-flight.css";
import { debounce } from "lodash";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const isDate = (date) => {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

const today = new Date().toISOString().split("T")[0];

const ErrorLabel = (props) => {
  return <label style={{ color: "red" }}>{props.message}</label>;
};

const cabin_details = ["Economy", "Premium Economy", "Business", "First"];
const cabinOptions = cabin_details.map((cabin, index) => ({
  value: index + 1,
  label: cabin,
}));

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
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    infant: 0,
  });
  const dropdownRef = useRef(null);
  const dropdownSearchRef = useRef(null);
  const [selectedCabinClass, setSelectedCabinClass] = useState(1);
  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [selectedDateOfDep, setSelectedDateOfDep] = useState("");
  const [selectedDateOfRet, setSelectedDateOfRet] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const [originAirports, setOriginAirports] = useState([]);
  const [destinationAirports, setDestinationAirports] = useState([]);

  const [isReturn, setIsReturn] = useState(true);
  const [status, setFormValid] = useState({ isValid: false });

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/search") {
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
    let savedDateOfDep = JSON.parse(localStorage.getItem("dateOfDeparture"));
    let savedDateOfRet = JSON.parse(localStorage.getItem("dateOfReturn"));
    if (savedDateOfDep == null) {
      const today = new Date();
      const departureDate = new Date();
      departureDate.setDate(today.getDate() + 2);
      savedDateOfDep = departureDate.toISOString().split("T")[0];
    }
    if (savedDateOfRet == null) {
      const today = new Date();
      const departureDate = new Date();
      departureDate.setDate(today.getDate() + 2);
      const arrivalDate = new Date(departureDate);
      arrivalDate.setDate(departureDate.getDate() + 7);
      savedDateOfRet = arrivalDate.toISOString().split("T")[0];
    }

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
      setSelectedCabinClass(Number(savedCabinClass));
    }
  }, [location.pathname]);

  const handleOriginChange = (selected) => {
    setSelectedOrigin(selected);
    localStorage.setItem("origin", JSON.stringify(selected));
  };

  const handleDestinationChange = (selected) => {
    setSelectedDestination(selected);
    localStorage.setItem("destination", JSON.stringify(selected));
  };

  const handleCabinClassChange = (event) => {
    const selectedCabin = event.target.value;
    setSelectedCabinClass(Number(selectedCabin));
    localStorage.setItem("cabinclass", selectedCabin);
    if (selectedCabin) {
      setFormValid({ isValid: true });
    } else {
      setFormValid({ isValid: false });
    }
  };

  const handleDateOfDepChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDateOfDep(selectedDate);

    // Calculate 10 days ahead for return date
    const depDate = new Date(selectedDate);
    depDate.setDate(depDate.getDate() + 10);
    const returnDate = depDate.toISOString().split("T")[0];

    setSelectedDateOfRet(returnDate);

    localStorage.setItem("dateOfDeparture", JSON.stringify(selectedDate));
  };

  const handleDateOfRetChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDateOfRet(selectedDate);
    localStorage.setItem("dateOfReturn", JSON.stringify(selectedDate));
  };

  const setFlightType = (value) => {
    setIsReturn(value);
    localStorage.setItem("isReturn", JSON.stringify(value));
  };

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
  }, []);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      let newValue;

      if (operation === "i") {
        if (name === "adult" && prev[name] < 6) {
          newValue = prev[name] + 1;
        } else if (name === "children" && prev[name] < 5) {
          newValue = prev[name] + 1;
        } else if (name === "infant" && prev[name] < 4) {
          newValue = prev[name] + 1;
        } else {
          newValue = prev[name];
        }
      } else {
        newValue = prev[name] - 1;
      }

      const updatedOptions = {
        ...prev,
        [name]: name === "adult" ? Math.max(1, newValue) : Math.max(0, newValue),
      };

      localStorage.setItem("options", JSON.stringify(updatedOptions));

      return updatedOptions;
    });
  };

  const getAirports = debounce(async (search, type) => {
    
    if (!search) {
      type === "origin" ? setOriginAirports([]) : setDestinationAirports([]);
      return;
    }
    try {
      const { data } = await axios.get(apiUrl + `/airlines/airports/` + search);

      const airports = data.data
        ? data.data
            .filter((t) => t.city_name != null)
            .map((t) => {
              const countryName =
                countryCodeMapping[t.iata_country_code] || "Unknown Country";
              return t.iata_city_code == null
                ? "abc"
                : `${t.iata_code} - ${t.city_name} - ${countryName} (${t.name})`;
            })
        : [];

      type === "origin"
        ? setOriginAirports(airports)
        : setDestinationAirports(airports);
    } catch (error) {
      console.log(error);
    }
  }, 300);

  // Swap origin and destination
  const handleSwap = () => {
    const originTemp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(originTemp);
    setIsRotated(!isRotated);
  };

  const getSecondPart = (stateText) => {
    const parts = stateText.split(",");
    let secondPart = parts[1]
      ? parts[1].replace(/\s*\(.*\)/, "").trim()
      : "";

    if (!secondPart) {
      const match = parts[1] ? parts[1].match(/\(([^)]+)\)/) : null;
      if (match && match[1]) {
        secondPart = match[1].trim();
      }
    }

    return secondPart;
  };

  const handleSubmit1 = (event) => {
    event.preventDefault();

    let cabinValue;
    switch (selectedCabinClass) {
      case 1:
        cabinValue = "economy";
        break;
      case 2:
        cabinValue = "premium_economy";
        break;
      case 3:
        cabinValue = "business";
        break;
      case 4:
        cabinValue = "first";
        break;
      default:
        cabinValue = "economy";
    }

    let Adults = [];
    let adultsData = { type: "adult" };
    let childData = { type: "child" };
    let infantData = { type: "infant_without_seat" };

    for (let i = 1; i <= options.adult; i++) {
      Adults.push(adultsData);
    }
    for (let i = 1; i <= options.children; i++) {
      Adults.push(childData);
    }
    for (let i = 1; i <= options.infant; i++) {
      Adults.push(infantData);
    }

    const originStateText = selectedOrigin[0]?.split(" - ")[1] || "";
    const originCode = selectedOrigin[0]?.split(" - ")[0] || "";
    const destinationStateText = selectedDestination[0]?.split(" - ")[1] || "";
    const destinationCode = selectedDestination[0]?.split(" - ")[0] || "";

    const originSecondPart = getSecondPart(originStateText);
    const destinationSecondPart = getSecondPart(destinationStateText);

    const criteria = isReturn
      ? {
          origin: originCode,
          destination: destinationCode,
          departureDate: event.target.dateOfDep.value,
          returnDate: event.target.returnDate.value,
          numOfPassengers: Adults,
          cabin_class: cabinValue,
          origin_city_name: originSecondPart,
          destination_city_name: destinationSecondPart,
        }
      : {
          origin: originCode,
          destination: destinationCode,
          departureDate: event.target.dateOfDep.value,
          numOfPassengers: Adults,
          cabin_class: cabinValue,
          origin_city_name: originSecondPart,
          destination_city_name: destinationSecondPart,
        };

    let invalidFields = {};

    if (!criteria.departureDate || !isDate(criteria.departureDate)) {
      invalidFields.dateOfDep = true;
    } else {
      invalidFields.dateOfDep = false;
    }

    if (isReturn) {
      if (!criteria.returnDate || !isDate(criteria.returnDate)) {
        invalidFields.returnDate = true;
      } else {
        invalidFields.returnDate = false;
      }
    } else {
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

    if (criteria.origin && criteria.destination && criteria.origin === criteria.destination) {
      invalidFields.destination = true;
    }

    const hasInvalidFields = Object.values(invalidFields).some((value) => value);

    if (hasInvalidFields) {
      setFormValid({ isValid: false, ...invalidFields });
      return;
    }

    setFormValid({ isValid: true });
    props.findFlights({ flights: props.flights, criteria });
    navigate("/results");
  };

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
    localStorage.setItem("isReturn", JSON.stringify(isReturn));
    localStorage.setItem("cabinclass", selectedCabinClass.toString());
  }, [options, isReturn, selectedCabinClass]);

  const [activeTab, setActiveTab] = useState("flights");
  const handleTabClick = (e, tabName) => {
    e.preventDefault();
    setActiveTab(tabName);

    const flightInfo = document.querySelector(".flights-info-container.row");
    const topdeal = document.getElementById("topdeal");

    if (tabName === "hotels") {
      if (topdeal) topdeal.style.display = "none";
      if (flightInfo) {
        flightInfo.classList.add("tab-pane", "fade");
        flightInfo.style.display = "none";
      }
    }
    if (tabName === "flights") {
      if (topdeal) topdeal.style.display = "";
      if (flightInfo) {
        flightInfo.classList.remove("tab-pane", "fade");
        flightInfo.style.display = "";
      }
    }
  };

  const handleSearch = async () => {
    if (typeof onSearch === "function") {
      onSearch();

      await new Promise((resolve) => {
        setTimeout(resolve, 40);
      });
    } else {
      console.error("onSearch is not a function", onSearch);
    }
  };

  return (
    <>
      <div className="row pb-5">
        <div className="col-12 col-md-12 col-lg-5 col-xl-5 my-auto">
          <h2 className="font-weight-bold">
            Plan hassle-free travels to <br />
            your dream destinations
          </h2>
          <h4 className="font-weight-light sub-title-text">
            Preyana strives to ensure that your journey begins with genuine connections and authentic experiences.
          </h4>
        </div>
        <div className="col-12 col-md-12 col-lg-7 col-xl-7" id="banner-sec">
          <img src={sideimage} className="img-fluid banner-image" alt="banner-img" />
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
                      className={`nav-link ${activeTab === "flights" ? "active" : ""}`}
                      href="#flights"
                      onClick={(e) => handleTabClick(e, "flights")}
                      data-bs-toggle="tab"
                    >
                      <span>
                        <img src={planeIcon} className="img-fluid plane_hotel_icon" alt="plane-img" />
                      </span>
                      <span className="d-md-inline-flex d-none st-text">Flights</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${activeTab === "hotels" ? "active" : ""}`}
                      href="#hotels"
                      onClick={(e) => handleTabClick(e, "hotels")}
                      data-bs-toggle="tab"
                    >
                      <span>
                        <img src={hotelIcon} className="img-fluid plane_hotel_icon" alt="hotel-img" />
                      </span>
                      <span className="d-md-inline-flex d-none st-text">Stays</span>
                    </a>
                  </li>
                </ul>

                <div className="tab-content">
                  {activeTab === "flights" && (
                    <div id="flights" className="tab-pane in active">
                      <div className="page-search-form">
                        <Form onSubmit={handleSubmit1}>
                          <div className="row mt-0">
                            {/* Trip Type Selection */}
                            <div className="col-12 col-md-6 col-lg-4 col-xl-3 col-sm-12 col-xs-12 space-info">
                              <Form.Group className="mb-0 checktrip">
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
                                  style={{ marginLeft: "20px" }}
                                  checked={!isReturn}
                                  type="radio"
                                  label="One Way"
                                  name="flightType"
                                  id="formHorizontalRadios1"
                                  onChange={() => setFlightType(false)}
                                />
                              </Form.Group>
                            </div>

                            {/* Cabin Class Selection */}
                            <div className="col-12 col-md-6 col-lg-4 col-xl-3 col-sm-12 col-xs-12 space-info">
                              <Form.Group controlId="cabinclass" style={{ width: "120px" }}>
                                <div className="select-container">
                                  <Select
                                    options={cabinOptions}
                                    value={
                                      cabinOptions.find(
                                        (option) => option.value === Number(selectedCabinClass)
                                      ) || null
                                    }
                                    onChange={(selectedOption) =>
                                      handleCabinClassChange({
                                        target: { value: selectedOption.value },
                                      })
                                    }
                                    onMenuOpen={() => setIsDropdownOpen(true)}
                                    onMenuClose={() => setIsDropdownOpen(false)}
                                    className="bg-transparent border-none focus:ring-0 shadow-none text-gray-700 zindex"
                                    isClearable={false}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        backgroundColor: "transparent",
                                        border: "none",
                                        boxShadow: "none",
                                        width: "200px",
                                      }),
                                      indicatorsContainer: (base) => ({
                                        ...base,
                                        display: "none",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        width: "200px",
                                      }),
                                    }}
                                  />
                                  <i
                                    className={`cabin-arrow ${
                                      isDropdownOpen ? "fa fa-chevron-up" : "fa fa-chevron-down"
                                    }`}
                                    aria-hidden="true"
                                  ></i>
                                </div>
                                {status?.cabinclass && (
                                  <ErrorLabel message="Please select cabin class" />
                                )}
                              </Form.Group>
                            </div>

                            {/* Passengers Options */}
                            <div className="col-12 col-md-6 col-lg-4 col-xl-3 col-sm-12 col-xs-12 space-info">
                              <div className="form-group" style={{ width: "160px" }}>
                                <div
                                  className="headerSearchItem"
                                  ref={dropdownSearchRef}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => setOpenOptions(!openOptions)}
                                >
                                  <span
                                    className={`headerSearchText d-flex align-items-center justify-between ${
                                      openOptions ? "optionarrow-up" : "optionarrow-down"
                                    }`}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                      <i className="fa fa-user mr-1" aria-hidden="true"></i>
                                      <span className="traveler-text">
                                        {options.adult + options.children + options.infant === 1
                                          ? ` ${options.adult + options.children + options.infant} Traveler`
                                          : ` ${options.adult + options.children + options.infant} Travelers`}
                                      </span>
                                    </div>
                                    <i
                                      className={`ml-2 passenger-arrow ${
                                        openOptions ? "fa fa-chevron-up" : "fa fa-chevron-down"
                                      }`}
                                      aria-hidden="true"
                                      style={{ pointerEvents: "none" }}
                                    ></i>
                                  </span>

                                  {openOptions && (
                                    <div className="options" style={{ width: "230px" }}>
                                      <div className="optionItem">
                                        <span className="optionText">Adult</span>
                                        <div className="optionCounter">
                                          <button
                                            type="button"
                                            disabled={options.adult <= 1}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("adult", "d")}
                                          >
                                            -
                                          </button>
                                          <span className="optionCounterNumber">{options.adult}</span>
                                          <button
                                            type="button"
                                            disabled={options.adult >= 6}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("adult", "i")}
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>

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
                                            onClick={() => handleOption("children", "d")}
                                          >
                                            -
                                          </button>
                                          <span className="optionCounterNumber">{options.children}</span>
                                          <button
                                            type="button"
                                            disabled={options.children >= 5}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("children", "i")}
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>

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
                                            onClick={() => handleOption("infant", "d")}
                                          >
                                            -
                                          </button>
                                          <span className="optionCounterNumber">{options.infant}</span>
                                          <button
                                            type="button"
                                            disabled={options.infant >= 4}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("infant", "i")}
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
                            {isReturn && (
                              <div id="tab-round-trip" className="tab-pane in active">
                                <div className="pg-search-form">
                                  <div className="row">
                                    <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                      <Form.Group controlId="origin" className="form-group left-icon">
                                        <Typeahead
                                          labelKey="origin"
                                          options={originAirports}
                                          placeholder="From"
                                          ref={originRef}
                                          selected={selectedOrigin}
                                          onChange={handleOriginChange}
                                          onInputChange={(input) => {
                                            getAirports(input, "origin");
                                          }}
                                          onFocus={e => e.target.select()}
                                          onClick={e => e.target.select()}
                                          emptyLabel="Search by city or airport"
                                          //  highlightOnlyResult={false}
                                          //   selectHintOnEnter={false}
                                          //   autoHighlight={false}
                                            hint={false}
                                        />
                                        {status.origin && (
                                          <ErrorLabel message="Please enter a valid airport" />
                                        )}
                                        <img src={locationimage} alt="from-to-image" className="input-icon" />
                                      </Form.Group>
                                    </div>

                                    <div
                                      className="col-12 col-md-1 col-lg-1 col-xl-1 col-sm-12 col-xs-12 interchange-icon mb-0 swap-button"
                                      onClick={handleSwap}
                                    >
                                      <img src={inoutimage} alt="swap icon" className={isRotated ? "rotated" : ""} />
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                      <Form.Group controlId="destination" className="form-group left-icon">
                                        <Typeahead
                                          labelKey="destination"
                                          options={destinationAirports}
                                          placeholder="To"
                                          ref={destinationRef}
                                          selected={selectedDestination}
                                          onChange={handleDestinationChange}
                                          onInputChange={(input) => {
                                            getAirports(input, "destination");
                                          }}
                                          onFocus={e => e.target.select()}
                                          onClick={e => e.target.select()}
                                          emptyLabel="Search by city or airport"                                         
                                        />
                                        {status.destination && (
                                          <ErrorLabel message="Please enter a valid airport" />
                                        )}
                                        <img src={locationimage} alt="from-to-image" className="input-icon" />
                                      </Form.Group>
                                    </div>

                                    <div className="col-12 col-lg-5 mb-0">
                                      <div className="row align-items-end gx-2">
                                        <div className="col-12 col-md-4 ">
                                          <Form.Group controlId="formGriddateOfDep" className="position-relative mb-3">
                                            <Form.Control
                                              type="date"
                                              name="dateOfDep"
                                              placeholder="Departure Date"
                                              min={today}
                                              value={selectedDateOfDep}
                                              onChange={handleDateOfDepChange}
                                              style={{minWidth:"150px"}}
                                            />
                                            {status.dateOfDep && (
                                              <ErrorLabel message="Please enter a valid departure date" />
                                            )}
                                            <img src={calendarimage} alt="calendar" className="input-icon" />
                                          </Form.Group>
                                        </div>

                                        <div className="col-12 col-md-4 ">
                                          <Form.Group controlId="formGriddateOfReturn" className="position-relative mb-3">
                                            <Form.Control
                                              type="date"
                                              name="returnDate"
                                              placeholder="Return Date"
                                              min={selectedDateOfDep}
                                              value={selectedDateOfRet}
                                              onChange={handleDateOfRetChange}
                                              style={{minWidth:"150px"}}
                                            />
                                            {status.returnDate && (
                                              <ErrorLabel message="Please enter a valid return date" />
                                            )}
                                            <img src={calendarimage} alt="calendar" className="input-icon" />
                                          </Form.Group>
                                        </div>

                                        <div className="col-12 col-md-4 d-flex justify-content-md-start justify-content-center mt-2 mt-md-0 mb-3" >
                                          <button className="btn btn-orange searchbtn "  
                                                        onClick={handleSearch}  
                                                        style={{
                                                          whiteSpace: "nowrap",
                                                          fontWeight: "bold",
                                                         
                                                        }}>
                                            Search
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {!isReturn && (
                              <div id="tab-one-way" className="tab-pane in active">
                                <div className="pg-search-form">
                                  <div className="row">
                                    <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                      <Form.Group controlId="origin" className="form-group left-icon">
                                        <Typeahead
                                          labelKey="origin"
                                          options={originAirports}
                                          placeholder="From"
                                          ref={originRef}
                                          selected={selectedOrigin}
                                          onChange={handleOriginChange}
                                          onInputChange={(input) => {
                                            getAirports(input, "origin");
                                          }}
                                          emptyLabel="Search by city or airport"
                                          onFocus={e => e.target.select()}
                                          onClick={e => e.target.select()}
                                        />
                                        {status.origin && (
                                          <ErrorLabel message="Please enter a valid airport" />
                                        )}
                                        <img src={locationimage} alt="from-to-image" className="input-icon" />
                                      </Form.Group>
                                    </div>

                                    <div
                                      className="col-12 col-md-1 col-lg-1 col-xl-1 col-sm-12 col-xs-12 interchange-icon2 mb-0 swap-button"
                                      onClick={handleSwap}
                                    >
                                      <img src={inoutimage} alt="swap icon" className={isRotated ? "rotated" : ""} />
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                      <Form.Group controlId="destination" className="form-group">
                                        <Typeahead
                                          labelKey="destination"
                                          options={destinationAirports}
                                          placeholder="To"
                                          ref={destinationRef}
                                          selected={selectedDestination}
                                          onChange={handleDestinationChange}
                                          onInputChange={(input) => {
                                            getAirports(input, "destination");
                                          }}
                                          onFocus={e => e.target.select()}
                                          onClick={e => e.target.select()}
                                          emptyLabel="Search by city or airport"
                                        />
                                        {status.destination && (
                                          <ErrorLabel message="Please enter a valid airport" />
                                        )}
                                        <img src={locationimage} alt="from-to-image" className="input-icon" />
                                      </Form.Group>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-sm-12 col-xs-12">
                                      <Form.Group controlId="formGriddateOfDep">
                                        <Form.Control
                                          type="date"
                                          name="dateOfDep"
                                          placeholder="Departure Date"
                                          min={today}
                                          value={selectedDateOfDep}
                                          onChange={handleDateOfDepChange}
                                          style={{minWidth:"100px"}}
                                        />
                                        {status.dateOfDep && (
                                          <ErrorLabel message="Please enter a valid departure date" />
                                        )}
                                        <img src={calendarimage} alt="from-to-image" className="input-icon" />
                                      </Form.Group>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-2 col-xl-1">
                                      <button className="btn btn-orange searchbtn" onClick={handleSearch} style={{ marginTop: "-0.2rem", marginLeft:"40px" }}>
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
                  )}

                  {activeTab === "hotels" && (
                    <div id="hotels" className="tab-pane in border-0">
                      <div className="m-4">
                        <div className="col-12 col-md-12 col-lg-12 col-xl-12 mb-3">
                          <h4>
                            <strong>Coming Soon!!!!</strong>
                          </h4>
                          <span>
                            Stay tuned to discover and book the perfect accommodations for your next adventure.
                          </span>
                        </div>
                        <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                          <div className="flex-content-img p-0">
                            <Carousel controls={false} indicators={false} interval={1500}>
                              <Carousel.Item>
                                <img style={{ height: "500px", width: "1000px" }} className="d-block w-100" src={coming_soon} alt="Coming soon" />
                              </Carousel.Item>
                            </Carousel>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
