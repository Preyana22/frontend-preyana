import React from "react";
import "./flight-search-info.css";

export const FlightSearchInfo = (props) => {
  const {
    origin,
    destination,
    date,
    returnDate,
    origin_city_name,
    destination_city_name,
  } = props.criteria || {};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Display the flight search info once loading is complete
  return (
    <section className="flight-search-info">
      {origin_city_name && destination_city_name && (
        <h3>{`${origin_city_name} to ${destination_city_name}`}</h3>
      )}
      <div>
        {props.count > 0 && (
          <p>
            {props.count} flights found
            {/* <strong>Departing </strong>
            {formatDate(date)}
            {returnDate && (
              <>
                <strong> - Returning </strong>
                {formatDate(returnDate)}
              </>
            )} */}
          </p>
        )}
      </div>
    </section>
  );
};
