import React from "react";
import "./flight-search-info.css";

export const FlightSearchInfo = (props) => {
  console.log("props.criteria", props.criteria);
  const { origin, destination, date, returndate } = props.criteria;

  // Display the flight search info once loading is complete
  return (
    <section className="flight-search-info">
      <h3>{`${origin} to ${destination}`}</h3>
      <p>
        {props.count > 0 && (
          <p>
            {props.count} flights found, {date}
            {returndate && ` - ${returndate}`}
          </p>
        )}
      </p>
      {/* Only show loader if origin and destination are defined */}
      {props.isLoading && origin && destination && (
        <div className="loader"></div>
      )}
    </section>
  );
};
