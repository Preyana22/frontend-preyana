import React, { useState, useEffect } from "react";
import "./my-bookings.css";
import Table from "react-bootstrap/Table";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment"; // Import Moment.js

const MyBookings = (props) => {
  const location = useLocation();

  const navigate = useNavigate();
  // State to hold the bookings data
  const [bookings, setBookings] = useState([]);

  // Fetch userId from localStorage
  const email = localStorage.getItem("email");

  useEffect(() => {
    getBookings(email);
  }, [email]);

  // Function to get bookings from API
  const getBookings = async (email) => {
    const configuration = {
      method: "get",
      url: `http://192.168.1.92:3000/booking/bookings/${email}`,
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
      // Simplified check to handle both null and empty string
      console.log("Booking ID:", bookingId);
      navigate("/singlebooking", {
        state: { booking_id: bookingId, pkId: pkId },
      });
    } else {
      console.log("Invalid booking ID:", bookingId);
    }
  };
  return (
    <section className="innerpage-wrapper">
      <div className="container p-5">
        <h3>Bookings</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Booking Reference</th>
              <th>Guest Name</th>
              <th>Email</th>
              <th>Username</th>
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
                  <td>{booking.userName}</td>
                  <td>{booking.status}</td>
                  <td>{moment(booking.createdOn).format("DD-MM-YYYY")}</td>
                  {/* Formatted Date */}
                  <td>{moment(booking.createdOn).fromNow()}</td>
                  {/* Time Ago */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </section>
  );
};

export default MyBookings;
