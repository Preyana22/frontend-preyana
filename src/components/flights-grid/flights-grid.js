import React, { useEffect, useState, useMemo, useRef } from "react";
import "./flight-grid.css";
import { FlightSearchInfo } from "./../flight-search-info/flight-search-info";
import { FlightInfo } from "./../flight-info/flight-info";
import { FlightNotFound } from "./../flight-search-info/flight-not-found";
import Filters from "../filters/filters";
import SearchFlight from "../search-flight/SearchFlight";

const FlightsGrid = ({ flights, criteria }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const previousFlightsData = useRef(localStorage.getItem("flightsData")); // Store the previous flightsData

  const [originalFlightData, setoriginalFlightData] = useState(() => {
    const savedFlights = localStorage.getItem("flightsData");
    return savedFlights ? JSON.parse(savedFlights) : flights?.[1] || {};
  });
  const [flightsData, setFlightsData] = useState(() => {
    const savedFlights = localStorage.getItem("flightsData");
    return savedFlights ? JSON.parse(savedFlights) : flights?.[1] || {};
  });

  const [searchCriteria, setSearchCriteria] = useState(() => {
    const savedCriteria = localStorage.getItem("searchCriteria");
    return savedCriteria ? JSON.parse(savedCriteria) : criteria || {};
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const flightsCount = useMemo(
    () =>
      Array.isArray(flightsData)
        ? flightsData.length
        : Object.keys(flightsData).length,
    [flightsData]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const dataArray = Array.isArray(flightsData)
      ? flightsData
      : Object.values(flightsData);

    return dataArray.slice(startIndex, endIndex);
  }, [flightsData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(flightsCount / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    // Scroll to the target div whenever currentPage changes
    const element = document.getElementById("search-result-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (searchInitiated) {
      setIsLoading(true);
      setFlightsData([]);
      const timer = setTimeout(() => {
        const updatedFlights = applyFilters(originalFlightData, searchCriteria);

        if (updatedFlights) {
          console.log("Flights data after filtering:", updatedFlights);
          setFlightsData(updatedFlights); // Update flightsData
        } else {
          console.error("Error: No updated flights data found!");
        }

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
      localStorage.setItem("flightsData", JSON.stringify(originalFlightData));
    }
  }, [flightsData]);

  useEffect(() => {
    if (searchCriteria && Object.keys(searchCriteria).length > 0) {
      localStorage.setItem("searchCriteria", JSON.stringify(searchCriteria));
    }
  }, [searchCriteria]);

  useEffect(() => {
    if (flights?.[1]) {
      const dataArray = Object.values(flights?.[1]); // Convert to an array
      const limitedData = dataArray.slice(0, 100); // Get the first 200 items

      setoriginalFlightData(limitedData);
      setFlightsData(limitedData);
      setCurrentPage(1); // Reset to the first page
    }

    if (
      criteria &&
      !Object.keys(criteria).origin &&
      !Object.keys(criteria).destination &&
      !Object.keys(searchCriteria).origin &&
      !Object.keys(searchCriteria).destination &&
      searchInitiated
    ) {
      setSearchCriteria(criteria);
    }
  }, [flights, criteria]);

  const handleSearch = () => {
    if (criteria) {
      setSearchCriteria(criteria);
      setSearchInitiated(true);
      setCurrentPage(1); // Reset to the first page
      localStorage.setItem("searchCriteria", JSON.stringify(criteria));
    }
  };

  const applyFilters = (flights, filterCriteria) => {
    // Ensure flights is an array or convert it
    const safeFlights = Array.isArray(flights)
      ? flights
      : Object.values(flights || {});

    if (!filterCriteria) {
      return safeFlights; // Return all flights if no criteria
    }

    return safeFlights.filter((flight) => {
      // Price filter
      const markup = Number(flight.base_amount) * 0.15; // Calculate 15% markup on base_amount
      const totalWithMarkup = Number(flight.total_amount) + markup; // Add markup to total_amount

      const withinPriceRange =
        !filterCriteria.price || // No price filter
        (totalWithMarkup >= parseFloat(filterCriteria.price[0]) &&
          totalWithMarkup <= parseFloat(filterCriteria.price[1]));

      // Stops filter
      const stops = flight.slices?.[0]?.segments?.length - 1 || 0; // Calculate stops

      const stopMapping = {
        nonstop: stops === 0,
        oneStop: stops === 1,
        twoStop: stops === 2,
        twoPlusStop: stops > 2,
      };

      let stopsFilter = filterCriteria.stops;

      if (typeof stopsFilter === "string") {
        stopsFilter = [stopsFilter]; // Convert string to array
      } else if (
        stopsFilter &&
        typeof stopsFilter === "object" &&
        !Array.isArray(stopsFilter)
      ) {
        stopsFilter = Object.keys(stopsFilter); // Convert object keys to array
      }

      // If "twoPlusStop" is in the filter criteria, show all flights
      if (stopsFilter?.includes("twoPlusStop")) {
        return true;
      }

      const matchesStops =
        !stopsFilter || // No stop filter
        stopsFilter.length === 0 ||
        (Array.isArray(stopsFilter) &&
          stopsFilter.some((stop) => stopMapping[stop]));

      // Carry-on bag filter
      const carryOnBagFilter =
        filterCriteria.carryOnBag == null || // No carry-on bag filter
        filterCriteria.carryOnBag === 0 || // If carryOnBag is 0, show all flights
        flight.slices?.some((slice) =>
          slice.segments?.some((segment) =>
            segment.passengers?.some(
              (passenger) =>
                passenger.baggages?.[1]?.quantity === filterCriteria.carryOnBag
            )
          )
        );
      let loyaltyProgrammesFilter = filterCriteria.loyaltyProgrammes;

      if (typeof loyaltyProgrammesFilter === "string") {
        loyaltyProgrammesFilter = [loyaltyProgrammesFilter]; // Convert string to array
      } else if (
        loyaltyProgrammesFilter &&
        typeof loyaltyProgrammesFilter === "object" &&
        !Array.isArray(loyaltyProgrammesFilter)
      ) {
        loyaltyProgrammesFilter = Object.keys(loyaltyProgrammesFilter); // Convert object keys to array
      }

      // Loyalty programme filter
      const matchesLoyaltyProgrammesFilter =
        !loyaltyProgrammesFilter || // No loyalty programme filter
        (Array.isArray(loyaltyProgrammesFilter) &&
          flight.slices?.some((slice) =>
            slice.segments?.some((segment) =>
              loyaltyProgrammesFilter.includes(
                segment.operating_carrier?.iata_code
              )
            )
          ));
      // Combine all filters
      const matchesAllFilters =
        withinPriceRange &&
        matchesStops &&
        carryOnBagFilter &&
        matchesLoyaltyProgrammesFilter;

      return matchesAllFilters;
    });
  };

  const handleFilters = async (filtersCriteria) => {
    // Reset current page to 1 whenever filters change
    setCurrentPage(1);

    const storedFlights = localStorage.getItem("flightsData");
    if (storedFlights) {
      const flights = JSON.parse(storedFlights);
      if (
        Object.keys(flights) &&
        Object.keys(flights).length > 0 &&
        filtersCriteria
      ) {
        const filtered = applyFilters(flights, filtersCriteria);

        setFlightsData(filtered);
        if (filtered) {
          localStorage.setItem(
            "flightsData",
            JSON.stringify(originalFlightData)
          );
        }
      } else {
        console.error("No valid flight data or filter criteria");
      }
    } else {
      console.error("No flight data found in localStorage");
    }
  };

  return (
    <section className="innerpage-wrapper">
      <div className="container" id="search-result-container">
        <SearchFlight onSearch={handleSearch} />

        <div className="flights-info-container row">
          <div className="col-12 col-md-3 col-lg-3 col-xl-3 col-xs-12 col-sm-12">
            <Filters onFiltersChange={handleFilters} flights={flightsData} />
          </div>

          <div className="col-12 col-md-9 col-lg-9 col-xl-9 col-xs-12 col-sm-12 mt-0">
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
              <>
                {paginatedData.map((flight, index) => (
                  <FlightInfo key={index} data={flight} />
                ))}
                <div className="pagination sticky-pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(idx + 1)}
                      className={currentPage === idx + 1 ? "active" : ""}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightsGrid;
