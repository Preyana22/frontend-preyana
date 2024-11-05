import React from "react";
import "./flight-search-info.css";

export const FlightSearchInfo = (props) => {
  const { origin, destination, date, returndate } = props.criteria;

  // Display the flight search info once loading is complete
  return (
    <section className="flight-search-info">
      {/* {origin && destination &&  */}
      <h3>{`${origin} to ${destination}`}</h3>
      {/* } */}
      <div>
        {props.count > 0 && (
          <p>
            {props.count} flights found, {date}
            {returndate && ` - ${returndate}`}
          </p>
        )}
      </div>
    </section>
  );
};
