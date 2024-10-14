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
    // Other necessary defaults
  });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (location.state != null && location.state.booking_id != undefined) {
      getSingleBooking(location.state.booking_id);
    } else {
      console.error("No booking ID found in state.");
      navigate("/mybookings"); // Redirect to a safe page or show an error message
    }
  }, [location.state]);

  const getSingleBooking = async (bookingId) => {
    console.log("Booking ID:", bookingId);

    const configuration = {
      method: "get",
      url: `http://3.128.255.176:3000/booking/singleorder/${bookingId}`,
      headers: { "Content-Type": "application/json" },
    };
    try {
      const result = await axios(configuration);
      console.log("Single order data:", result.data.data); // Store the data in state

      if (result.data.data != undefined) {
        // Assuming slices is an array and you want the first element
        const { slices } = result.data.data;
        const booking = result.data.data;
        console.log(booking);
        const firstSlice = slices && slices.length > 0 ? slices[0] : {};
        console.log(firstSlice.duration);
        // Example ISO 8601 duration
        const duration = firstSlice.duration;
        // Parse the duration using moment.js
        const momentDuration = moment.duration(duration);

        // Extract the components
        const days = momentDuration.days();
        const hours = momentDuration.hours();
        const minutes = momentDuration.minutes();

        setBookingData({
          slices: {
            origin: {
              iata_code: firstSlice.origin.iata_code
                ? firstSlice.origin.iata_code
                : "",
            },
            destination: {
              iata_code: firstSlice.destination.iata_code
                ? firstSlice.destination.iata_code
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

    const baseURL = "http://3.128.255.176:3000/booking";
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
    const baseURL = "http://3.128.255.176:3000/booking";
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
    const baseURL = "http://3.128.255.176:3000/booking";
    const headers = { "Content-Type": "application/json" };

    if (location.state && location.state.pkId !== undefined) {
      const test = {
        user_id: userId,
        status: "cancelled",
      };

      try {
        const updateResult = await axios.put(
          `${baseURL}/updatebookingstatus/${location.state.pkId}`,
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
        <div className="col-12 col-md-12 col-lg-12 col-xl-12 side-bar left-side-bar">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="side-bar-block detail-block style1 text-center">
                <div className="detail-img text-center">
                  <a href="#">
                    <img src={flightimage} className="img-fluid" />
                  </a>
                </div>

                <div className="detail-title">
                  <h4>
                    <a href="#">
                      {bookingData.slices.origin?.iata_code || "Unknown"} To{" "}
                      {bookingData.slices.destination?.iata_code || "Unknown"}
                    </a>
                  </h4>
                  <p>Oneway Flight</p>
                  <div className="rating"></div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <tbody>
                      {/* <tr>
                        <td>Departure</td>
                        <td>{""}</td>
                      </tr>
                      <tr>
                        <td>Time</td>
                        <td>{""}</td>
                      </tr> */}
                      <tr>
                        <td>Class</td>
                        <td>{bookingData.slices?.fare_brand_name}</td>
                      </tr>
                      <tr>
                        <td>Stops</td>
                        <td>Direct Flight</td>
                      </tr>
                      <tr>
                        <td>Flight Duration</td>
                        <td>{bookingData.slices?.duration}</td>
                      </tr>
                      <tr>
                        <td>Price</td>
                        <td>{bookingData.base_amount}</td>
                      </tr>
                      <tr>
                        <td>Tax</td>
                        <td>{bookingData.tax_amount}</td>
                      </tr>
                      <tr>
                        <td>Totel Price</td>
                        <td>{bookingData.total_amount}</td>
                      </tr>
                    </tbody>
                  </table>
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
