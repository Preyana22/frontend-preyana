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

const Contacts = (props) => {
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
  const date = location.state.flight.updated_at;
  const time = location.state.flight.slices[0].segments[0].duration;
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
      let dateOfBirth1 = "dateOfBirth" + index;
      console.log(dateOfBirth1);
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
        born_on: event.target[dateOfBirth1].value,
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
                                country={"us"}
                                value={phone}
                                onChange={(phone) => setPhone(phone)}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Date Of Birth</label>
                            <Form.Group controlId={`dateOfBirth${index}`}>
                              <Form.Control
                                type="date"
                                className="form-control dpd1"
                                name={`dateOfBirth${index}`}
                                placeholder="DOB"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>{" "}
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
                            <td>{date}</td>
                          </tr>
                          <tr>
                            <td>Time</td>
                            <td>{time}</td>
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
                            <td>{time}</td>
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
