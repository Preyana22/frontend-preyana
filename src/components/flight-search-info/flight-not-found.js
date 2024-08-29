import React from "react";
import "./flight-search-info.css";
import noFlight from "../../assets/images/no-flight.jpg";
export const FlightNotFound = (props) => {
  return (
    <section className="flight-search-info text-center "  >
      <img
                  src={noFlight}
                  className="img-fluid banner-image"
                  alt="banner-img"
                />
      <h2 class="mt-3 text-black font-weight-bold">
      No matching options found
      for your search
      </h2>
      <h4 class="mt-3 text-black">
      Try adjusting your dates or destination to view different results.
      </h4>
    </section>
  );
};
