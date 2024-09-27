import React from "react";
import "./flight-search-info.css";

export const FlightSearchInfo = (props) => {
  const { origin, destination, date } = props.criteria;

  // Display the flight search info once loading is complete
  return (
    <section className="flight-search-info">
      <h3>{`${origin} to ${destination}`}</h3>
      <p>
        {props.count} flights found, {date}
      </p>
      {/* Only show loader if origin and destination are defined */}
      {props.isLoading && origin && destination && (
        <div className="loader"></div>
      )}
    </section>
  );
};
