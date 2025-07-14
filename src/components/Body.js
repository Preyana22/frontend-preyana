import React from "react";
import { useEffect, useState } from "react";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { connect } from "react-redux";
import { findFlights } from "../actions";
import { useNavigate } from "react-router-dom";
import "./body.css";
import axios from "axios";
import flightimage from "../assets/images/flightimage.png";
import SearchFlight from "./search-flight/SearchFlight";
const apiUrl = process.env.REACT_APP_API_BASE_URL;
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

const isDate = (date) => {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

// const ErrorLabel = (props) => {
//   return <label style={{ color: "red" }}>{props.message}</label>;
// };

export const Body = (props) => {
  const [airportsData, setAirports] = useState([]);
  const [flightsData, setFlightsData] = useState([]);
  const [originCode, setOriginCode] = useState(null);
  const [domesticFlights, setDomesticFlights] = useState([]);
  const [internationalFlights, setInternationalFlights] = useState([]);

  const [loading, setLoading] = useState(false);


  

  const formatFlightDate = (dateString) => {
    const date = new Date(dateString);

    // Get the month abbreviation, year, and time
    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    const yearFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric" });
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const month = monthFormatter.format(date).toUpperCase();
    const year = yearFormatter.format(date);
    const time = timeFormatter.format(date);

    // Extract day and format the final output
    const day = date.getDate().toString().padStart(2, "0"); // Ensures two digits
    return `${month}, ${day}-${year} (${time})`;
  };

  // const formatDuration = (duration) => {
  //   // Match the duration format P1DT2H20M
  //   const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/;
  //   const matches = duration.match(regex);

  //   const days = matches[1]
  //     ? `${matches[1]} day${matches[1] > 1 ? "s" : ""}`
  //     : "";
  //   const hours = matches[2]
  //     ? `${matches[2]} hour${matches[2] > 1 ? "s" : ""}`
  //     : "";
  //   const minutes = matches[3]
  //     ? `${matches[3]} minute${matches[3] > 1 ? "s" : ""}`
  //     : "";

  //   // Join the parts together
  //   return [days, hours, minutes].filter(Boolean).join(", ");
  // };
  const formatDuration = (duration) => {
  if (!duration || typeof duration !== 'string') {
    console.warn('Invalid duration input:', duration);
    return '';
  }

  // Match the duration format P1DT2H20M
  const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = duration.match(regex);

  if (!matches) {
    console.warn('Duration format mismatch:', duration);
    return '';
  }

  const days = matches[1]
    ? `${matches[1]} day${parseInt(matches[1]) > 1 ? "s" : ""}`
    : "";
  const hours = matches[2]
    ? `${matches[2]} hour${parseInt(matches[2]) > 1 ? "s" : ""}`
    : "";
  const minutes = matches[3]
    ? `${matches[3]} minute${parseInt(matches[3]) > 1 ? "s" : ""}`
    : "";

  return [days, hours, minutes].filter(Boolean).join(", ");
 };


  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    infant: 0,
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
    // const getAirports = async () => {
    //   try {
    //     const { data } = await axios.get(
    //       apiUrl + `/airlines/airports`
    //     );
    //     console.log(data);
    //     setAirports(data);
    //     // setAirports(data.results);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // getAirports();

    getFlights();
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
  // console.log("airports" + airports);
  const navigate = useNavigate();
  let origin, destination, cabinclass;
  let criteria;

  const [isReturn, setFlightType] = useState(false);
  const [status, setFormValid] = useState({ isValid: false });
  // console.log(status);
  let invalidFields = {};
  const handleSubmit1 = (event, slice) => {
    event.preventDefault(); // Prevent default form submission

    const { flights } = props;
    const Adults = []; // Array to hold passenger data

    // Passenger data structures
    const adultsData = { type: "adult" };
    const childData = { type: "child" };
    const infantData = { type: "infant_without_seat" };

    // console.log(options); // Log options for debugging
    // console.log(options.adult);

    // Populate the Adults array based on the number of each passenger type
    for (let i = 0; i < options.adult; i++) {
      Adults.push(adultsData);
    }
    for (let i = 0; i < options.children; i++) {
      Adults.push(childData);
    }
    for (let i = 0; i < options.infant; i++) {
      Adults.push(infantData);
    }

    // console.log(Adults); // Log the populated Adults array for debugging

    // Define origin and destination cities
    const origin_city = slice.origin.iata_code; // Example origin city
    const destination_city = slice.destination.iata_code; // Example destination city
    const cabinclass = "Economy"; // Example destination city

    // Format today's date as YYYY-MM-DD
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const originCombine = `${slice.origin.name}, ${slice.origin.city_name} (${
      slice.origin.iata_code
    }), ${
      countryCodeMapping[slice.origin.iata_country_code] || "Unknown Country"
    }`;
    const destinationCombine = `${slice.destination.name}, ${
      slice.destination.city_name
    } (${slice.destination.iata_code}), ${
      countryCodeMapping[slice.destination.iata_country_code] ||
      "Unknown Country"
    }`;
    // Wrap the origin city in an array
    const originArray = [originCombine];
    const destinationArray = [destinationCombine]; // Example destination city

    // Function to extract the second part (after splitting and trimming)
    const getSecondPart = (stateText) => {
      console.log(stateText);
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
    // Get the second part for origin and destination
    const originSecondPart = getSecondPart(originCombine);
    const destinationSecondPart = getSecondPart(destinationCombine);

    // Construct the search criteria object
    const criteria = {
      origin: origin_city,
      destination: destination_city,
      departureDate: formattedDate,
      numOfPassengers: Adults, // List of passengers
      cabin_class: cabinclass, // Cabin class (could also be a state or prop)
      origin_city_name: originSecondPart,
      destination_city_name: destinationSecondPart,
    };

    const cabinclassArray = [cabinclass]; // Example destination city

    // Store the array in local storage as a JSON string
    localStorage.setItem("origin", JSON.stringify(originArray));
    localStorage.setItem("destination", JSON.stringify(destinationArray));
    localStorage.setItem("cabinclass", JSON.stringify(cabinclassArray));
    localStorage.setItem("isReturn", false);
    localStorage.setItem("dateOfDeparture", JSON.stringify(formattedDate));

    // console.log(criteria); // Log criteria for debugging

    // Call the findFlights function with the gathered criteria
    props.findFlights({ flights, criteria });

    // Navigate to results page
    navigate("/results");
  };

  const cabin_details = ["Economy", "Premium Economy", "Business", "First"];

  const getFlights = async () => {
    setLoading(true);
    try {
      const { flights } = props;

      let Adults = [];

      // Mock options data (since it's not defined in the original code)
      const options = {
        adult: 1, // Number of adults
        children: 0, // Number of children
        infant: 0, // Number of infants
      };

      // Data for different passenger types
      const adultsData = { type: "adult" };
      const childData = { type: "child" };
      const infantData = { type: "infant_without_seat" };

      // Add adults
      for (let i = 1; i <= options.adult; i++) {
        Adults.push(adultsData);
      }
      // Add children
      for (let i = 1; i <= options.children; i++) {
        Adults.push(childData);
      }
      // Add infants
      for (let i = 1; i <= options.infant; i++) {
        Adults.push(infantData);
      }

      // Request options for the fetch API
      const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(criteria),
        };
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const userIP = data.ip;
        console.log("IP",userIP);
        const routes1 = async () => {
          try {
          console.log("Fetching nearest airports...");
          const response = await axios.get(apiUrl + `/airlines/nearestAirports/${userIP}`);

          // console.log("--------");
          console.log(response.data);
          // console.log("Nearest airports fetched successfully.");

          return response.data;
        } catch (error) {
          console.error("Error fetching nearest airports:", error);
        }
      };
      const originTopDestinations = await routes1();
      console.log("originTopDestinations", originTopDestinations.iata_code);
      setOriginCode(originTopDestinations.iata_code);
      setDomesticFlights(originTopDestinations.domestic);
      setInternationalFlights(originTopDestinations.international);
      
      // Define route pairs with IATA codes
      const routes = [
        { origin: originTopDestinations.iata_code, destination: originTopDestinations.domestic[0] },
        { origin: originTopDestinations.iata_code, destination: originTopDestinations.domestic[1] },
        { origin: originTopDestinations.iata_code, destination: originTopDestinations.domestic[2] },
        { origin: originTopDestinations.iata_code, destination: originTopDestinations.domestic[3] },

        { origin: originTopDestinations.iata_code, destination: originTopDestinations.international[4] },
        { origin: originTopDestinations.iata_code, destination: originTopDestinations.international[1] },
        { origin: originTopDestinations.iata_code, destination: originTopDestinations.international[2] },
        { origin: originTopDestinations.iata_code, destination: originTopDestinations.international[3] },
      ];

      // Format today's date as YYYY-MM-DD
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const formattedDate = tomorrow.toISOString().split("T")[0];

      // Create an array of promises for all fetch requests
          const fetchRequests = routes.map(async (route) => {
          const { origin, destination } = route;
          const criteria = {
            origin,
            destination,
            departureDate: formattedDate,
            numOfPassengers: Adults,
            cabin_class: "Economy",
          };

          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(criteria),
          };

          try {
            const response = await fetch(apiUrl + "/airlines/test", requestOptions);
            if (!response.ok) {
              console.warn(`Request failed for ${origin}-${destination}:`, response.status);
              return null;  // Return null so we can filter it out
            }
            const flightsdata = await response.json();
            return flightsdata[1] || [];  // Return the offers array or empty array
          } catch (err) {
            console.error(`Fetch error for ${origin}-${destination}:`, err);
            return null;  // Return null on error
          }
        });

        // Run all in parallel
        const results = await Promise.allSettled(fetchRequests);

        // Collect successful results
        const validFlights = results
          .filter(r => r.status === 'fulfilled' && r.value !== null)
          .map(r => r.value)
          .flat();
   

        setFlightsData(prev => [...prev, ...validFlights]);


    } catch (error) {
      // Log the error if the fetch request fails
      console.error("Error during fetch:", error);
    }
     finally {
    setLoading(false); // Hide loader when done
  }
  };

  // function calculatePriceWithMarkup(baseAmount, taxAmount) {
  //   const base_amount = Number(baseAmount);
  //   const markupPercent=Number(process.env.REACT_APP_MARKUP_PERCENT);
  //   const markup = Number(base_amount) * markupPercent;
  //   const baseprice = base_amount + markup;
  //   const tax_amount = Number(taxAmount);
  //   const price = baseprice + tax_amount;

  //   return price.toFixed(2); // Formats to two decimal places
  // }

  return (
    <>
      <section className="innerpage-wrapper">
        <div id="search-result-page" className="">
          <div className="container">
            <SearchFlight />
            <div className="row" id="topdeal">
              <div className="col-12 col-md-12 col-lg-12 col-xl-12 content-side">
                <div className="row pb-4 mb-5">
                  <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                    <h3 className="font-weight-bold">
                      Top Destinations
                    </h3>
                  </div>
                </div>
                {loading ? (
                    <div className="loader-container">
                {/* <div className="loader"></div> */}
                <div className="loader-bounce">
    <span></span><span></span><span></span><span></span>
  </div>
                {/* <div className="loading-text">Loading Top destination...</div>  */}
              </div>
                  ) : (
                    <>
                        <div className="row">
                 
                  {flightsData && originCode &&
                  
                    // Group flights by route and map one record per route
                    [`${originCode}-${domesticFlights[0]}`, `${originCode}-${domesticFlights[1]}`, `${originCode}-${domesticFlights[2]}`, `${originCode}-${domesticFlights[3]}`].map(
               
                      (route) => {
                        // Find the first flight for the current route
                        const flight = flightsData.find(
                          (flight) =>
                            ((flight.slices &&
                              flight.slices.length > 0 &&
                              `${flight.slices[0].origin.iata_code}-${flight.slices[0].destination.iata_code}`) ||
                              `${flight.slices[0].origin.iata_city_code}-${flight.slices[0].destination.iata_code}`) ===
                            route
                        );
                        // {console.log(flight)}
                        
                        // Render the flight if found
                        return (
                          flight && (
                            <div
                              key={route}
                              className="col-12 col-md-6 col-lg-3 col-xl-3"
                            >
                              <div className="grid-block main-block f-grid-block ">
                                {/* <a href="#"> */}
                                <div className="main-img">
                                  {/* <img
                                    src={flightimage}
                                    className="img-fluid"
                                    alt="flight-img"
                                  /> */}
                                   <img
                                style={{width: "100%",height: "150px", display: "block",   // Optional rounded corners
                                }}
                            src={`/assets/images/${flight?.slices?.[0]?.destination?.city_name}.png`}
                            className="img-fluid"
                            alt={flight?.slices?.[0]?.destination?.city_name || "flight-img"}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/images/flight-1.jpg"; // Fallback image
                            }}
                          />
                                </div>
                                {/* </a> */}
                                <div className="block-info f-grid-info">
                                  <div className="f-grid-desc">
                                    {/* Check if slices exist and contain data */}
                                    {flight?.slices &&
                                      flight?.slices.length > 0 &&
                                      flight?.slices[0].origin &&
                                      flight?.slices[0].destination && (
                                        <>
                                          <div className="timeduration">
                                            <span className="f-grid-time">
                                              <i className="fa fa-clock-o"></i>
                                              {formatDuration(
                                                flight?.slices[0].duration
                                              )}
                                            </span>
                                          </div>
                                          <h3 className="block-title">
                                            <a href="#">
                                              {
                                                flight?.slices[0].origin
                                                  .city_name
                                              }
                                              {" To "}
                                              {
                                                flight?.slices[0].destination
                                                  .city_name
                                              }
                                            </a>
                                          </h3>
                                        </>
                                      )}
                                  </div>

                                  {/* <p className="block-minor">
                                    {flight?.slices &&
                                      flight?.slices.length > 0 &&
                                      flight?.slices[0].segments[0].aircraft &&
                                      flight?.slices[0].fare_brand_name && (
                                        <>
                                          <span>
                                            {
                                              flight?.slices[0].segments[0]
                                                .aircraft.name
                                            }
                                            {" , "}
                                          </span>

                                          {flight?.slices[0].fare_brand_name}
                                        </>
                                      )}
                                  </p> */}
                                  <ul className="list-unstyled list-inline offer-price-1">
                                    <li className="price">
                                      {/* {`${flight.total_currency} ${calculatePriceWithMarkup(
                                        flight?.base_amount,
                                        flight?.tax_amount
                                          )}`} */}
                                          {console.log('flight Data', flight)} 
                                         {`${flight.total_currency} ${flight?.total_amount|| 'N/A'}`}

                                    </li>
                                  </ul>
                                </div>

                                <div className="f-grid-timing">
                                  <ul className="list-unstyled">
                                    {flight?.slices &&
                                      flight?.slices.length > 0 &&
                                      flight?.slices[0].segments[0]
                                        .departing_at &&
                                      flight?.slices[0].segments[0]
                                        .arriving_at && (
                                        <>
                                          <li>
                                            <span>
                                              <i className="fa fa-plane"></i>
                                            </span>
                                            <span className="date">
                                              {formatFlightDate(
                                                flight?.slices[0].segments[0]
                                                  .departing_at
                                              )}
                                            </span>
                                          </li>
                                          <li>
                                            <span>
                                              <i className="fa fa-plane"></i>
                                            </span>
                                            <span className="date">
                                              {formatFlightDate(
                                                flight?.slices[0].segments[0]
                                                  .arriving_at
                                              )}
                                            </span>
                                          </li>
                                        </>
                                      )}
                                  </ul>
                                </div>

                                <div className="grid-btn mb-3 p-2">
                                  <a
                                    href="#"
                                    className="btn btn-orange btn-block btn-lg"
                                    id="toDestination"
                                    onClick={(event) =>
                                      handleSubmit1(event, flight?.slices[0])
                                    }
                                  >
                                    Book
                                  </a>
                                </div>
                              </div>
                            </div>
                          )
                        );
                      }
                    )}
                </div>
                
                <div className="row">

                  {flightsData &&
                  
                    // Group flights by route and map one record per route
                    // [`${originCode}-${internationalFlights[4]}`, `${originCode}-${internationalFlights[1]}`, `${originCode}-${internationalFlights[2]}`, `${originCode}-${internationalFlights[3]}`].map(
                      
                    //   (route) => {
                    //     // Find the first flight for the current route
                    //     const flight = flightsData.find(
                    //       (flight) =>
                    //         ((flight.slices &&
                    //           flight.slices.length > 0 &&
                    //           `${flight.slices[0].origin.iata_code.toUpperCase()}-${flight.slices[0].destination.iata_code.toUpperCase()}`) ||
                    //           `${flight.slices[0].origin.iata_city_code.toUpperCase()}-${flight.slices[0].destination.iata_code.toUpperCase()}`) ===
                    //         route
                    //     );

                          // dynamically mapping the array list of airports 
                        internationalFlights
                          .map(dest => `${originCode}-${dest}`)
                          .map(route => {
                            const flight = flightsData.find(flight => {
                              const slice = flight?.slices?.[0];
                              if (!slice) return false;
                              
                              const flightRoute = `${slice.origin.iata_code.toUpperCase()}-${slice.destination.iata_code.toUpperCase()}`;
                              return flightRoute === route;
                            });
                        console.log("Origin code",originCode);
                        console.log("International Flights",internationalFlights);
                        // {console.log(flight)}
                        // Render the flight if found
                        return (
                          flight && (
                            <div
                              key={route}
                              className="col-12 col-md-6 col-lg-3 col-xl-3 "
                            >
                              <div className="grid-block main-block f-grid-block">
                                {/* <a href="#"> */}
                                <div className="main-img ">
                                  {/* <img
                                    src={flightimage}
                                    className="img-fluid"
                                    alt="flight-img"
                                  /> */}
                                   <img
                                style={{width: "100%",height: "150px", display: "block",   // Optional rounded corners
                                }}
                            src={`/assets/images/${flight?.slices?.[0]?.destination?.city_name}.png`}
                            className="img-fluid"
                            alt={flight?.slices?.[0]?.destination?.city_name || "flight-img"}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/images/flight-1.jpg"; // Fallback image
                            }}
                          />
                                </div>
                                {/* </a> */}
                                <div className="block-info f-grid-info">
                                  <div className="f-grid-desc">
                                    {/* Check if slices exist and contain data */}
                                    {flight?.slices &&
                                      flight?.slices.length > 0 &&
                                      flight?.slices[0].origin &&
                                      flight?.slices[0].destination && (
                                        <>
                                          <div className="timeduration">
                                            <span className="f-grid-time">
                                              <i className="fa fa-clock-o"></i>
                                              {formatDuration(
                                                flight?.slices[0].duration
                                              )}
                                            </span>
                                          </div>
                                          <h3 className="block-title">
                                            <a href="#">
                                              {
                                                flight?.slices[0].origin
                                                  .city_name
                                              }
                                              {" To "}
                                              {
                                                flight?.slices[0].destination
                                                  .city_name
                                              }
                                            </a>
                                          </h3>
                                        </>
                                      )}
                                  </div>

                                  {/* <p className="block-minor">
                                    {flight?.slices &&
                                      flight?.slices.length > 0 &&
                                      flight?.slices[0].segments[0].aircraft &&
                                      flight?.slices[0].fare_brand_name && (
                                        <>
                                          <span>
                                            {
                                              flight?.slices[0].segments[0]
                                                .aircraft.name
                                            }
                                            {" , "}
                                          </span>

                                          {flight?.slices[0].fare_brand_name}
                                        </>
                                      )}
                                  </p> */}
                                  <ul className="list-unstyled list-inline offer-price-1">
                                    <li className="price">
                                        {/* {`${flight.total_currency} ${calculatePriceWithMarkup(
                                            flight?.base_amount,
                                            flight?.tax_amount
                                        )}`} */}
                                       {`${flight.total_currency} ${flight?.total_amount || 'N/A'}`}

                                    </li>
                                  </ul>
                                </div>

                                <div className="f-grid-timing">
                                  <ul className="list-unstyled">
                                    {flight?.slices &&
                                      flight?.slices.length > 0 &&
                                      flight?.slices[0].segments[0]
                                        .departing_at &&
                                      flight?.slices[0].segments[0]
                                        .arriving_at && (
                                        <>
                                          <li>
                                            <span>
                                              <i className="fa fa-plane"></i>
                                            </span>
                                            <span className="date">
                                              {formatFlightDate(
                                                flight?.slices[0].segments[0]
                                                  .departing_at
                                              )}
                                            </span>
                                          </li>
                                          <li>
                                            <span>
                                              <i className="fa fa-plane"></i>
                                            </span>
                                            <span className="date">
                                              {formatFlightDate(
                                                flight?.slices[0].segments[0]
                                                  .arriving_at
                                              )}
                                            </span>
                                          </li>
                                        </>
                                      )}
                                  </ul>
                                </div>

                                <div className="grid-btn mb-3 p-2">
                                  <a
                                    href="#"
                                    className="btn btn-orange btn-block btn-lg"
                                    id="toDestination"
                                    onClick={(event) =>
                                      handleSubmit1(event, flight?.slices[0])
                                    }
                                  >
                                    Book
                                  </a>
                                </div>
                              </div>
                            </div>
                          )
                        );
                      }
                    )}
                </div>


                    </>
                  )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Body);