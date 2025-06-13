import React, { useEffect, useState } from "react";
import "../fare-option/fare-option.css";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { findFlights } from "../../actions";
const apiUrl = process.env.REACT_APP_API_BASE_URL;
var tripType = "";

const FareOption = (props) => {
  const location = useLocation();
  const flights = location.state.flightsdata;
  const navigate = useNavigate();

  const [selectedFares, setSelectedFares] = useState({
    slice1: null,
    slice2: null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    tripType = flights.slices.length > 1 ? "Round Trip" : "One Way Trip";
    flights.slices.forEach((slice, index) => {
      setSelectedFares((prevSelected) => ({
        ...prevSelected,
        [`slice${index + 1}`]:
          slice.segments[0].passengers[0].cabin_class_marketing_name,
      }));
    });
  }, [flights]);

  const handleFareSelect = (sliceIndex, fareType) => {
    setSelectedFares((prevSelected) => ({
      ...prevSelected,
      [`slice${sliceIndex + 1}`]: fareType,
    }));
  };

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekday = weekdayNames[date.getDay()];
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
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${weekday}, ${month} ${day},`;
  };

  const convertToTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
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

  const calculatePriceWithMarkup = (baseAmount, taxAmount) => {
    const base_amount = Number(baseAmount);
     const markupPercent=Number(process.env.REACT_APP_MARKUP_PERCENT);
    const markup = base_amount *  markupPercent;
    const baseprice = base_amount + markup;
    const tax_amount = Number(taxAmount);
    const price = baseprice + tax_amount;
    return price.toFixed(2); // Formats to two decimal places
  };

  const navigateToContacts = () => {
    navigate("/contacts", { state: { flights, selectedFares } });
  };

  const calculateLayover = (arrivalTime, departureTime) => {
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);

    // Calculate the layover in minutes
    const layoverInMinutes = (departure - arrival) / (1000 * 60);

    // Convert minutes to hours and minutes
    const hours = Math.floor(layoverInMinutes / 60);
    const minutes = layoverInMinutes % 60;

    return `${hours}h ${minutes}m`; // Return layover in hours and minutes
  };

  return (
    <div className="container my-5" id="fare-container">
      <div className="row">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  style={{ color: "#003988", cursor: "pointer" }}
                  onClick={() => navigate("/results")}
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
              <h4 className="mb-4">
                <strong>
                  {tripType} to {slice.destination.city_name}
                </strong>
              </h4>
              {slice.segments.map((segment, segmentIndex) => (
                <div key={segmentIndex}>
                  <div className="row text-center">
                    <div className="col-1">
                      <img
                        src={segment.operating_carrier.logo_symbol_url}
                        width={30}
                        height={30}
                        alt="Carrier Logo"
                        className="mr-3"
                      />
                    </div>
                    <div className="col-4">
                      <span className="flight-time">
                        {convertDate(segment.departing_at)}{" "}
                        {convertToTime(segment.departing_at)}
                      </span>
                    </div>
                    <div className="col-3">
                      <span>{formatDuration(segment.duration)}</span>
                    </div>
                    <div className="col-4">
                      <span className="flight-time">
                        {convertDate(segment.arriving_at)}{" "}
                        {convertToTime(segment.arriving_at)}
                      </span>
                    </div>
                  </div>
                  <div className="row text-center">
                    <div className="col-1"></div>
                    <div className="col-4"></div>
                    <div
                      className="col-3 d-flex justify-content-center align-items-center"
                      style={{ left: "1rem" }}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "100%" }}
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
                    <div className="col-4"></div>
                  </div>
                  <div className="row text-center mb-4">
                    <div class="col-1"></div>
                    <div className="col-4 text-center">
                      <span>
                        {segment.origin.city_name} (
                        {segment.origin.iata_city_code})
                      </span>
                    </div>
                    <div class="col-3"></div>
                    <div className="col-4 text-center">
                      <span>
                        {segment.destination.city_name} (
                        {segment.destination.iata_city_code})
                      </span>
                    </div>
                  </div>

                  {/* Layover details after the first segment but not for the last segment */}
                  {slice.segments.length > 1 &&
                    segmentIndex < slice.segments.length - 1 && (
                      <div className="row text-left mb-3">
                        <div className="col">
                          {/* Layover details */}
                          {slice.segments.length > 1 &&
                            slice.segments
                              .slice(segmentIndex, segmentIndex + 1)
                              .map((segment, index) => {
                                const nextSegment =
                                  slice.segments[segmentIndex + 1];

                                // Calculate layover time
                                const layoverTime = calculateLayover(
                                  segment.arriving_at,
                                  nextSegment.departing_at
                                );

                                return (
                                  <div
                                    key={segment.id}
                                    className="fare-layover-detail d-block"
                                  >
                                    <p className="mb-0 text-black pl-3">
                                      <small>
                                        <span>{`${layoverTime} layover at `}</span>
                                        <span className="ml-0">
                                          {segment.destination.city_name} (
                                          {segment.destination.iata_city_code})
                                        </span>
                                      </small>
                                    </p>
                                  </div>
                                );
                              })}
                        </div>
                      </div>
                    )}
                </div>
              ))}

              {/* Render fare options */}
              <div className="row my-4">
                <div
                  className={`card w-100 ${
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
                  }
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
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h5 className="mb-0 font-weight-bold">
                        {
                          slice.segments[0].passengers[0]
                            .cabin_class_marketing_name
                        }
                      </h5>
                    </div>
                    <div className="row justify-content-around">
                      <div className="col-6">
                        <ul className="list-unstyled features-list d-flex flex-wrap">
                          <li>
                            {slice.conditions?.change_before_departure?.allowed
                              ? "✔ Changeable"
                              : "✗ Not changeable"}
                          </li>
                          <li>
                            {slice.conditions?.refund_before_departure?.allowed
                              ? `✔ Refundable ${slice.conditions.refund_before_departure.penalty_currency} ${slice.conditions.refund_before_departure.penalty_amount}`
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
                      </div>
                      <div className="text-center">
                        <div className="total-price">
                          <p>Total amount from</p>
                          <h3>
                            <strong>
                              {flights.total_currency}{" "}
                              {calculatePriceWithMarkup(
                                flights.base_amount,
                                flights.tax_amount
                              )}
                            </strong>
                          </h3>
                        </div>
                      </div>
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
                {" " + flights.total_emissions_kg + " KG CO2"}
              </p>
              <button
                className={`btn ${
                  selectedFares.slice1 ? "active-checkout" : "btn-secondary"
                }`}
                disabled={
                  !(
                    selectedFares.slice1 &&
                    (selectedFares.slice2 || !flights.slices[1])
                  )
                }
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
