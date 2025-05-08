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
import flightimage from "../../assets/images/undraw_departing.png";
import axios from "axios";
import moment from "moment"; // Import Moment.js
import { Link } from "react-router-dom";
import { findFlights } from "../../actions";
import { connect } from "react-redux";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { parsePhoneNumberFromString } from "libphonenumber-js";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

var extraBag = 0;
var seatSelection = 0;
var formattedTotalAmount = 0;
const Contacts = (props) => {
  const [selectedDay, setSelectedDay] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isAncillaries, setIsAncillaries] = useState(false);

  const user_id = localStorage.getItem("userId");

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
console.log(location);
  const origincity = location.state.flights.slices[0].origin.iata_city_code;
  const destinationcity =
    location.state.flights.slices[0].destination.iata_city_code;

  const baseAmount = Number(location.state.flights.base_amount);
  const markup = baseAmount * 0.15;
  const baseprice = baseAmount + markup;
  const formattedAmount = baseprice.toFixed(2); // Rounds to "1335.37"
  const tax_amount = Number(location.state.flights.tax_amount);

  const price = baseprice + tax_amount;
  const date = location.state.flights.slices[0].segments[0].departing_at;
  const formattedDate = moment(date).format("ddd MMM D, YYYY, hh:mm A");
  const arrivaldate = location.state.flights.slices[0].segments[0].arriving_at;

  const time = location.state.flights.slices[0].segments[0].duration;
  const stops = location.state.flights.slices[0].segments[0].stops ? "" : "";
  // const stops =
  //   location.state.flights.slices[0].segments[0].stops.length > 0
  //     ? location.state.flights.slices[0].segments[0].stops.length + "Stop"
  //     : "Non stop";

  const aircraftName = location.state.flights.slices[0].segments[0].aircraft
    ? location.state.flights.slices[0].segments[0].aircraft.name
    : null;

  const operating_carrier_flight_number =
    location.state.flights.slices[0].segments[0].operating_carrier.iata_code &&
    location.state.flights.slices[0].segments[0].operating_carrier_flight_number
      ? location.state.flights.slices[0].segments[0].operating_carrier
          .iata_code +
        location.state.flights.slices[0].segments[0]
          .operating_carrier_flight_number
      : null;
  // Parse the duration using moment.js
  const momentDuration = moment.duration(time);

  const airlinesName = location.state.flights.slices[0].segments[0]
    .operating_carrier.name
    ? location.state.flights.slices[0].segments[0].operating_carrier.name
    : "";
  // Extract the components
  const timedays = momentDuration.days();
  const hours = momentDuration.hours();
  const minutes = momentDuration.minutes();
  const cabin =
    location.state.flights.slices[0].segments[0].passengers[0]
      .cabin_class_marketing_name;

  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  let titles, genderdetails;
  let contactDetails = [];

  const title = ["Mr", "Mrs", "Miss", "Doctor"];
  const paymenttype =
    location.state.flights.payment_requirements.requires_instant_payment;
  const gender = ["Female", "Male"];

  const flights = props.flights || {};
  flights.nonStopFlights = props.flights;
  const flightsCount = flights.length;
  let arr = [];
  arr = location.state.flights.passengers;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { flights } = props;
    let hasError = false;
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

      if ((index === 0 && !titles) || !titles.state || !titles.state.text) {
        alert(`Title is required for passenger ${index + 1}`);
        hasError = true;
      }

      if (index === 0 && !event.target[familyname1].value) {
        alert(`Last name is required for passenger ${index + 1}`);
        hasError = true;
      } else if (event.target[familyname1].value.length < 2) {
        alert(
          `Last name must be at least 2 characters for passenger ${index + 1}`
        );
        hasError = true;
      }

      // Validate Given Name
      if (index === 0 && !event.target[given_name1].value) {
        alert(`First name is required for passenger ${index + 1}`);
        hasError = true;
      } else if (event.target[given_name1].value.length < 2) {
        alert(
          `First name must be at least 2 characters for passenger ${index + 1}`
        );
        hasError = true;
      }

      if (index === 0 && !event.target[email1].value) {
        alert(`Email is required for passenger ${index + 1}`);
        hasError = true;
      }
      if (
        (index === 0 && !genderdetails) ||
        !genderdetails.state ||
        !genderdetails.state.text
      ) {
        alert(`Gender is required for passenger ${index + 1}`);
        hasError = true;
      }

      contactDetails.push({
        title: titles.state.text,
        offer_id: location.state.flights.id,
        id: location.state.flights.passengers[index].id,
        family_name: event.target[familyname1].value,
        given_name: event.target[given_name1].value,
        email: event.target[email1].value,
        loginEmail: localStorage.getItem("email")
          ? localStorage.getItem("email")
          : event.target["email0"].value,
        phone_number: "+" + phone.trim(),
        gender: genderdetails.state.text.charAt(0).toLowerCase(),
        born_on: dateOfBirth,
        type: item.type,
        address1: index === 0 ? event.target[address1].value : "",
        address2: index === 0 ? event.target[address2].value : "",
        city: index === 0 ? event.target[city].value : "",
        region: index === 0 ? region : "",
        postal: index === 0 ? event.target[postal].value : "",
        country: index === 0 ? country : "",
      });
    });

    // Stop the form submission if there's an error
    if (hasError) {
      return;
    }

    const email = event.target["email0"].value;
    let isNewUser = false;

    const extraCharges = (
      Number(formattedTotalAmount) +
      Number(extraBag) +
      Number(seatSelection)
    ).toFixed(2);
    formattedTotalAmount = extraCharges;

    try {
      // Check if the email already exists
      const checkEmailResponse = await axios.get(
        `${apiUrl}/authentication/check-email`,
        {
          params: { email },
        }
      );

      if (!checkEmailResponse.data.exists && !localStorage.getItem("email")) {
        // If the email doesn't exist, proceed with registration
        const registrationResponse = await axios.post(
          apiUrl + "/authentication/register",
          {
            email,
            userName: email,
            password: null,
          }
        );
        console.log("User registered:", registrationResponse.data.message);
        isNewUser = true;
      }
    } catch (error) {
      console.error("Error checking or registering email:", error);
      alert("Something went wrong. Please try again later.");
      return;
    }

    // Proceed with booking
    setIsFetching(true);

    const amount = String(extraCharges);

    const currency = location.state.flights.total_currency;
    const type = "balance";
    const payments = { type: type, amount: amount, currency: currency };
    const test = {
      type: "hold",
      selected_offers: [contactDetails[0].offer_id],
      passengers: contactDetails,
      payments: payments,
    };

    console.log("booking test", test);

    const selectedFlight = location.state.flights;
    try {
      const response = await axios.post(
        apiUrl + "/airlines/paymentIntent",
        test,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data, errors } = response.data;

      if (data) {
        console.log("payment intent creation", data);

        if (data.paymentIntentResponse.errors) {
          console.error("Error:", data.paymentIntentResponse.errors[0].message); // Log individual error messages
          alert(
            `Booking error: ${data.paymentIntentResponse.errors[0].message}`
          );
        }

        navigate("/booking", {
          state: {
            contactDetails,
            data,
            selectedFlight,
            extraBag,
            seatSelection,
          },
        });
      } else {
        console.error("Errors:", errors);
      }
    } catch (error) {
      console.error("Error booking flight:", error);
      alert("Something went wrong with booking. Please try again later.");
    } finally {
      setIsFetching(false);
    }
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

  const convertToString = (input) => {
    // Check if the input is an object and not null
    if (typeof input === "object" && input !== null) {
      return Object.values(input).join(""); // Convert object to string
    }
    return input; // If it's not an object, return it unchanged
  };

  useEffect(() => {
    extraBag = Number(extraBag).toFixed(2);
    seatSelection = Number(seatSelection).toFixed(2);
    formattedTotalAmount = price.toFixed(2); // Rounds to "1335.37" // Rounds to "1335.37"
    if (location.state.flights) {
      const duffelAncillariesElement =
        document.querySelector("duffel-ancillaries");
      console.log(location.state.flights);
      const client_key = localStorage.getItem("flightkey");

      if (duffelAncillariesElement) {
        setIsAncillaries(true);
        duffelAncillariesElement.render({
          debug: true,
          offer_id: location.state.flights.id,
          client_key: client_key,
          seat_maps: [],
          services: ["bags", "seats", "cancel_for_any_reason"],
          passengers: location.state.flights.passengers,
        });

        duffelAncillariesElement.addEventListener("onPayloadReady", (event) => {
          console.log("duffelAncillariesElement", event);

          let final_amountdata = Number.parseFloat(
            event.detail.data.payments[0].amount
          ).toFixed(2);
          event.detail.data.payments[0].amount = final_amountdata;
          let body = JSON.stringify({ data: event.detail.data });
          console.log("duffelAncillariesElement body");
          console.log(body);

          if (event.detail.metadata.baggage_services.length > 0) {
            extraBag = Number.parseFloat(
              event.detail.metadata.baggage_services[0].serviceInformation
                .total_amount
            ).toFixed(2);
          }

          if (event.detail.metadata.seat_services.length > 0) {
            seatSelection = Number.parseFloat(
              event.detail.metadata.seat_services[0].serviceInformation
                .total_amount
            ).toFixed(2);
          }
          // Listen for clicks on the body and use event delegation
          document.body.addEventListener("click", function (event) {
            // Check if the clicked element or its ancestor is the custom element with the correct data-testid
            const clickedElement = event.target.closest(
              '[data-testid="confirm-selection-for-baggage"]'
            );

            if (clickedElement) {
              console.log("Element with data-testid clicked");
              // Add your custom logic here
            }
          });
        });
      }
    }
  }, []);

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

  const getUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        apiUrl + "/authentication/profile/" + userId,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Full response: ", response);
      setEmail(response.data.email);
    } catch (error) {
      if (error.response) {
        console.error("Response Error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error", error.message);
      }
    }
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
  const flightsdata = location.state.flights;
  const navigateToFareOption = () => {
    console.log(flightsdata);
    navigate("/fareoption", { state: { flightsdata } });
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
                          color: "#003988",
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                        onClick={onSearchResultClick}
                      >
                        Search Result
                      </span>
                    </li>
                    <li className="breadcrumb-item">
                      <span
                        style={{
                          color: "#003988",
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                        onClick={navigateToFareOption}
                      >
                        Fare Option
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
                            <Form.Group controlId={`titles${index}`}>
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
                              First Name
                            </label>

                            <Form.Group controlId={`given_name${index}`}>
                              <Form.Control
                                type="text"
                                className="form-control"
                                name={`given_name${index}`}
                                placeholder="First Name"
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
                              Last name
                            </label>

                            <Form.Group controlId={`familyname${index}`}>
                              <Form.Control
                                type="text"
                                className="form-control"
                                name={`familyname${index}`}
                                placeholder="Last name"
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

                      {index === 0 && (
                        <>
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
                                    required={index === 0} // Conditionally set required
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
                                    required={index === 0} // Conditionally set required
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
                                  City
                                </label>

                                <Form.Group controlId={`city${index}`}>
                                  <Form.Control
                                    type="text"
                                    className="form-control"
                                    name={`city1${index}`}
                                    placeholder="City/Town/Department"
                                    required={index === 0} // Conditionally set required
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
                                  State
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
                                  Zip Code
                                </label>

                                <Form.Group controlId={`postal${index}`}>
                                  <Form.Control
                                    type="text"
                                    className="form-control"
                                    name={`postal${index}`}
                                    placeholder="Zip/Postal Code"
                                    required={index === 0} // Conditionally set required
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
                                    <div className="error text-danger">
                                      {error}
                                    </div>
                                  )}
                                </Form.Group>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
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
                          {location.state.flights.slices.length === 1
                            ? "One Way Flight"
                            : "Round Trip Flight"}
                        </p>

                        <hr />

                        {/* <!-- Flight Details --> */}
                        <ul className="list-unstyled">
                          <li className="d-flex justify-content-between">
                            <strong>Depart:</strong>
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
                            <strong>Class Name:</strong>
                            <span>{cabin}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Stops:</strong>
                            <span>{stops}</span>
                          </li>
                          <li className="d-flex justify-content-between">
                            <strong>Airline Name:</strong>
                            <span>{airlinesName}</span>
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
                          <span>{"$ " + formattedAmount}</span>
                        </div>

                        <div className="d-flex justify-content-between">
                          <span>
                            <strong>Taxes & Fees:</strong>
                          </span>
                          <span>{"$ " + tax_amount}</span>
                        </div>

                        <div className="d-flex justify-content-between">
                          <span>
                            <strong>Additional Checked Baggage:</strong>
                          </span>
                          <span>{extraBag && `$ ${extraBag}`}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>
                            <strong>Seat Selection:</strong>
                          </span>
                          <span>{seatSelection && `$ ${seatSelection}`}</span>
                        </div>
                        <hr />

                        {/* <!-- Total Due Section --> */}
                        <div className="d-flex justify-content-between">
                          <h5 className="font-weight-bold">Total Due:</h5>
                          <h5 className="font-weight-bold">
                            {formattedTotalAmount &&
                              `$ ${formattedTotalAmount}`}
                          </h5>
                        </div>

                        {/* <!-- Button Section --> */}
                        <div className="text-center mt-3">
                          <button
                            className="btn btn-primary btn-lg btn-block rounded-pill book-now"
                            disabled={isFetching}
                          >
                            {isFetching ? "Booking..." : "Book"}
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
            {/* Main Content */}
            <main className="booking-main">
              {" "}
              {isAncillaries && (
                <h2 className="font-weight-bold mt-3 mb-3">Add Extras</h2>
              )}
              <div id="duffelAncillariesContainer mb-5">
                {/* Duffel Ancillaries element will be rendered here */}
                <duffel-ancillaries />
              </div>
            </main>

            <div className="agreement-section mt-5">
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
