import React from "react";
import { useEffect, useState } from "react";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { connect } from "react-redux";
import { findFlights, fetchFlights } from "../actions";
import { useNavigate } from "react-router-dom";
import "./body.css";
import axios from "axios";

import flightimage from "../assets/images/flightimage.png";
import SearchFlight from "./search-flight/SearchFlight";

const isDate = (date) => {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

// const ErrorLabel = (props) => {
//   return <label style={{ color: "red" }}>{props.message}</label>;
// };

export const Body = (props) => {
  const [airportsData, setAirports] = useState([]);
  const [flightsData, setFlightsData] = useState([]);

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

  const formatDuration = (duration) => {
    // Match the duration format P1DT2H20M
    const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/;
    const matches = duration.match(regex);

    const days = matches[1]
      ? `${matches[1]} day${matches[1] > 1 ? "s" : ""}`
      : "";
    const hours = matches[2]
      ? `${matches[2]} hour${matches[2] > 1 ? "s" : ""}`
      : "";
    const minutes = matches[3]
      ? `${matches[3]} minute${matches[3] > 1 ? "s" : ""}`
      : "";

    // Join the parts together
    return [days, hours, minutes].filter(Boolean).join(", ");
  };

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
    // const getAirports = async () => {
    //   try {
    //     const { data } = await axios.get(
    //       `http://192.168.1.92:3000/airlines/airports`
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
  console.log("airports" + airports);
  const navigate = useNavigate();
  let origin, destination, cabinclass;
  let criteria;

  const [isReturn, setFlightType] = useState(false);
  const [status, setFormValid] = useState({ isValid: false });
  console.log(status);
  let invalidFields = {};
  const handleSubmit1 = (event) => {
    event.preventDefault(); // Prevent default form submission

    const { flights } = props;
    const Adults = []; // Array to hold passenger data

    // Passenger data structures
    const adultsData = { type: "adult" };
    const childData = { type: "child" };
    const infantData = { type: "infant_without_seat" };

    console.log(options); // Log options for debugging
    console.log(options.adult);

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

    console.log(Adults); // Log the populated Adults array for debugging

    // Define origin and destination cities
    const origin_city = "LHR"; // Example origin city
    const destination_city = "SYD"; // Example destination city
    const cabinclass = "Economy"; // Example destination city

    // Format today's date as YYYY-MM-DD
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    // Construct the search criteria object
    const criteria = {
      origin: origin_city,
      destination: destination_city,
      departureDate: formattedDate,
      numOfPassengers: Adults, // List of passengers
      cabin_class: cabinclass, // Cabin class (could also be a state or prop)
    };

    // Wrap the origin city in an array
    const originArray = [origin_city];
    const destinationArray = [destination_city]; // Example destination city
    const cabinclassArray = [cabinclass]; // Example destination city
    // Store the array in local storage as a JSON string
    localStorage.setItem("origin", JSON.stringify(originArray));
    localStorage.setItem("destination", JSON.stringify(destinationArray));
    localStorage.setItem("cabinclass", JSON.stringify(cabinclassArray));
    localStorage.setItem("dateOfDeparture", JSON.stringify(formattedDate));

    console.log(criteria); // Log criteria for debugging

    // Call the findFlights function with the gathered criteria
    props.findFlights({ flights, criteria });

    // Navigate to results page
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

  const getFlights = async () => {
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

      const origin_city = "LHR"; // Origin city (example)
      const destination_city = "SYD"; // Destination city (example)

      // Format today's date as YYYY-MM-DD
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      // Construct the search criteria
      const criteria = {
        origin: origin_city,
        destination: destination_city,
        departureDate: formattedDate,
        numOfPassengers: Adults, // List of passengers
        cabin_class: "Economy",
      };

      // Request options for the fetch API
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(criteria),
      };

      // Log the requestOptions for debugging
      console.log("Request Options:", requestOptions);

      // Perform the fetch request
      const response = await fetch(
        "http://192.168.1.92:3000/airlines/test",
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const flightsdata = await response.json();

      // Log the response data for debugging
      console.log("Flights Data:", flightsdata[1][0].slices[0].duration);

      setFlightsData(flightsdata[1]); // Set the fetched data to state
    } catch (error) {
      // Log the error if the fetch request fails
      console.error("Error during fetch:", error);
    }
  };

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
                  {flightsData.slice(0, 4).map((flight, index) => (
                    <div
                      key={index}
                      className="col-12 col-md-6 col-lg-3 col-xl-3"
                    >
                      <div className="grid-block main-block f-grid-block">
                        <a href="#">
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
                            {/* Check if slices exist and contain data */}
                            <div className="f-grid-desc">
                              {/* Ensure slices and iata_code exist before accessing */}
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
                                        {flight?.slices[0].origin.iata_code}
                                        {" TO "}
                                        {
                                          flight?.slices[0].destination
                                            .iata_code
                                        }
                                      </a>
                                    </h3>
                                  </>
                                )}
                            </div>

                            <p className="block-minor">
                              {flight?.slices &&
                                flight?.slices.length > 0 &&
                                flight?.slices[0].segments[0].aircraft &&
                                flight?.slices[0].fare_brand_name && (
                                  <>
                                    <span>
                                      {
                                        flight?.slices[0].segments[0].aircraft
                                          .name
                                      }
                                      {" , "}
                                    </span>

                                    {flight?.slices[0].fare_brand_name}
                                  </>
                                )}
                            </p>
                            <ul className="list-unstyled list-inline offer-price-1">
                              <li className="price">
                                {flight?.base_currency} {flight?.base_amount}
                              </li>
                            </ul>
                          </div>

                          <div className="f-grid-timing">
                            <ul className="list-unstyled">
                              {flight?.slices &&
                                flight?.slices.length > 0 &&
                                flight?.slices[0].segments[0].departing_at &&
                                flight?.slices[0].segments[0].arriving_at && (
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

                          <div className="grid-btn">
                            <a
                              href="#"
                              className="btn btn-orange btn-block btn-lg"
                              onClick={handleSubmit1}
                            >
                              Book
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
