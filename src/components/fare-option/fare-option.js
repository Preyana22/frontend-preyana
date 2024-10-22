import React, { useState } from "react";
import "../fare-option/fare-option.css"; // Create this file to add custom styles
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import moment from "moment"; // Import Moment.js
import { connect } from "react-redux";
import { findFlights } from "../../actions";

const FareOption = (props) => {
  const location = useLocation();
  const flight = location.state.flightsdata;
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [selectedFares, setSelectedFares] = useState({
    slice1: null,
    slice2: null,
  });
  console.log("flights", flight);
  const navigateToContacts = () => {
    navigate("/contacts", { state: { flight, selectedFares } }); // Pass selected fares to the next route
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
    const originCode = originStateText.match(/\(([^)]+)\)/)[1]; // Extracts the code within parentheses
    console.log(originCode); // Output: IND
    const savedOrigin = originCode;

    const destinationStateText = localStorage.getItem("destination");
    const destinationCode = destinationStateText.match(/\(([^)]+)\)/)[1]; // Extracts the code within parentheses
    console.log(destinationCode); // Output: IND

    const savedDestination = destinationCode;

    const savedCabinClass = JSON.parse(localStorage.getItem("cabinclass"));
    const savedDateOfDep = JSON.parse(localStorage.getItem("dateOfDeparture"));
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

    // console.log("flights", flights);
    // console.log("criteria", criteria);
    props.findFlights({ flights, criteria });

    navigate("/results");
  };
  const flightsdata = location.state.flight;
  const navigateToFareOption = () => {
    console.log(flightsdata);
    navigate("/fareoption", { state: { flightsdata } });
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
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
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
          {flight.slices.map((slice, sliceIndex) => (
            <div key={sliceIndex}>
              <h4>
                <strong>Flight to {slice.destination.city_name}</strong>{" "}
                {convertDate(slice.segments[0].departing_at)}
              </h4>
              {slice.segments.map((segment, segmentIndex) => (
                <div
                  key={segmentIndex}
                  className="d-flex align-items-center mb-3"
                >
                  <div className="mr-3">
                    <img
                      src={segment.operating_carrier.logo_symbol_url}
                      width={30}
                      height={30}
                      alt="Carrier Logo"
                    />
                  </div>
                  <div className="d-flex justify-content-between w-100">
                    <div>
                      <span className="flight-time">
                        {convertToTime(segment.departing_at)}
                      </span>{" "}
                      {segment.origin.iata_city_code}
                    </div>
                    <div>
                      <span>{formatDuration(segment.duration)}</span>
                      <span className="mx-2">
                        {segment.stops ? segment.stops : ""}
                      </span>
                    </div>
                    <div>
                      <span className="flight-time">
                        {convertToTime(segment.arriving_at)}
                      </span>{" "}
                      {segment.destination.iata_city_code}
                    </div>
                  </div>
                </div>
              ))}

              {/* Render fare options */}
              <div className="row my-4">
                {/* Economy Option */}
                {["Economy", "Premium Economy", "Business"].map((fareType) => (
                  <div className="col-md-4" key={fareType}>
                    <div
                      className={`card ${
                        selectedFares[`slice${sliceIndex + 1}`] === fareType
                          ? "selected-fare"
                          : ""
                      }`}
                      onClick={() => handleFareSelect(sliceIndex, fareType)}
                    >
                      {selectedFares[`slice${sliceIndex + 1}`] === fareType && (
                        <i
                          className="fa fa-check-circle position-absolute"
                          style={{
                            top: "10px",
                            right: "10px",
                            color: "#9e7ce8",
                          }}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{fareType}</h5>
                        <h6 className="card-subtitle mb-2 font-weight-bold">
                          {fareType === "Economy"
                            ? "Basic"
                            : fareType === "Premium Economy"
                            ? "Comfort"
                            : "Premium"}
                        </h6>
                        <ul className="list-unstyled">
                          <li>✗ Not changeable</li>
                          <li>
                            {fareType === "Premium Economy"
                              ? "✔ Refundable (£20.00 fee)"
                              : "✗ Not refundable"}
                          </li>
                          <li>✔ Hold price & space</li>
                          <li>✔ Includes carry-on bags</li>
                          <li>✔ Includes checked bags</li>
                        </ul>
                        <div className="total-price">
                          <p>total amount from</p>
                          <h3>
                            <strong>
                              {flight.total_currency + "" + flight.total_amount}
                            </strong>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                Sold by {flight.slices[0].segments[0].operating_carrier.name}
              </p>
              <h6>Selected Fares:</h6>
              <p>{selectedFares.slice1 || "None selected"}</p>
              <p>{selectedFares.slice2 || "None selected"}</p>
              <p className="card-text">
                <i className="fa fa-cloud"> </i>
                {" " + flight.total_emissions_kg + " KG"}
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
