import React from "react";
import "./booking-grid.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { findFlights } from "../../actions";
import { connect } from "react-redux";
import flightimage from "../../assets/images/flightimage.svg";
import moment from "moment"; // Import Moment.js

const apiUrl = process.env.REACT_APP_API_BASE_URL;
var updated = "";
var formattedTotalAmount = "";
const MyComponent = (props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isAncillaries, setIsAncillaries] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location state", location.state);
  const origincity = location.state.selectedFlight.slices[0].origin.city_name;
  const destinationcity =
    location.state.selectedFlight.slices[0].destination.city_name;

  const baseAmount = Number(location.state.selectedFlight.base_amount);
  const markup = baseAmount * 0.15;
  const baseprice = baseAmount + markup;
  const formattedAmount = baseprice.toFixed(2); // Rounds to "1335.37"
  const tax_amount = Number(location.state.selectedFlight.tax_amount);

  const price = baseprice + tax_amount;
  formattedTotalAmount = (
    price +
    Number(location.state.extraBag) +
    Number(location.state.seatSelection)
  ).toFixed(2); // Rounds to "1335.37"

  const extraBag = location.state.extraBag;

  const seatSelection = location.state.seatSelection;
  const date = location.state.selectedFlight.slices[0].segments[0].departing_at;
  const formattedDate = moment(date).format("dd MMM D, YYYY, hh:mm A");
  const arrivaldate =
    location.state.selectedFlight.slices[0].segments[0].arriving_at;

  const time = location.state.selectedFlight.slices[0].segments[0].duration;
  const stops = location.state.selectedFlight.slices[0].segments[0].stops
    ? ""
    : "";
  const aircraftName = location.state.selectedFlight.slices[0].segments[0]
    .aircraft
    ? location.state.selectedFlight.slices[0].segments[0].aircraft.name
    : null;

  const operating_carrier_flight_number =
    location.state.selectedFlight.slices[0].segments[0].operating_carrier
      .iata_code &&
    location.state.selectedFlight.slices[0].segments[0]
      .operating_carrier_flight_number
      ? location.state.selectedFlight.slices[0].segments[0].operating_carrier
          .iata_code +
        location.state.selectedFlight.slices[0].segments[0]
          .operating_carrier_flight_number
      : null;
  // Parse the duration using moment.js
  const momentDuration = moment.duration(time);

  // Extract the components
  const timedays = momentDuration.days();
  const hours = momentDuration.hours();
  const minutes = momentDuration.minutes();
  const cabin =
    location.state.selectedFlight.slices[0].segments[0].passengers[0]
      .cabin_class_marketing_name;
  const airlinesName = location.state.selectedFlight.slices[0].segments[0]
    .operating_carrier.name
    ? location.state.selectedFlight.slices[0].segments[0].operating_carrier.name
    : "";

  useEffect(() => {
    // const errors = location.state?.data?.orderResponse?.errors;
    // if (errors && errors.length > 0) {
    //   console.log("Errors:", errors[0].message);
    //   setTimeout(() => {
    //     alert(`Errors: ${errors[0].message}`);
    //     // navigate("/");
    //   }, 1000);
    // }
  }, [location.state, navigate]);

  let arr = [];
  let passengers = [];
  arr = location.state.contactDetails;
  let payments = [];
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
    // Display a confirmation dialog to the user
    const userConfirmed = window.confirm(
      "Are you sure you want to confirm and book this flight?"
    );

    payments = {
      type: "balance",
      amount: location.state.selectedFlight.total_amount,
      currency: location.state.selectedFlight.total_currency,
    };

    console.log("payments", payments);
    // If the user clicks "Cancel", exit the function early
    if (!userConfirmed) {
      console.log("User cancel the confirmation");
      setIsPayment(false);
    }

    if (userConfirmed) {
      try {
        const test = {
          paymentIntent: location.state.data.paymentIntentResponse.data.id,
        };

        const orderData = {
          type: "instant",
          selected_offers: [location.state.contactDetails[0].offer_id],
          passengers: arr,
          payments: [payments],
          metadata: test,
        };

        // Step 1: Call /airlines/confirm API
        const confirmResponse = await fetch(apiUrl + "/airlines/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(test),
        });

        if (!confirmResponse.ok) {
          throw new Error(`HTTP error! Status: ${confirmResponse.status}`);
        }

        const confirmData = await confirmResponse.json();

        // Step 2: If confirm call is successful, call /airlines/book API
        if (location.state.contactDetails && confirmData.data) {
          const bookResponse = await axios.post(
            apiUrl + "/airlines/book",
            orderData,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const bookData = bookResponse.data;
          console.log("Book Response Data:", bookData);
          if (bookData.data.orderResponse.errors) {
            console.error(
              "Error:",
              bookData.data.orderResponse.errors[0].message
            ); // Log individual error messages
            alert(
              `Booking error: ${bookData.data.orderResponse.errors[0].message}`
            );
          }

          // Combine confirm and book responses into one array
          const combinedResult = [
            {
              type: "confirm",
              data: confirmData.data,
              errors: confirmData.errors,
            },
            { type: "book", data: bookData.data, errors: bookData.errors },
          ];

          if (combinedResult && combinedResult[1].data.orderResponse.data) {
            saveBooking(combinedResult);
          }
        } else if (confirmData.errors) {
          console.error("Errors in Confirm API:", confirmData.errors);
        }
      } catch (error) {
        console.error("Error in confirmPayment:", error);
      }
    }
  };

  function formatDuration(duration) {
    // Regex pattern to extract days, hours, minutes, and seconds from ISO 8601 duration
    const regex = /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);

    if (!matches) {
      return "Invalid duration format";
    }

    // Extract days, hours, minutes, and seconds (set to 0 if not available)
    const days = parseInt(matches[1] || 0, 10);
    const hours = parseInt(matches[2] || 0, 10);
    const minutes = parseInt(matches[3] || 0, 10);
    const seconds = parseInt(matches[4] || 0, 10);

    // Build the formatted result
    const formattedParts = [];

    if (days > 0) {
      formattedParts.push(`${days} ${days === 1 ? "day" : "days"}`);
    }
    if (hours > 0) {
      formattedParts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    }
    if (minutes > 0) {
      formattedParts.push(`${minutes} ${minutes === 1 ? "min" : "mins"}`);
    }
    if (seconds > 0) {
      formattedParts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
    }

    // Join parts with a space separator
    return formattedParts.join(" ");
  }

  const saveBooking = async (orderData) => {
    const bookingData = {
      email: orderData[1].data.orderResponse.data.passengers[0].email,
      loginEmail: localStorage.getItem("email")
        ? localStorage.getItem("email")
        : orderData[1].data.orderResponse.data.passengers[0].email,
      name: `${orderData[1].data.orderResponse.data.passengers[0].given_name} ${orderData[1].data.orderResponse.data.passengers[0].family_name}`,
      booking_reference: orderData[1].data.orderResponse.data.booking_reference,
      offer_id: orderData[1].data.orderResponse.data.offer_id,
      status: orderData[1].data.orderResponse.data.payment_status
        .awaiting_payment
        ? "pending"
        : "success",
      booking_id: orderData[1].data.orderResponse.data.id,
      address1: location.state.contactDetails[0].address1,
      address2: location.state.contactDetails[0].address2,
      city: location.state.contactDetails[0].city,
      region: location.state.contactDetails[0].region,
      postal: location.state.contactDetails[0].postal,
      country: location.state.contactDetails[0].country,
      airlines: orderData[1].data.orderResponse.data.owner.name,
      slices: [], // Initialize an empty array for slices
    };

    // Iterate through each slice and extract relevant data
    orderData[1].data.orderResponse.data.slices.forEach((slice) => {
      const segment = slice.segments[0]; // Assuming you want the first segment

      bookingData.slices.push({
        travelDate: segment.departing_at,
        departTime: segment.departing_at,
        arrivalTime: segment.arriving_at,
        flightDuration: formatDuration(slice.duration),
        stops: segment.stops.length === 0 ? null : null,
        departAirport: slice.origin.iata_code,
        arrivalAirport: slice.destination.iata_code,
        departCityName: slice.origin.city_name,
        arrivalCityName: slice.destination.city_name,
      });
    });

    // Now, bookingData contains all the relevant information, including slices
    console.log(bookingData);

    try {
      const configuration = {
        method: "post",
        url: apiUrl + "/booking/createbooking",
        data: bookingData,
      };
      console.log("configuration createbooking", configuration);

      // Make the API request
      const result = await axios(configuration);
      console.log("response", result);

      if (result.status === 201 || result.status === 200) {
        // Successfully created booking
        navigate("/success");
      } else {
        // Handle unexpected status code
        console.error(`Unexpected response status: ${result.status}`);
        alert("There was an issue processing your booking. Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);

      // Check if error is an Axios error and handle accordingly
      if (error.response) {
        // Server responded with a status code outside of the 2xx range
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(
          `Failed to create booking. Server responded with status code ${
            error.response.status
          }: ${error.response.data.message || "Unknown error"}.`
        );
      } else if (error.request) {
        // No response received from the server
        console.error("No response received:", error.request);
        alert("Failed to create booking. No response from the server.");
      } else {
        // Other errors (network issues, configuration errors, etc.)
        console.error("Error message:", error.message);
        alert(
          "An error occurred while creating the booking. Please try again."
        );
      }
    }
  };

  const convertToString = (input) => {
    // Check if the input is an object and not null
    if (typeof input === "object" && input !== null) {
      return Object.values(input).join(""); // Convert object to string
    }
    return input; // If it's not an object, return it unchanged
  };

  useEffect(() => {
    if (location.state.selectedFlight) {
      const duffelpaymentsElement = document.querySelector("duffel-payments");

      if (duffelpaymentsElement) {
        setIsPayment(true);
        duffelpaymentsElement.render({
          paymentIntentClientToken:
            location.state.data.paymentIntentResponse.data.client_token,
          debug: false,
          live_mode: true,
        });

        duffelpaymentsElement.addEventListener("onSuccessfulPayment", () => {
          console.log("onPayloadReady\n");

          // if (duffelpaymentsElement && duffelpaymentsElement.parentNode) {
          //   duffelpaymentsElement.parentNode.removeChild(duffelpaymentsElement);
          // }

          confirmPayment();
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
      <div className="innerpage-section-padding mb-5">
        <div className="container">
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
                    <label>Booking payment</label>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="col-12 col-md-12 col-lg-7 col-xl-8 content-side mb-5">
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
                {isPayment && (
                  <h2 className="font-weight-bold mt-3 mb-3">Payment</h2>
                )}
                <div id="duffelPaymentsContainer  mb-5">
                  {/* Duffel Payments element will be rendered here */}
                  <duffel-payments />
                </div>
              </main>
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
                        {location.state.selectedFlight.slices.length === 1
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
                                ? `${minutes} minute${minutes !== 1 ? "s" : ""}`
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
                          <strong>Airlines Name:</strong>
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
                          {"$ " + formattedTotalAmount}
                        </h5>
                      </div>
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
const mapStateToProps = (state) => ({
  flights: state.flights,
});

const mapDispatchToProps = {
  findFlights,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
