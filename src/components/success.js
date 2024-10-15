import React from "react";
import { useNavigate } from "react-router-dom";
import "./success.css";

const Success = () => {
  const navigate = useNavigate();

  const viewBookings = () => {
    // Check if userId is present in localStorage
    const userId = localStorage.getItem("userId");

    if (userId) {
      // If userId exists, navigate to the "My Bookings" page
      navigate("/mybookings");
    } else {
      alert("Please login to see your bookings");
    }
  };

  const bookAnotherFlight = () => {
    navigate("/");
  };

  return (
    <section className="innerpage-wrapper">
      <div id="success-booking" className="innerpage-section-padding py-5">
        <div className="container">
          <div className="row justify-content-left">
            <div className="col-md-8 text-left">
              <div className="custom-form custom-form-fields">
                <h3 className="text-dark font-weight-bold mb-4">
                  <i className="fa fa-check-circle text-success mr-2"></i>
                  Success! Your Flight Ticket is Booked.
                </h3>
                <p className="text-body">
                  Congratulations! Your flight has been successfully booked.
                  We’ve sent your ticket and booking details to the email
                  addresses provided in the traveler information.
                </p>
                <p className="text-body">
                  Please check your inbox for confirmation and itinerary. Safe
                  travels, and thank you for choosing Preyana.
                </p>
                <p className="text-body mb-4">
                  If you need any assistance, feel free to contact our support
                  team at
                  <a href="mailto:#" className="text-primary ml-1">
                    customersupport@preyana.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="row justify-content-left ml-3">
            <div className="col-md-3 text-center">
              <button
                type="button"
                className="btn btn-outline-primary border border-primary btn-block rounded-pill"
                onClick={bookAnotherFlight}
              >
                Book Another Flight
              </button>
            </div>
            <div className="col-md-3 text-center">
              <button
                type="button"
                className="btn btn-orange btn-block rounded-pill"
                onClick={viewBookings}
              >
                View Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Success;
