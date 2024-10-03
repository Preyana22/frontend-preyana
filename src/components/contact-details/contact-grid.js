import React from "react";
import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
//import { PhoneInput } from 'react-international-phone';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./contact-grid.css";
import { useLocation } from "react-router-dom";
import flightimage from "../../assets/images/flightimage.svg";
import axios from "axios";
import moment from "moment"; // Import Moment.js

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  console.log(timestamp);
  console.log(date);

  // Extract UTC date components
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getUTCFullYear();

  // Extract UTC time components
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
  // Construct formatted date and time
  // `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  const formattedDate = `${day}-${month}-${year}`;
  console.log(formattedDate);
  return formattedDate;
};

const Contacts = (props) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Days from 1 to 31
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // Months from 1 to 12
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years

  const handleDayChange = (e) => setSelectedDay(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  const location = useLocation();
  console.log("location.state.flight", location.state.flight);
  // const name =
  //   location.state.flight.slices[0].segments[0].operating_carrier["name"];
  // const flightNo =
  //   location.state.flight.slices[0].segments[0].marketing_carrier_flight_number;
  // const arrivalTime = location.state.flight.slices[0].segments[0].arriving_at;
  const origin = location.state.flight.slices[0].origin.iata_code;
  const destination = location.state.flight.slices[0].destination.iata_code;
  const price = location.state.flight.total_amount;
  const base_amount = location.state.flight.base_amount;
  const tax_amount = location.state.flight.tax_amount;
  const date = location.state.flight.slices[0].segments[0].departing_at;
  const formattedDate = moment(date).format("DD-MM-YYYY");
  const formattedTime = moment(date).format("hh:mm A");
  const time = location.state.flight.slices[0].segments[0].duration;
  // Parse the duration using moment.js
  const momentDuration = moment.duration(time);

  // Extract the components
  const timedays = momentDuration.days();
  const hours = momentDuration.hours();
  const minutes = momentDuration.minutes();
  const cabin =
    location.state.flight.slices[0].segments[0].passengers[0]
      .cabin_class_marketing_name;
  const [phone, setPhone] = useState("");
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
    console.log(props);
    event.preventDefault();
    const { flights } = props;

    console.log(phone);
    arr.map((item, index) => {
      let familyname1 = "familyname" + index;
      let given_name1 = "given_name" + index;
      let email1 = "email" + index;

      const day = event.target[`dayOfBirth${index}`].value;
      const month = event.target[`monthOfBirth${index}`].value;
      const year = event.target[`yearOfBirth${index}`].value;

      const dateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`; // YYYY-MM-DD format

      console.log(dateOfBirth);
      console.log(JSON.stringify(item));
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
      });
    });

    console.log("fsddddddddddddddd");
    setIsFetching(true);

    console.log("location");
    console.log(location);

    const amount = location.state.flight.total_amount;
    const currency = location.state.flight.total_currency;
    const type = "balance";

    const payments = { type: type, amount: amount, currency: currency };

    var test = {
      type: "hold",
      selected_offers: [contactDetails[0].offer_id],
      passengers: contactDetails,
      payments: payments,
    };

    console.log("test");
    console.log(test);

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
      console.log("Response Data:", data.orderResponse);
      console.log("Response Data:", data.orderResponse?.errors || []);
      console.log("Response Errors:", errors);

      if (data) {
        console.log("contact details data", data);
        navigate("/booking", { state: { contactDetails, data } });
      } else {
        console.error("Errors:", errors);
      }
    } catch (error) {
      if (error.response) {
        // Handle the case where the server responded with an error status
        console.error("Response Error:", error.response.data);
        console.error("Status Code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        // Handle the case where no response was received
        console.error("No response received:", error.request);
      } else {
        // Handle other errors
        console.error("Error", error.message);
      }
    }
    setIsFetching(false);
  };

  return (
    <section className="innerpage-wrapper">
      <div id="flight-booking" className="innerpage-section-padding">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-7 col-xl-8 content-side">
              <Form onSubmit={handleSubmit}>
                <div className="lg-booking-form-heading">
                  <h3>Personal Information</h3>
                </div>
                {arr.map((item, index) => {
                  console.log(item);

                  return (
                    <div className={`personal-info${index}`}>
                      <h4>
                        <strong>
                          {item.type === "adult"
                            ? `Adult Information`
                            : `Infant Information`}
                        </strong>
                      </h4>
                      <div className="row">
                        <div className="col-6 col-md-6">
                          <div className="form-group">
                            <label>Title</label>
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
                            <label>Given Name</label>

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
                            <label>Family name</label>

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
                            <label>Email Address</label>

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
                            <label>Phone Number</label>
                            <Form.Group controlId={`phone${index}`}>
                              <PhoneInput
                                value={phone}
                                onChange={(phone) => setPhone(phone)}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Date Of Birth</label>
                            <div className="row">
                              <div className="col-4">
                                <select
                                  className="form-control"
                                  name={`dayOfBirth${index}`}
                                  value={selectedDay}
                                  onChange={handleDayChange}
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
                                  value={selectedMonth}
                                  onChange={handleMonthChange}
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
                                  value={selectedYear}
                                  onChange={handleYearChange}
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
                    </div>
                  );
                })}
                <button className="btn btn-contactorange" disabled={isFetching}>
                  {isFetching ? "Booking..." : "Book"}
                </button>
              </Form>
            </div>
            <div className="col-12 col-md-12 col-lg-5 col-xl-4 side-bar left-side-bar">
              <div className="row">
                <div className="col-12 col-md-6 col-lg-12">
                  <div className="side-bar-block detail-block style1 text-center">
                    <div className="detail-img text-center">
                      <a href="#">
                        <img src={flightimage} className="img-fluid" />
                      </a>
                    </div>

                    <div className="detail-title">
                      <h4>
                        <a href="#">
                          {origin} To {destination}
                        </a>
                      </h4>
                      <p>Oneway Flight</p>
                      <div className="rating"></div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <tbody>
                          <tr>
                            <td>Departure</td>
                            <td>{formattedDate}</td>
                          </tr>
                          <tr>
                            <td>Time</td>
                            <td>{formattedTime}</td>
                          </tr>
                          <tr>
                            <td>Class</td>
                            <td>{cabin}</td>
                          </tr>
                          <tr>
                            <td>Stops</td>
                            <td>Direct Flight</td>
                          </tr>
                          <tr>
                            <td>Flight Duration</td>
                            <td>
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
                            </td>
                          </tr>
                          <tr>
                            <td>Price</td>
                            <td>{base_amount}</td>
                          </tr>
                          <tr>
                            <td>Tax</td>
                            <td>{tax_amount}</td>
                          </tr>
                          <tr>
                            <td>Totel Price</td>
                            <td>{price}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
