import React, { useState, useEffect } from "react";
import "./my-bookings.css";
import Table from "react-bootstrap/Table";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment"; // Import Moment.js
import { Form } from "react-bootstrap";

const MyBookings = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
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
      url: `http://192.168.1.92:3000/booking/bookings`, // Ensure this endpoint supports filtering
      params: {
        email: email.trim() || undefined,
        keyword: keyword.trim() || undefined,
        upcoming,
      },
    };
    try {
      const result = await axios(configuration);
      setBookings(result.data); // Store the data in state
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const getSingleBooking = async (bookingId, pkId) => {
    if (bookingId) {
      navigate("/singlebooking", {
        state: { order_booking_id: bookingId, pk_booking_Id: pkId },
      });
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

  return (
    <section className="innerpage-wrapper">
      <div className="container">
        <h3 className="font-weight-bold">Your Trips</h3>
        <div className="row m-3">
          <div className="col-12 col-md-6">
            <button
              type="button"
              className={`${
                upcoming == true
                  ? "btn btn-outline-primary border rounded border-primary"
                  : "btn btn-light  text-secondary"
              }`}
              onClick={() => handleTrips(true)}
            >
              Upcoming Trips
            </button>
            <button
              type="button"
              className={`${
                upcoming == false
                  ? "btn btn-outline-primary border rounded border-primary"
                  : "btn btn-light text-secondary"
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
                <i className="fa fa-search"></i>{" "}
              </span>
            </Form.Group>
          </div>
        </div>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Booking Reference</th>
                <th>Guest Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Time Ago</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr key={booking._id}>
                    <td>{index + 1}</td>
                    <td>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          getSingleBooking(booking.booking_id, booking._id);
                        }}
                      >
                        {booking.booking_reference}
                      </a>
                    </td>
                    <td>{booking.name}</td>
                    <td>{booking.email}</td>
                    <td>{booking.status}</td>
                    <td>{moment(booking.createdOn).format("DD-MM-YYYY")}</td>
                    <td>{moment(booking.createdOn).fromNow()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
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
