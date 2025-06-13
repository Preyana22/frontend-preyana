import React, { useState, useEffect, useRef } from "react";

import html2pdf from "html2pdf.js";
import "./my-bookings.css";
import Table from "react-bootstrap/Table";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment"; // Import Moment.js
import { Form } from "react-bootstrap";
import flightwing from "../../../assets/images/flight_wing.png";
import headerlogoimage from "../../../assets/images/Preyana-pdf.png";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const MyBookings = (props) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [upcoming, setUpcoming] = useState(true); // Default to upcoming trips
  const email = localStorage.getItem("email");

  useEffect(() => {
    getBookings(email, searchQuery, upcoming);
  }, [email, searchQuery, upcoming]); // Add searchQuery and upcoming as dependencies

  // Function to get bookings from API
  const getBookings = async (email, keyword, upcoming) => {
    const configuration = {
      method: "get",
      url: apiUrl + `/booking/bookings`, // Ensure this endpoint supports filtering
      params: {
        email: email.trim() || undefined,
        keyword: keyword.trim() || undefined,
        upcoming,
      },
    };
    try {
      const result = await axios(configuration);
      console.log("result.data", result.data);
//       const filtered = result.data.filter(
//   (booking) => booking.status !== "cancelled" && booking.status !== true
// );
// setBookings(filtered);
      setBookings(result.data); 
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Function to handle the input change
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle button clicks for trips
  const handleTrips = (isUpcoming) => {
    setUpcoming(isUpcoming);
  };

  const getSingleBooking = async (bookingId, pkId) => {
    if (bookingId) {
      // Simplified check to handle both null and empty string
      console.log("Booking ID:", bookingId);
      console.log("Primary Booking ID:", pkId);
      navigate("/singlebooking", {
        state: { order_booking_id: bookingId, pk_booking_Id: pkId },
      });
    } else {
      console.log("Invalid booking ID:", bookingId);
    }
  };

  const formatDuration = (duration) => {
    const momentDuration = moment.duration(duration);
    const hours = momentDuration.hours();
    const minutes = momentDuration.minutes();

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  };

  return (
    <section className="innerpage-wrapper">
      <div className="container">
        <h3 className="font-weight-bold">Your Trips</h3>
        <div className="row m-3">
          <div className="col-12 col-md-6">
            <button
              type="button"
              className={`${
                upcoming === true
                  ? "trips_btn btn btn-outline-primary border rounded border-primary"
                  : "trips_btn btn btn-light text-secondary"
              }`}
              onClick={() => handleTrips(true)}
            >
              Upcoming Trips
            </button>
            <button
              type="button"
              className={`${
                upcoming === false
                  ? "trips_btn btn btn-outline-primary border rounded border-primary ml-2"
                  : "trips_btn btn btn-light text-secondary ml-2"
              }`}
              onClick={() => handleTrips(false)}
            >
              Past Trips
            </button>
          </div>
          <div className="col-12 col-md-6">
            <Form.Group className="position-relative">
              <Form.Control
                type="text"
                placeholder="Filter by keywords"
                value={searchQuery}
                onChange={handleInputChange}
                className="search-input"
              />
              <span className="search-icon">
                <i className="fa fa-search"></i>
              </span>
            </Form.Group>
          </div>
        </div>
        <div className="table-responsive" id="trips_table_container">
          <Table bordered hover>
            <thead>
              <tr>
                <th>Airlines</th>
                <th>Travel Date</th>
                <th>Depart Airport/Time</th>
                <th>Arrival Airport/Time</th>
                <th>Flight Duration</th>
                <th>Stops</th>
                <th>Itinerary</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <React.Fragment key={booking._id}>
                    {booking.slices.map((slice, sliceIndex) => (
                      // <tr
                      //   key={slice._id}
                      //   id={"flight-booking-" + booking._id}
                      //   className={
                      //     booking.slices.length > 1 && sliceIndex === 0
                      //       ? "disable-border"
                      //       : ""
                      //   }
                      // >
                      //   <td>
                      //     {/* <a
                      //       href="#"
                      //       onClick={(event) => {
                      //         event.preventDefault(); // Prevent appending `#` to the URL
                      //         getSingleBooking(booking.booking_id, booking._id);
                      //       }}
                      //     > */}
                      //     {booking.airlines}
                      //     {/* </a> */}
                      //   </td>
                       <tr
                        key={slice._id}
                            >
                       {/* Airline (first slice only) */}
                          {sliceIndex === 0 && (
                            <td rowSpan={booking.slices.length} className="align-middle text-start font-weight-bold" 
                            style={booking.status === "cancelled" ? { color: "#dc3545",opacity:0.7} : {}}>
                              {booking.airlines}

 
                              {booking.slices.length > 2 && <div className="text-muted">Multi-City </div>}
                              {booking.slices.length === 2 && <div className="text-muted">Round Trip</div>}
                              {booking.slices.length === 1 && <div className="text-muted">One Way </div>}
                                                           {/* Show "Cancelled" status */}
                                {/* {booking.status === "cancelled" && (
                                  <div className="text-danger font-weight-bold">Cancelled</div>
                                )} */}
                            </td>
                          )}


                        <td style={booking.status === "cancelled" ? { color: "#dc3545", opacity: 0.7 } : {}}>{moment(slice.travelDate).format("DD-MM-YYYY")}</td>
                        <td style={booking.status === "cancelled" ? { color: "#dc3545", opacity: 0.7 } : {}}>
                          {" "}
                          {slice.departCityName +
                            "  " +
                            slice.departAirport +
                            " | " +
                            moment(slice.departTime).format("hh:mm A")}
                        </td>
                        <td style={booking.status === "cancelled" ? { color: "#dc3545", opacity: 0.7 } : {}}>
                          {" "}
                          {slice.arrivalCityName +
                            "  " +
                            slice.arrivalAirport +
                            " | " +
                            moment(slice.arrivalTime).format("hh:mm A")}
                        </td>  
                        <td style={booking.status === "cancelled" ? { color: "#dc3545", opacity: 0.7 } : {}}>{slice.flightDuration}</td>
                        <td style={booking.status === "cancelled" ? { color: "#dc3545", opacity: 0.7 } : {}}>{slice.stops == null ? 0 : slice.stops}</td>
                        {sliceIndex === 0 && (
                          <td
                            rowSpan={booking.slices.length}
                            className="download-cell align-middle text-center"
                          >
                            {/* <button
                              type="submit"
                              className="download-link btn btn-light"
                              onClick={() => downloadPdf(booking.booking_id)}
                            >
                              <i className="fa fa-arrow-down"></i> Download
                            </button> */}
                            <a
                              href="#"
                              onClick={(event) => {
                                event.preventDefault(); // Prevent appending `#` to the URL
                                getSingleBooking(
                                  booking.booking_id,
                                  booking._id
                                );
                              }}
                            >
                              <i className="fa fa-eye"></i> View{" "}
                            </a>
                          </td>
                          

                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default MyBookings;
