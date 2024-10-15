import React from "react";
import "./booking-grid.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { findFlights } from "../../actions";
import { connect } from "react-redux";

const MyComponent = (props) => {
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const errors = location.state?.data?.orderResponse?.errors;
    if (errors && errors.length > 0) {
      console.log("Errors:", errors[0].message);

      setTimeout(() => {
        alert(`Errors: ${errors[0].message}`);
        // navigate("/");
      }, 1000);
    }
  }, [location.state, navigate]);

  let arr = [];
  let passengers = [];
  arr = location.state.contactDetails;

  arr.map((item, index) => {
    passengers.push({
      phone_number: location.state.contactDetails[index].phone_number,
      email: location.state.contactDetails[index].email,
      given_name: location.state.contactDetails[index].given_name,
      family_name: location.state.contactDetails[index].family_name,
      gender: location.state.contactDetails[index].gender,
      title: location.state.contactDetails[index].title,
      born_on: location.state.contactDetails[index].born_on,
      id: location.state.contactDetails[index].id,
      address1: location.state.contactDetails[index].address1,
      address2: location.state.contactDetails[index].address2,
      city: location.state.contactDetails[index].city,
      region: location.state.contactDetails[index].region,
      postal: location.state.contactDetails[index].postal,
      country: location.state.contactDetails[index].country,
    });
    if (location.state.contactDetails[index].type === "infant_without_seat") {
      passengers[0].infant_passenger_id =
        location.state.contactDetails[index].passenger_id;
    }
  });
  const confirmPayment = async () => {
    console.log(
      "location.state.data.paymentIntentResponse.data",
      location.state.data.paymentIntentResponse.data.id
    );

    const test = {
      paymentIntent: location.state.data.paymentIntentResponse.data.id,
    };

    const { data, errors } = await (
      await fetch("http://192.168.1.92:3000/airlines/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(test),
      })
    ).json();
    console.log("Response Data:", data);
    console.log("Response Errors:", errors);
  };

  const saveBooking = async () => {
    // console.log(
    //   "location.state.data.orderResponse.data",
    //   location.state.data.orderResponse
    // );
    // console.log("location.state.contactdetails", location.state.contactDetails);
    const configuration = {
      method: "post",
      url: "http://192.168.1.92:3000/booking/createbooking",
      data: {
        email: location.state.data.orderResponse.data.passengers[0].email,
        name:
          location.state.data.orderResponse.data.passengers[0].given_name +
          " " +
          location.state.data.orderResponse.data.passengers[0].family_name,
        booking_reference:
          location.state.data.orderResponse.data.booking_reference,
        offer_id: location.state.data.orderResponse.data.offer_id,
        status:
          location.state.data.orderResponse.data.payment_status
            .awaiting_payment === true
            ? "pending"
            : "success",
        booking_id: location.state.data.orderResponse.data.id,
        address1: location.state.contactDetails[0].address1,
        address2: location.state.contactDetails[0].address2,
        city: location.state.contactDetails[0].city,
        region: location.state.contactDetails[0].region,
        postal: location.state.contactDetails[0].postal,
        country: location.state.contactDetails[0].country,
      },
    };
    await axios(configuration)
      .then((result) => {
        console.log("response", result);

        if (result) {
          confirmPayment();

          navigate("/success");
        }
      })
      .catch((error) => {
        error = new Error();
      });
  };
  const convertToString = (input) => {
    // Check if the input is an object and not null
    if (typeof input === "object" && input !== null) {
      return Object.values(input).join(""); // Convert object to string
    }
    return input; // If it's not an object, return it unchanged
  };

  useEffect(() => {
    if (props.flights) {
      const duffelAncillariesElement =
        document.querySelector("duffel-ancillaries");

      const client_key = convertToString(props.flights[0]);

      if (duffelAncillariesElement) {
        duffelAncillariesElement.render({
          offer_id: location.state.contactDetails[0].offer_id,
          client_key: client_key,
          services: ["bags", "seats"],
          passengers: passengers,
        });

        duffelAncillariesElement.addEventListener("onPayloadReady", (event) => {
          let final_amountdata = Number.parseFloat(
            event.detail.data.payments[0].amount
          ).toFixed(2);
          event.detail.data.payments[0].amount = final_amountdata;
          let body = JSON.stringify({ data: event.detail.data });
          console.log("duffelAncillariesElement body");
          console.log(body);
        });
      }

      const duffelpaymentsElement = document.querySelector("duffel-payments");
      if (duffelpaymentsElement) {
        duffelpaymentsElement.render({
          paymentIntentClientToken:
            location.state.data.paymentIntentResponse.data.client_token,
          debug: false,
          live_mode: true,
        });

        duffelpaymentsElement.addEventListener("onSuccessfulPayment", () => {
          console.log("onPayloadReady\n");

          // Remove duffelAncillariesElement and duffelpaymentsElement from the DOM
          if (duffelAncillariesElement && duffelAncillariesElement.parentNode) {
            duffelAncillariesElement.parentNode.removeChild(
              duffelAncillariesElement
            );
          }

          if (duffelpaymentsElement && duffelpaymentsElement.parentNode) {
            duffelpaymentsElement.parentNode.removeChild(duffelpaymentsElement);
          }
          saveBooking();
        });

        duffelpaymentsElement.addEventListener("onFailedPayment", (event) =>
          console.log("onPayloadReady\n", event.detail)
        );
      }
    }
  }, [location.state]);
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

  const bookOffer = async () => {
    console.log("fsddddddddddddddd");
    setIsFetching(true);

    console.log("location");
    console.log(location);

    const amount = props.flights[1][0].base_amount;
    const currency = props.flights[1][0].base_currency;
    const type = "balance";

    const payments = { type: type, amount: amount, currency: currency };

    setIsFetching(false);
  };
  // Check if props data is available; if not, redirect to home page
  useEffect(() => {
    if (!props.flights || props.flights.length === 0) {
      console.error("Props data is missing, redirecting to home page.");
      navigate("/"); // Redirect to home page
    }
  }, [props.flights, navigate]);

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
      <div className="innerpage-section-padding">
        <div className="container">
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
                    <label>Booking payment</label>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="col-12 col-md-12 col-lg-7 col-xl-8 content-side">
              {/* Main Content */}
              <main className="booking-main">
                <div id="duffelAncillariesContainer">
                  {/* Duffel Ancillaries element will be rendered here */}
                  <duffel-ancillaries />
                </div>
                <div id="duffelPaymentsContainer">
                  {/* Duffel Payments element will be rendered here */}
                  <duffel-payments />
                </div>
              </main>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
