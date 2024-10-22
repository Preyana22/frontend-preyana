import React, { useEffect, useState } from "react";
import "./flight-grid.css";
import { FlightSearchInfo } from "./../flight-search-info/flight-search-info";
import { FlightInfo } from "./../flight-info/flight-info";
import { FlightNotFound } from "./../flight-search-info/flight-not-found";
import Filters from "../filters/filters";
import SearchFlight from "../search-flight/SearchFlight";

const FlightsGrid = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [flightsCount, setFlightsCount] = useState(0);

  useEffect(() => {
    console.log("Props flights:", props.flights); // Log flights data for debugging
    if (props.flights && props.flights[1]) {
      setFlightsCount(Object.entries(flights).length);
      setIsLoading(false); // Set loading to false once flights are fetched
    } else {
      setFlightsCount(0);
      // setIsLoading(false); // Even if no flights, set loading to false
    }
  }, [props.flights]);

  const flights = props.flights ? props.flights[1] : {};

  const flightsCounts = Array.isArray(flights)
    ? flights.length
    : Object.keys(flights).length;
  console.log("flightsCount", flightsCount);

  return (
    <>
      <section className="innerpage-wrapper">
        <div className="container">
          <SearchFlight />

          <div className="flights-info-container row">
            <div className="col-12 col-md-4 col-lg-4 col-xl-3 col-xs-12 col-sm-12">
              <Filters />
            </div>

            <div className="col-12 col-md-8 col-lg-8 col-xl-9 col-xs-12 col-sm-12">
              {props.criteria && (
                <FlightSearchInfo
                  criteria={props.criteria}
                  count={flightsCounts}
                  isLoading={isLoading}
                />
              )}

              {/* Show loader if still loading */}
              {
                // Check if no flights were found
                Object.entries(flights).length === 0 && !isLoading ? (
                  <FlightNotFound />
                ) : (
                  // Map through the flights if available
                  flights &&
                  Object.entries(flights).map(([key, flight]) => (
                    <FlightInfo key={key} data={flight} />
                  ))
                )
              }
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FlightsGrid;
