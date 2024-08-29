import React from "react";
import "./flight-grid.css";
import { FlightSearchInfo } from "./../flight-search-info/flight-search-info";
import { FlightInfo } from "./../flight-info/flight-info";
import { MultiFlightInfo } from "./../multi-flight-info/multi-flight-info";

const FlightsGrid = (props) => {
  const flights = props.flights ? props.flights[1] : {} || {};
  flights.nonStopFlights = props.flights ? props.flights[1] : "";
  const flightsCount = flights.length;
  return (
    <>
      <section class="innerpage-wrapper">
        <div className="container">
          <div className="flights-info-container">
            {props.criteria && (
              <FlightSearchInfo
                criteria={props.criteria}
                count={flightsCount || 0}
              />
            )}
            {flights.nonStopFlights &&
              flights.nonStopFlights.map((flight) => (
                <FlightInfo data={flight} />
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FlightsGrid;
