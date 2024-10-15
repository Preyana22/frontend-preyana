import React, { useEffect } from "react";
import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { Accordion, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
//import { PhoneInput } from 'react-international-phone';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./contact-grid.css";
import { useLocation } from "react-router-dom";
import flightimage from "../../assets/images/flightimage.svg";
import axios from "axios";
import moment from "moment"; // Import Moment.js
import { Link } from "react-router-dom";
import { findFlights } from "../../actions";
import { connect } from "react-redux";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const Contacts = (props) => {
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  const toggleTerms = () => {
    setIsOpen(!isOpen);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Days from 1 to 31
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // Months from 1 to 12
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years

  // Handle change for day
  const handleDayChange = (index, event) => {
    const newSelectedDays = [...selectedDay];
    newSelectedDays[index] = event.target.value;
    setSelectedDay(newSelectedDays);
  };

  // Handle change for month
  const handleMonthChange = (index, event) => {
    const newSelectedMonths = [...selectedMonth];
    newSelectedMonths[index] = event.target.value;
    setSelectedMonth(newSelectedMonths);
  };

  // Handle change for year
  const handleYearChange = (index, event) => {
    const newSelectedYears = [...selectedYear];
    newSelectedYears[index] = event.target.value;
    setSelectedYear(newSelectedYears);
  };

  const location = useLocation();
  console.log("location.state.flight", location.state.flight);
  // const name =
  //   location.state.flight.slices[0].segments[0].operating_carrier["name"];
  // const flightNo =
  //   location.state.flight.slices[0].segments[0].marketing_carrier_flight_number;
  // const arrivalTime = location.state.flight.slices[0].segments[0].arriving_at;
  const origin = location.state.flight.slices[0].origin.iata_code;
  const destination = location.state.flight.slices[0].destination.iata_code;
  const origincity = location.state.flight.slices[0].origin.city_name;
  const destinationcity = location.state.flight.slices[0].destination.city_name;
  const price = location.state.flight.total_amount;
  const base_amount = location.state.flight.base_amount;
  const tax_amount = location.state.flight.tax_amount;
  const date = location.state.flight.slices[0].segments[0].departing_at;
  const formattedDate = moment(date).format("ddd D MM, YYYY, hh:mm A");
  const arrivaldate = location.state.flight.slices[0].segments[0].arriving_at;
  const formattedArrivalDate = moment(arrivaldate).format("D MM YYYY, hh:mm A");
  const time = location.state.flight.slices[0].segments[0].duration;
  const stops = location.state.flight.slices[0].segments[0].stops;
  const aircraftName = location.state.flight.slices[0].segments[0].aircraft
    ? location.state.flight.slices[0].segments[0].aircraft.name
    : null;

  const operating_carrier_flight_number =
    location.state.flight.slices[0].segments[0].operating_carrier.iata_code &&
    location.state.flight.slices[0].segments[0].operating_carrier_flight_number
      ? location.state.flight.slices[0].segments[0].operating_carrier
          .iata_code +
        location.state.flight.slices[0].segments[0]
          .operating_carrier_flight_number
      : null;
  // Parse the duration using moment.js
  const momentDuration = moment.duration(time);

  // Extract the components
  const timedays = momentDuration.days();
  const hours = momentDuration.hours();
  const minutes = momentDuration.minutes();
  const cabin =
    location.state.flight.slices[0].segments[0].passengers[0]
      .cabin_class_marketing_name;
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  let titles, genderdetails;
  let contactDetails = [];

  const title = ["Mr", "Mrs", "Miss", "Doctor"];
  const paymenttype =
    location.state.flight.payment_requirements.requires_instant_payment;
  const gender = ["Female", "Male"];
  console.log("paymenttype" + paymenttype);
  const flights = props.flights || {};
  flights.nonStopFlights = props.flights;
  const flightsCount = flights.length;
  let arr = [];
  arr = location.state.flight.passengers;
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { flights } = props;
    let hasError = false; // Track if there's any validation error
    let contactDetails = [];

    // Validate and iterate over the form data
    arr.forEach((item, index) => {
      const familyname1 = `familyname${index}`;
      const given_name1 = `given_name${index}`;
      const email1 = `email${index}`;
      const address1 = `address1${index}`;
      const address2 = `address2${index}`;
      const city = `city${index}`;
      const postal = `postal${index}`;

      const day = event.target[`dayOfBirth${index}`].value;
      const month = event.target[`monthOfBirth${index}`].value;
      const year = event.target[`yearOfBirth${index}`].value;

      const dateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`; // YYYY-MM-DD format

      // **Validation Logic**
      if (!event.target[familyname1].value) {
        alert(`Family name is required for passenger ${index + 1}`);
        hasError = true;
      }
      if (!event.target[given_name1].value) {
        alert(`Given name is required for passenger ${index + 1}`);
        hasError = true;
      }
      if (!event.target[email1].value) {
        alert(`Email is required for passenger ${index + 1}`);
        hasError = true;
      }
      if (!genderdetails || !genderdetails.state || !genderdetails.state.text) {
        alert(`Gender is required for passenger ${index + 1}`);
        hasError = true;
      }

      if (!event.target[familyname1].value) {
        alert(`Family name is required for passenger ${index + 1}`);
        hasError = true;
      }
      // Continue adding other field validations as needed...

      contactDetails.push({
        title: titles.state.text,
        offer_id: location.state.flight.id,
        id: location.state.flight.passengers[index].id,
        family_name: event.target[familyname1].value,
        given_name: event.target[given_name1].value,
        email: event.target[email1].value,
        phone_number: "+" + phone.trim(),
        gender: genderdetails.state.text.charAt(0).toLowerCase(),
        born_on: dateOfBirth,
        type: item.type,
        address1: event.target[address1].value,
        address2: event.target[address2].value,
        city: event.target[city].value,
        region: region,
        postal: event.target[postal].value,
        country: country,
      });
    });

    // If there's an error, stop the form submission
    if (hasError) {
      return;
    }

    // Proceed with API calls if no errors
    if (localStorage.getItem("userId") === null) {
      const configuration = {
        method: "post",
        url: "http://192.168.1.92:3000/authentication/register",
        data: {
          email: event.target["email0"].value,
          userName: event.target["email0"].value,
          password: null,
        },
      };
      await axios(configuration)
        .then((result) => {
          console.log("response", result.data);
          console.log(result.data.message);
        })
        .catch((error) => {
          console.log("Error: " + error);
          if (error.response) {
            if (error.response.status === 400) {
              alert(`Error: ${error.response.data.message}`);
            } else {
              alert(`Error: ${error.response.status}`);
            }
          } else {
            alert("Something went wrong. Please try again later.");
          }
        });
    }

    setIsFetching(true);

    const amount = location.state.flight.total_amount;
    const currency = location.state.flight.total_currency;
    const type = "balance";

    const payments = { type: type, amount: amount, currency: currency };
    const test = {
      type: "hold",
      selected_offers: [contactDetails[0].offer_id],
      passengers: contactDetails,
      payments: payments,
    };

    try {
      const response = await axios.post(
        "http://192.168.1.92:3000/airlines/book",
        test,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data, errors } = response.data;

      if (data) {
        navigate("/booking", { state: { contactDetails, data } });
      } else {
        console.error("Errors:", errors);
      }
    } catch (error) {
      // if (error.response) {
      //   console.error("Response Error:", error.response.data);
      // } else if (error.request) {
      //   console.error("No response received:", error.request);
      // } else {
      //   console.error("Error", error.message);
      // }
    }
    setIsFetching(false);
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

  useEffect(() => {
    if (phone) {
      const phoneNumber = parsePhoneNumberFromString(`+${phone}`);

      if (!phoneNumber || !phoneNumber.isValid()) {
        setError("Invalid phone number. Please enter a valid phone number.");
      } else {
        setError("");
        console.log(
          "Phone number is valid:",
          phoneNumber.formatInternational()
        );
      }
    }
  }, [phone]); // Validate phone number every time it changes
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

  return (
    <section className="innerpage-wrapper">
      <div id="flight-booking" className="innerpage-section-padding">
        <div className="container">
          <Form onSubmit={handleSubmit}>
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
                    <li className="breadcrumb-item">
                      <label>Checkout</label>
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="col-12 col-md-12 col-lg-7 col-xl-8 content-side">
                <div className="lg-booking-form-heading">
                  <h2 className="font-weight-bold">Checkout</h2>
                  <h5 className="font-weight-bold">Billing Information</h5>
                </div>
                {arr.map((item, index) => {
                  console.log(item);

                  return (
                    <div className={`personal-info${index}`}>
                      <h6 className="font-weight-bold">
                        <strong>
                          {item.type === "adult"
                            ? "Adult Information"
                            : item.type === "child"
                            ? "Children Information"
                            : "Infant Information"}
                        </strong>
                      </h6>

                      <div className="row">
                        <div className="col-6 col-md-6">
                          <div className="form-group">
                            <label>
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              Title
                            </label>
                            <Form.Group controlId="titles">
                              <Typeahead
                                labelKey="titles"
                                options={title}
                                placeholder="titles"
                                ref={(ref) => (titles = ref)}
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div className="col-6 col-md-6">
                          <div className="form-group">
                            <label>
                              {" "}
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              Given Name
                            </label>

                            <Form.Group controlId={`given_name${index}`}>
                              <Form.Control
                                type="text"
                                className="form-control"
                                name={`given_name${index}`}
                                placeholder="Given Name"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {" "}
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              Family name
                            </label>

                            <Form.Group controlId={`familyname${index}`}>
                              <Form.Control
                                type="text"
                                className="form-control"
                                name={`familyname${index}`}
                                placeholder="Family name"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Gender</label>
                            <Form.Group controlId={`genderdetails${index}`}>
                              <Typeahead
                                labelKey="genderdetails"
                                options={gender}
                                placeholder="Gender"
                                ref={(ref) => (genderdetails = ref)}
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {" "}
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              Email Address
                            </label>

                            <Form.Group controlId={`email${index}`}>
                              <Form.Control
                                type="email"
                                className="form-control dpd1"
                                name={`email${index}`}
                                placeholder="email"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {" "}
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              Date Of Birth
                            </label>
                            <div className="row">
                              <div className="col-4">
                                <select
                                  className="form-control"
                                  name={`dayOfBirth${index}`}
                                  value={selectedDay[index]}
                                  onChange={(e) => handleDayChange(index, e)}
                                  required
                                >
                                  <option value="">Day</option>
                                  {days.map((day) => (
                                    <option key={day} value={day}>
                                      {day}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-4">
                                <select
                                  className="form-control"
                                  name={`monthOfBirth${index}`}
                                  value={selectedMonth[index]}
                                  onChange={(e) => handleMonthChange(index, e)}
                                  required
                                >
                                  <option value="">Month</option>
                                  {months.map((month) => (
                                    <option key={month} value={month}>
                                      {month}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-4">
                                <select
                                  className="form-control"
                                  name={`yearOfBirth${index}`}
                                  value={selectedYear[index]}
                                  onChange={(e) => handleYearChange(index, e)}
                                  required
                                >
                                  <option value="">Year</option>
                                  {years.map((year) => (
                                    <option key={year} value={year}>
                                      {year}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>
                              {" "}
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              Address Line 1
                            </label>

                            <Form.Group controlId={`address1${index}`}>
                              <Form.Control
                                type="text"
                                className="form-control"
                                name={`address1${index}`}
                                placeholder="Address line 1"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Address Line 2</label>

                            <Form.Group controlId={`address2${index}`}>
                              <Form.Control
                                type="text"
                                className="form-control"
                                name={`address2${index}`}
                                placeholder="Address line 2"
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>
                              {" "}
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              Country
                            </label>

                            <Form.Group controlId={`country${index}`}>
                              <CountryDropdown
                                className="custom-dropdown country-dropdown"
                                value={country}
                                onChange={(val) => setCountry(val)}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>
                              {" "}
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              City/Town/Department
                            </label>

                            <Form.Group controlId={`city${index}`}>
                              <Form.Control
                                type="text"
                                className="form-control"
                                name={`city1${index}`}
                                placeholder="City/Town/Department"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>
                              {" "}
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              State/Province/Region
                            </label>

                            <Form.Group controlId={`region${index}`}>
                              <RegionDropdown
                                className="custom-dropdown region-dropdown"
                                country={country}
                                value={region}
                                onChange={(val) => setRegion(val)}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>
                              {" "}
                              <sup>
                                <small>
                                  <i className="fa fa-asterisk text-secondary mr-1">
                                    {" "}
                                  </i>
                                </small>
                              </sup>
                              Zip/Postal Code
                            </label>

                            <Form.Group controlId={`postal${index}`}>
                              <Form.Control
                                type="text"
                                className="form-control"
                                name={`postal${index}`}
                                placeholder="Zip/Postal Code"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Phone Number</label>
                            <Form.Group controlId={`phone${index}`}>
                              <PhoneInput
                                country={"us"} // Default country
                                value={phone}
                                onChange={(phone) => setPhone(phone)}
                              />
                              {error && (
                                <div className="error text-danger">{error}</div>
                              )}
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* <button className="btn btn-contactorange" disabled={isFetching}>
                  {isFetching ? "Booking..." : "Book"}
                </button> */}
              </div>
              <div className="col-12 col-md-12 col-lg-5 col-xl-4 side-bar left-side-bar">
                <div className="row">
                  <div className="container">
                    <div className="card shadow-sm" style={{ width: "22rem;" }}>
                      {/* <!-- Image Section --> */}
                      <div className="card-header bg-light text-center p-3">
                        <img
                          src={flightimage}
                          alt="Airplane"
                          className="img-fluid"
                          style={{ width: "50px;" }}
                        />
                      </div>

                      {/* <!-- Flight Info Section --> */}
                      <div className="card-body text-center">
                        <h5 className="card-title font-weight-bold">
                          {origincity} {"to"} {destinationcity}
                        </h5>
                        <p className="card-text text-muted">
                          {operating_carrier_flight_number},{" "}
                          {location.state.flight.slices.length === 1
                            ? "One Way Flight"
                            : "Round Trip Flight"}
                        </p>

                        <hr />

                        {/* <!-- Flight Details --> */}
                        <ul className="list-unstyled">
                          <li className="d-flex justify-content-between">
                            <strong>Departure:</strong>
                            <span>{formattedDate}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Flight Duration:</strong>
                            <span>
                              {" "}
                              {`${
                                timedays > 0
                                  ? `${timedays} day${
                                      timedays !== 1 ? "s" : ""
                                    }, `
                                  : ""
                              }${
                                hours > 0
                                  ? `${hours} hour${hours !== 1 ? "s" : ""}, `
                                  : ""
                              }${
                                minutes > 0
                                  ? `${minutes} minute${
                                      minutes !== 1 ? "s" : ""
                                    }`
                                  : ""
                              }`}
                            </span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>className:</strong>
                            <span>{cabin}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Stops:</strong>
                            <span>{stops}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Aircraft Type:</strong>
                            <span>{aircraftName}</span>
                          </li>
                        </ul>

                        <hr />

                        {/* <!-- Pricing Section --> */}
                        <div className="d-flex justify-content-between">
                          <span>
                            <strong>Fare:</strong>
                          </span>
                          <span>{"$ " + base_amount}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>
                            <a href="#" className="text-primary">
                              Taxes & Fees
                            </a>
                          </span>
                          <span>{"$ " + tax_amount}</span>
                        </div>

                        <hr />

                        {/* <!-- Total Due Section --> */}
                        <div className="d-flex justify-content-between">
                          <h5 className="font-weight-bold">Total Due:</h5>
                          <h5 className="font-weight-bold">{"$ " + price}</h5>
                        </div>

                        {/* <!-- Button Section --> */}
                        <div className="text-center mt-3">
                          <button
                            className="btn btn-primary btn-lg btn-block rounded-pill"
                            disabled={isFetching}
                          >
                            {isFetching ? "Booking..." : "Buy Now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
          <div className="col-12 col-md-12 col-lg-7 col-xl-8 content-side p-0">
            <div className="agreement-section">
              {/* Agreement of Purchase */}
              <h5 className="font-weight-bold">Agreement of Purchase</h5>
              <p className="text-dark">
                By selecting <strong>"Buy now,"</strong> you agree to the terms
                and conditions that are associated with this purchase.
              </p>

              {/* Terms and Condition Accordion */}
              <Accordion>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <Accordion.Toggle
                      as={Button}
                      variant="link"
                      eventKey="0"
                      onClick={toggleTerms}
                      className="w-100 text-left"
                    >
                      <strong>Terms and Condition</strong>
                    </Accordion.Toggle>
                    <span className="arrow">{isOpen ? "▲" : "▼"}</span>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <p className="text-dark">
                        Here you can add the detailed terms and conditions text
                        associated with the purchase.
                      </p>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  flights: state.flights,
});

const mapDispatchToProps = {
  findFlights,
};

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
