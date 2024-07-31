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

const Contacts = (props) => {
  const location = useLocation();
  console.log(location.state.flight);
  const name =
    location.state.flight.slices[0].segments[0].operating_carrier["name"];
  const flightNo =
    location.state.flight.slices[0].segments[0].marketing_carrier_flight_number;
  const arrivalTime = location.state.flight.slices[0].segments[0].arriving_at;
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

  const gender = ["Female", "Male"];

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
      console.log(JSON.stringify(item));
      contactDetails.push({
        title: titles.state.text,
        offer_id: location.state.flight.id,
        passenger_id: location.state.flight.passengers[index].id,
        familyname: event.target[familyname1].value,
        givenName: event.target[given_name1].value,
        email: event.target[email1].value,
        phone: phone,
        gender: genderdetails.state.text,
        dateOfBirth: event.target.dateOfBirth[index].value,
        type: item.type,
      });
    });

    console.log("fsddddddddddddddd");
    setIsFetching(true);

    console.log("location");
    console.log(location);

    const amount = location.state.flight.base_amount;
    const currency = location.state.flight.base_currency;
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

    const { data, errors } = await (
      await fetch("http://3.128.255.176:3000/airlines/book", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(test),
      })
    ).json();

    if (data) {
      navigate("/booking", { state: { contactDetails, data } });
    } else {
      // TODO: handle the errors properly
      console.info(errors);
    }
    setIsFetching(false);
  };

  return (
    <section class="innerpage-wrapper">
      <div id="flight-booking" class="innerpage-section-padding">
        <div class="container">
          <div class="row">
            <div class="col-12 col-md-12 col-lg-7 col-xl-8 content-side">
              <Form onSubmit={handleSubmit}>
                <div class="lg-booking-form-heading">
                  <h3>Personal Information</h3>
                </div>
                {arr.map((item, index) => {
                  console.log(JSON.stringify(item));

                  return (
                    <div class={`personal-info${index}`}>
                      <h1>
                        {item.type} {index >= 0 ? index : ""}
                      </h1>
                      <div class="row">
                        <div class="col-6 col-md-6">
                          <div class="form-group">
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

                        <div class="col-6 col-md-6">
                          <div class="form-group">
                            <label>Given Name</label>

                            <Form.Group controlId={`given_name${index}`}>
                              <Form.Control
                                type="text"
                                class="form-control"
                                name={`given_name${index}`}
                                placeholder="Given Name"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Family name</label>

                            <Form.Group controlId={`familyname${index}`}>
                              <Form.Control
                                type="text"
                                class="form-control"
                                name={`familyname${index}`}
                                placeholder="Family name"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
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

                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Email Address</label>

                            <Form.Group controlId={`email${index}`}>
                              <Form.Control
                                type="email"
                                class="form-control dpd1"
                                name={`email${index}`}
                                placeholder="email"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div class="form-group">
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
                        <div class="col-md-6">
                          <div class="form-group">
                            <label>Date Of Birth</label>
                            <Form.Group controlId="formGriddateOfDep">
                              <Form.Control
                                type="date"
                                class="form-control dpd1"
                                name="dateOfBirth"
                                placeholder="DOB"
                                required
                              />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button class="btn btn-contactorange">Book</button>
              </Form>
            </div>
            <div class="col-12 col-md-12 col-lg-5 col-xl-4 side-bar left-side-bar">
              <div class="row">
                <div class="col-12 col-md-6 col-lg-12">
                  <div class="side-bar-block detail-block style1 text-center">
                    <div class="detail-img text-center">
                      <a href="#">
                        <img src={flightimage} class="img-fluid" />
                      </a>
                    </div>

                    <div class="detail-title">
                      <h4>
                        <a href="#">
                          {origin} To {destination}
                        </a>
                      </h4>
                      <p>Oneway Flight</p>
                      <div class="rating"></div>
                    </div>

                    <div class="table-responsive">
                      <table class="table table-hover">
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
