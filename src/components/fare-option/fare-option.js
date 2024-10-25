import React, { useEffect, useState } from "react";
import "../fare-option/fare-option.css"; // Create this file to add custom styles
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import moment from "moment"; // Import Moment.js
import { connect } from "react-redux";
import { findFlights } from "../../actions";

const FareOption = (props) => {
  const location = useLocation();
  const flights = location.state.flightsdata;
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [selectedFares, setSelectedFares] = useState({
    slice1: null,
    slice2: null,
  });
  console.log("flights", flights);
  const navigateToContacts = () => {
    navigate("/contacts", { state: { flights, selectedFares } }); // Pass selected fares to the next route
  };

  const handleFareSelect = (sliceIndex, fareType) => {
    setSelectedFares((prevSelected) => ({
      ...prevSelected,
      [`slice${sliceIndex + 1}`]: fareType,
    }));
  };

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()]; // Get month name from the array
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const convertToTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format, handle midnight as 12

    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDuration = (duration) => {
    const momentDuration = moment.duration(duration);
    const days = momentDuration.days();
    const hours = momentDuration.hours();
    const minutes = momentDuration.minutes();

    return `${days > 0 ? `${days}d ` : ""}${
      hours > 0 ? `${hours}h ` : ""
    }${minutes}m`;
  };

  const transformPassengerData = (passengerData) => {
    const result = [];

    for (let type in passengerData) {
      if (type === "children") {
        type = "child"; // Converting "children" to "child"
      }

      for (let i = 0; i < passengerData[type]; i++) {
        if (type === "infant") {
          result.push({ type: "infant_without_seat" });
        } else {
          result.push({ type });
        }
      }
    }

    return result;
  };

  const onSearchResultClick = () => {
    let criteria = {}; // Change to 'let' so it can be reassigned
    const originStateText = localStorage.getItem("origin");
    const originCode = originStateText
      ? originStateText.match(/\(([^)]+)\)/)[1]
      : ""; // Extracts the code within parentheses

    const savedOrigin = originCode;

    const destinationStateText = localStorage.getItem("destination");
    const destinationCode = destinationStateText
      ? destinationStateText.match(/\(([^)]+)\)/)[1]
      : ""; // Extracts the code within parentheses

    const savedDestination = destinationCode;

    const savedCabinClass = JSON.parse(localStorage.getItem("cabinclass"));
    const savedDateOfDep = JSON.parse(localStorage.getItem("dateOfDeparture"));
    const savedDateOfRet = JSON.parse(localStorage.getItem("dateOfReturn"));
    const storedOptions = transformPassengerData(
      JSON.parse(localStorage.getItem("options"))
    );
    const storedTripType = localStorage.getItem("isReturn");

    if (storedTripType === "false") {
      criteria = {
        origin: savedOrigin,
        destination: savedDestination,
        departureDate: savedDateOfDep,
        numOfPassengers: storedOptions,
        cabin_class: savedCabinClass[0],
      };
    } else {
      criteria = {
        origin: savedOrigin,
        destination: savedDestination,
        departureDate: savedDateOfDep,
        returnDate: savedDateOfRet,
        numOfPassengers: storedOptions,
        cabin_class: savedCabinClass[0],
      };
    }

    console.log("fareoption flights", flights);
    console.log("fareoption criteria", criteria);
    props.findFlights({ flights, criteria });

    navigate("/results");
  };
  useEffect(() => {
    getFlights();
  }, []);

  const getFlights = async () => {
    let criteria = {}; // Change to 'let' so it can be reassigned
    try {
      const originStateText = localStorage.getItem("origin");
      const originCode = originStateText
        ? originStateText.match(/\(([^)]+)\)/)[1]
        : ""; // Extracts the code within parentheses

      const savedOrigin = originCode;

      const destinationStateText = localStorage.getItem("destination");
      const destinationCode = destinationStateText
        ? destinationStateText.match(/\(([^)]+)\)/)[1]
        : ""; // Extracts the code within parentheses

      const savedDestination = destinationCode;

      const savedCabinClass = String("premium_economy");
      const savedDateOfDep = JSON.parse(
        localStorage.getItem("dateOfDeparture")
      );
      const savedDateOfRet = JSON.parse(localStorage.getItem("dateOfReturn"));
      const storedOptions = transformPassengerData(
        JSON.parse(localStorage.getItem("options"))
      );
      const storedTripType = localStorage.getItem("isReturn");
      const flights = props.flights;

      if (storedTripType === "false") {
        criteria = {
          origin: savedOrigin,
          destination: savedDestination,
          departureDate: savedDateOfDep,
          numOfPassengers: storedOptions,
          cabin_class: savedCabinClass,
        };
      } else {
        criteria = {
          origin: savedOrigin,
          destination: savedDestination,
          departureDate: savedDateOfDep,
          returnDate: savedDateOfRet,
          numOfPassengers: storedOptions,
          cabin_class: savedCabinClass,
        };
      }

      // Request options for the fetch API
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(criteria),
      };

      // Log the requestOptions for debugging
      // console.log("Request Options:", requestOptions);

      // Perform the fetch request
      const response = await fetch(
        "http://3.128.255.176:3000/airlines/test",
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const flightsdata = await response.json();

      // // Log the response data for debugging
      // console.log("Flights Data:", flightsdata[1]);
    } catch (error) {
      // Log the error if the fetch request fails
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  style={{
                    color: "#003988",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onClick={onSearchResultClick}
                >
                  Search Result
                </span>
              </li>
              <li className="breadcrumb-item">Fare Option</li>
              <li className="breadcrumb-item">
                <label className="text-muted">Checkout</label>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          {flights.slices.map((slice, sliceIndex) => (
            <div key={sliceIndex}>
              <h4>
                <strong>Flight to {slice.destination.city_name}</strong>{" "}
                {convertDate(slice.segments[0].departing_at)}
              </h4>
              {slice.segments.map((segment, segmentIndex) => (
                <>
                  <div className="row text-center">
                    <div className="col">
                      <img
                        src={segment.operating_carrier.logo_symbol_url}
                        width={30}
                        height={30}
                        alt="Carrier Logo"
                        className="mr-3"
                      />
                      <span className="flight-time">
                        {convertToTime(segment.departing_at)}
                      </span>
                    </div>
                    <div className="col">
                      <span>{formatDuration(segment.duration)}</span>
                    </div>
                    <div className="col">
                      <span className="flight-time">
                        {convertToTime(segment.arriving_at)}
                      </span>
                    </div>
                  </div>
                  <div className="row text-center">
                    <div className="col d-flex justify-content-center align-items-center">
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "25%" }}
                      >
                        <hr
                          style={{
                            flexGrow: 1,
                            border: "none",
                            borderTop: "1px solid #e0dbdb",
                            margin: "0",
                          }}
                        />
                        <i
                          className="fa fa-fighter-jet"
                          style={{
                            color: "#c2c2c2",
                            fontSize: "20px",
                            marginLeft: "10px",
                          }}
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div className="row text-center">
                    <div className="col">
                      <span>{segment.origin.iata_city_code}</span>
                    </div>
                    <div className="col">
                      <span className="mx-2">
                        {segment.stops ? segment.stops : ""}
                      </span>
                    </div>
                    <div className="col">
                      <span>{segment.destination.iata_city_code}</span>
                    </div>
                  </div>
                </>
              ))}

              {/* Render fare options */}
              {/* Render fare options */}
              <div className="row my-4">
                <div
                  className={`card ${
                    selectedFares[`slice${sliceIndex + 1}`] ===
                    slice.segments[0].passengers[0].cabin_class_marketing_name
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleFareSelect(
                      sliceIndex,
                      slice.segments[0].passengers[0].cabin_class_marketing_name
                    )
                  } // Set the selected fare type
                  style={{ cursor: "pointer" }}
                >
                  <i
                    className="fa fa-check-circle position-absolute"
                    style={{
                      top: "10px",
                      right: "10px",
                      color:
                        selectedFares[`slice${sliceIndex + 1}`] ===
                        slice.segments[0].passengers[0]
                          .cabin_class_marketing_name
                          ? "#003988"
                          : "gray",
                    }}
                  />
                  <div className="card-body">
                    <h5>
                      {
                        slice.segments[0].passengers[0]
                          .cabin_class_marketing_name
                      }
                    </h5>
                    <h6 className="card-subtitle mb-2 font-weight-bold">
                      {slice.segments[0].passengers[0].cabin_class}
                    </h6>
                    <ul className="list-unstyled">
                      <li>
                        {slice.conditions?.change_before_departure?.allowed ===
                        true
                          ? "✔ changeable"
                          : "✗ Not changeable"}
                      </li>
                      <li>
                        {slice.conditions?.refund_before_departure?.allowed}
                        {slice.conditions?.refund_before_departure?.allowed ===
                        true
                          ? `✔ Refundable ${
                              slice.conditions.refund_before_departure
                                .penalty_currency +
                              " " +
                              slice.conditions.refund_before_departure
                                .penalty_amount
                            }`
                          : "✗ Not refundable"}
                      </li>
                      <li>
                        {flights.payment_requirements
                          ?.requires_instant_payment === false
                          ? "✔ Hold"
                          : "✔ Instant"}
                      </li>
                      <li>
                        {slice.segments[0].passengers[0]?.baggages?.some(
                          (bag) => bag.type === "carry_on"
                        )
                          ? "✔ Includes carry-on bags"
                          : "✗ Excludes carry-on bags"}
                      </li>
                      <li>
                        {slice.segments[0].passengers[0]?.baggages?.some(
                          (bag) => bag.type === "checked"
                        )
                          ? "✔ Includes checked bags"
                          : "✗ Excludes checked bags"}
                      </li>
                    </ul>
                    <div className="total-price">
                      <p>total amount from</p>
                      <h3>
                        <strong>
                          {flights.total_currency + "" + flights.total_amount}
                        </strong>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="col-md-4">
          <div className="card summary-card">
            <div className="card-body">
              <h5 className="card-title">Summary</h5>
              <p className="card-text">
                Sold by {flights.slices[0].segments[0].operating_carrier.name}
              </p>
              <h6>Selected Fares:</h6>
              <p>{selectedFares.slice1 || ""}</p>
              <p>{selectedFares.slice2 || ""}</p>
              <p className="card-text">
                <i className="fa fa-cloud"> </i>
                {" " + flights.total_emissions_kg + " KG"}
              </p>
              <button
                className={`btn ${
                  selectedFares.slice1 ? "btn-dark" : "btn-secondary"
                }`}
                disabled={!selectedFares.slice1}
                onClick={navigateToContacts}
              >
                Go to checkout
              </button>
              <p className="mt-3">
                <span className="text-muted">
                  Select fare options for all flights
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  flights: state.flights,
});

const mapDispatchToProps = {
  findFlights,
};

export default connect(mapStateToProps, mapDispatchToProps)(FareOption);
