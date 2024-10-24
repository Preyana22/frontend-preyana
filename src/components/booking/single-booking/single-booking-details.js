import React, { useState, useEffect } from "react";
import "./single-booking-details.css";
import Table from "react-bootstrap/Table";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment"; // Import Moment.js
import flightimage from "../../../assets/images/flightimage.svg";

const SingleBookingDetails = (props) => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for redirecting
  const [bookingData, setBookingData] = useState({
    slices: {
      origin: { iata_code: "" },
      destination: { iata_code: "" },
      fare_brand_name: "",
      duration: "",
    },
    base_amount: "",
    tax_amount: "",
    total_amount: "",
    booking_id: "",
    segments: {
      operating_carrier_flight_number: "",
      departure_date: "",
      cabin: "",
      stops: "",
      aircraftName: "",
    },
    // Other necessary defaults
  });
  const [sliceLength, setSliceLength] = useState();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (
      location.state != null &&
      location.state.order_booking_id != undefined
    ) {
      getSingleBooking(location.state.order_booking_id);
    } else {
      console.error("No booking ID found in state.");
      navigate("/mybookings"); // Redirect to a safe page or show an error message
    }
  }, [location.state]);

  const getSingleBooking = async (orderBookingId) => {
    console.log("Booking ID:", orderBookingId);

    const configuration = {
      method: "get",
      url: `http://192.168.1.92:3000/booking/singleorder/${orderBookingId}`,
      headers: { "Content-Type": "application/json" },
    };
    try {
      const result = await axios(configuration);
      console.log("Single order data:", result.data.data); // Store the data in state

      if (result.data.data != undefined) {
        // Assuming slices is an array and you want the first element
        const { slices } = result.data.data;
        setSliceLength(slices.length);
        console.log("slices", slices.length);
        const { segments } = result.data.data.slices[0];
        const booking = result.data.data;
        const firstSlice = slices && slices.length > 0 ? slices[0] : {};
        console.log("firstSlice", firstSlice.length);
        const firstSegment = segments && segments.length > 0 ? segments[0] : {};
        console.log(
          "firstSegment",
          firstSegment.operating_carrier_flight_number
        );
        // Example ISO 8601 duration
        const duration = firstSegment.duration;
        // Parse the duration using moment.js
        const momentDuration = moment.duration(duration);
        // Extract the components
        const days = momentDuration.days();
        const hours = momentDuration.hours();
        const minutes = momentDuration.minutes();
        const cabin = firstSegment.passengers[0].cabin_class_marketing_name;

        const date = firstSegment.departing_at;
        const formattedDate = moment(date).format("ddd D MM, YYYY, hh:mm A");
        const stops = firstSegment.stops;
        const aircraftName = firstSegment.aircraft
          ? firstSegment.aircraft.name
          : null;
        setBookingData({
          slices: {
            origin: {
              iata_code: firstSlice.origin.city_name
                ? firstSlice.origin.city_name
                : "",
            },
            destination: {
              iata_code: firstSlice.destination.city_name
                ? firstSlice.destination.city_name
                : "",
            },
            fare_brand_name: firstSlice.fare_brand_name
              ? firstSlice.fare_brand_name
              : "",
            duration: `${
              days > 0 ? `${days} day${days !== 1 ? "s" : ""}, ` : ""
            }${hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""}, ` : ""}${
              minutes > 0 ? `${minutes} minute${minutes !== 1 ? "s" : ""}` : ""
            }`, // Format the output as "1 day, 7 hours, 25 minutes"
          },
          segments: {
            operating_carrier_flight_number:
              firstSegment.operating_carrier.iata_code &&
              firstSegment.operating_carrier_flight_number
                ? firstSegment.operating_carrier.iata_code +
                  "" +
                  firstSegment.operating_carrier_flight_number
                : "",

            departure_date: formattedDate,
            cabin: cabin,
            stops: stops,
            aircraftName: aircraftName,
          },
          base_amount: booking.base_amount,
          tax_amount: booking.tax_amount,
          total_amount: booking.total_amount,
          booking_id: booking.id,
        });
      } else {
        alert("Please enter correct booking id");
        navigate("/mybookings"); // Redirect to a safe page or show an error message
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };
  const cancelBooking = async (bookingId) => {
    console.log("Booking ID:", bookingId);

    // Show confirmation dialog
    const userConfirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!userConfirmed) {
      // If user cancels the confirmation dialog, abort the process
      return;
    }

    const baseURL = "http://192.168.1.92:3000/booking";
    const headers = { "Content-Type": "application/json" };

    // Fetch cancellation details
    try {
      const cancelResult = await axios.get(
        `${baseURL}/ordercancel/${bookingId}`,
        { headers }
      );
      console.log("Single order cancel data:", cancelResult.data);

      const { errors, data } = cancelResult.data;
      if (errors && errors.length > 0) {
        console.error("Errors:", errors[0].message);
        alert(`Errors: ${errors[0].message}`);
        return;
      }

      if (data) {
        await confirmCancellation(data.id);
        navigate("/mybookings");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  // Confirm cancellation
  const confirmCancellation = async (cancelId) => {
    console.log("cancelId" + cancelId);
    const baseURL = "http://192.168.1.92:3000/booking";
    const headers = { "Content-Type": "application/json" };

    try {
      const confirmResult = await axios.get(
        `${baseURL}/ordercancelconfirm/${cancelId}`,
        { headers }
      );
      console.log("Single order cancel confirm data:", confirmResult.data);

      const { errors, data } = confirmResult.data;
      if (errors && errors.length > 0) {
        console.error("Errors:", errors[0].message);
        alert(`Errors: ${errors[0].message}`);
        return;
      }

      if (data) {
        await updateBookingStatus();
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  // Update booking status
  const updateBookingStatus = async () => {
    const baseURL = "http://192.168.1.92:3000/booking";
    const headers = { "Content-Type": "application/json" };

    if (location.state && location.state.pk_booking_Id !== undefined) {
      const test = {
        booking_id: location.state.order_booking_id,
        status: "cancelled",
      };
      console.log("update booking status", test);
      try {
        const updateResult = await axios.put(
          `${baseURL}/updatebookingstatus/${location.state.pk_booking_Id}`,
          JSON.stringify(test),
          { headers }
        );
        console.log("Update Single order status data:", updateResult.data);
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    }
  };

  return (
    <section className="innerpage-wrapper">
      <div className="container p-5">
        <h3>Booking Detail</h3>
        <div className="col-12 col-md-12 col-lg-12 col-xl-12 text-right m-4">
          <button
            className="btn btn-danger"
            onClick={() => cancelBooking(bookingData.booking_id)}
          >
            Cancel Booking
          </button>
        </div>
        {/* Additional booking details can be rendered here */}

        <div className="col-12 col-md-8 col-lg-8 col-xl-8 offset-xl-2  side-bar left-side-bar">
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
                    {bookingData.slices.origin?.iata_code || "Unknown"} To{" "}
                    {bookingData.slices.destination?.iata_code || "Unknown"}
                  </h5>
                  <p>
                    {" "}
                    {bookingData.segments.operating_carrier_flight_number},{" "}
                    {sliceLength === 1 ? "One Way Flight" : "Round Trip Flight"}
                  </p>

                  <hr />

                  {/* <!-- Flight Details --> */}
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between">
                      <strong>Departure:</strong>
                      <span>{bookingData.segments.departure_date}</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      <strong>Flight Duration:</strong>
                      <span>{bookingData.slices.duration}</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      <strong>className:</strong>
                      <span>{bookingData.segments.cabin}</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      <strong>Stops:</strong>
                      <span>{bookingData.segments.stops}</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      <strong>Aircraft Type:</strong>
                      <span>{bookingData.segments.aircraftName}</span>
                    </li>
                  </ul>

                  <hr />

                  {/* <!-- Pricing Section --> */}
                  <div className="d-flex justify-content-between">
                    <span>
                      <strong>Fare:</strong>
                    </span>
                    <span>{"$ " + bookingData.base_amount}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <a href="#" className="text-primary">
                        Taxes & Fees
                      </a>
                    </span>
                    <span>{"$ " + bookingData.tax_amount}</span>
                  </div>

                  <hr />

                  {/* <!-- Total Due Section --> */}
                  <div className="d-flex justify-content-between">
                    <h5 className="font-weight-bold">Total Due:</h5>
                    <h5 className="font-weight-bold">
                      {"$ " + bookingData.total_amount}
                    </h5>
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

export default SingleBookingDetails;
