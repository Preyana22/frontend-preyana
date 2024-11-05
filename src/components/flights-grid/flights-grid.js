import React, { useEffect, useState, useMemo } from "react";
import "./flight-grid.css";
import { FlightSearchInfo } from "./../flight-search-info/flight-search-info";
import { FlightInfo } from "./../flight-info/flight-info";
import { FlightNotFound } from "./../flight-search-info/flight-not-found";
import Filters from "../filters/filters";
import SearchFlight from "../search-flight/SearchFlight";

const FlightsGrid = ({ flights, criteria }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const [flightsData, setFlightsData] = useState(() => {
    const savedFlights = localStorage.getItem("flightsData");
    return savedFlights ? JSON.parse(savedFlights) : flights?.[1] || {};
  });

  const [searchCriteria, setSearchCriteria] = useState(() => {
    const savedCriteria = localStorage.getItem("searchCriteria");
    return savedCriteria ? JSON.parse(savedCriteria) : criteria || {};
  });

  const flightsCount = useMemo(
    () =>
      Array.isArray(flightsData)
        ? flightsData.length
        : Object.keys(flightsData).length,
    [flightsData]
  );

  useEffect(() => {
    if (searchInitiated) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setSearchInitiated(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      if (flightsCount > 0) {
        setIsLoading(false);
      }
    }

    if (
      searchCriteria &&
      !searchCriteria.origin &&
      !searchCriteria.destination
    ) {
      setIsLoading(false);
      setSearchInitiated(false);
    }
  }, [searchInitiated, flightsCount, searchCriteria]);

  useEffect(() => {
    if (flightsData) {
      localStorage.setItem("flightsData", JSON.stringify(flightsData));
    }
  }, [flightsData]);

  useEffect(() => {
    if (searchCriteria && Object.keys(searchCriteria).length > 0) {
      console.log("Saving search criteria to localStorage:", searchCriteria);
      localStorage.setItem("searchCriteria", JSON.stringify(searchCriteria));
    }
  }, [searchCriteria]);

  useEffect(() => {
    if (flights?.[1]) {
      setFlightsData(flights[1]);
    }
    if (
      criteria &&
      Object.keys(criteria).length > 0 &&
      !Object.keys(searchCriteria).length &&
      searchInitiated
    ) {
      setSearchCriteria(criteria);
    }
  }, [flights, criteria]);

  const handleSearch = () => {
    if (criteria && Object.keys(criteria).length > 0) {
      setSearchCriteria(criteria);
      setSearchInitiated(true);
      localStorage.setItem("searchCriteria", JSON.stringify(criteria));
    }
  };

  return (
    <section className="innerpage-wrapper">
      <div className="container">
        <SearchFlight onSearch={handleSearch} />

        <div className="flights-info-container row">
          <div className="col-12 col-md-4 col-lg-4 col-xl-3 col-xs-12 col-sm-12">
            <Filters />
          </div>

          <div className="col-12 col-md-8 col-lg-8 col-xl-9 col-xs-12 col-sm-12 mt-3">
            {searchCriteria && (
              <FlightSearchInfo
                criteria={searchCriteria}
                count={flightsCount}
                isLoading={isLoading}
              />
            )}

            {isLoading ? (
              <div className="loader"></div>
            ) : flightsCount === 0 ? (
              <FlightNotFound />
            ) : (
              Object.entries(flightsData).map(([key, flight]) => (
                <FlightInfo key={key} data={flight} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightsGrid;
