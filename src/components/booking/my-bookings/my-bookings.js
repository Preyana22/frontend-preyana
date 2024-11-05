import React, { useState, useEffect } from "react";
import "./my-bookings.css";
import Table from "react-bootstrap/Table";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment"; // Import Moment.js
import { Form } from "react-bootstrap";

const MyBookings = (props) => {
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
      // console.log("result.data", result.data);
      setBookings(result.data); // Store the data in state
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
                  ? "trips_btn btn btn-outline-primary border rounded border-primary"
                  : "trips_btn btn btn-light text-secondary"
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
        <div className="table-responsive">
          <Table striped bordered hover>
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
                      <tr key={slice._id}>
                        <td>{booking.airlines}</td>

                        <td>{moment(slice.travelDate).format("DD-MM-YYYY")}</td>
                        <td>
                          {slice.departCityName +
                            "  " +
                            slice.departAirport +
                            " | " +
                            moment(slice.departTime).format("hh:mm A")}
                        </td>
                        <td>
                          {slice.arrivalCityName +
                            "  " +
                            slice.arrivalAirport +
                            " | " +
                            moment(slice.arrivalTime).format("hh:mm A")}
                        </td>
                        <td>{slice.flightDuration}</td>
                        <td>{slice.stops == null ? 0 : slice.stops}</td>
                        {sliceIndex === 0 && (
                          <td rowSpan={booking.slices.length}>
                            <a href="#">
                              <i className="fa fa-arrow-down"></i> Download
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
