import React from "react";
import "./flight-grid.css";
import { FlightSearchInfo } from "./../flight-search-info/flight-search-info";
import { FlightInfo } from "./../flight-info/flight-info";
import { MultiFlightInfo } from "./../multi-flight-info/multi-flight-info";
import SearchFlight from "../search-flight/SearchFlight";
import { FlightNotFound } from "./../flight-search-info/flight-not-found";
import Filters from "../filters/filters";

const FlightsGrid = (props) => {
  const flights = props.flights ? props.flights[1] : {} || {};
  flights.nonStopFlights = props.flights ? props.flights[1] : "";
  const flightsCount = flights.length;
  console.log("flights.length", flights);

  return (
    <>
      <section class="innerpage-wrapper">
        <div className="container">
          <SearchFlight />
          <div className="flights-info-container row">
            <div className="col col-md-3">
              <Filters />
            </div>
            <div className="col col-md-9">
              {props.criteria && (
                <FlightSearchInfo
                  criteria={props.criteria}
                  count={flightsCount || 0}
                />
              )}
              {flights.nonStopFlights.length == 0 ? (
                <FlightNotFound />
              ) : (
                flights.nonStopFlights &&
                flights.nonStopFlights.map((flight) => (
                  <FlightInfo data={flight} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FlightsGrid;
