import React, { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./filters.css";
import { connect } from "react-redux";
import { findFlights } from "../../actions";
import { useNavigate } from "react-router-dom";

const airlineCodeMapping = {
  AC: "Air Canada",
  NZ: "Air New Zealand",
  NH: "All Nippon Airways (ANA)",
  OZ: "Asiana Airlines",
  CM: "Copa Airlines",
  MS: "EgyptAir",
  SK: "SAS (Scandinavian Airlines)",
  AI: "Air India",
  OU: "Croatia Airlines",
  BR: "EVA Air",
  SQ: "Singapore Airlines",
  AV: "Avianca",
  UA: "United Airlines",
  A3: "Aegean Airlines",
  LH: "Lufthansa",
  TK: "Turkish Airlines",
  CA: "Air China",
  TG: "Thai Airways",
  ET: "Ethiopian Airlines",
  TP: "TAP Air Portugal",
  SA: "South African Airways",
  AR: "Aerolineas Argentinas",
  AM: "Aeromexico",
  KQ: "Kenya Airways",
  SU: "Aeroflot",
  ME: "Middle East Airlines",
  CI: "China Airlines",
  MU: "China Eastern Airlines",
  MF: "XiamenAir",
  AA: "American Airlines",
  CX: "Cathay Pacific Airways",
  MH: "Malaysia Airlines",
  BA: "British Airways",
  AY: "Finnair",
  UL: "SriLankan Airlines",
  QF: "Qantas Airways",
  IB: "Iberia",
  JM: "Air Jamaica",
  AS: "Alaska Airlines",
  QR: "Qatar Airways",
  UM: "Mahan Air",
  RJ: "Royal Jordanian Airlines",
  AT: "Royal Air Maroc",
  AF: "Air France",
  KL: "KLM Royal Dutch Airlines",
  VS: "Virgin Atlantic",
  GA: "Garuda Indonesia",
  VN: "Vietnam Airlines",
  OK: "Czech Airlines",
  DL: "Delta Air Lines",
  KE: "Korean Air",
  UX: "Air Europa",
  AZ: "ITA Airways (formerly Alitalia)",
  BE: "Flybe",
  DE: "Condor",
  EN: "Air Dolomiti",
  EW: "Eurowings",
  KC: "Air Astana",
  KM: "Air Malta",
  LA: "LATAM Airlines",
  LG: "Luxair",
  LO: "LOT Polish Airlines",
  LR: "Avianca Costa Rica",
  LX: "SWISS",
  OA: "Olympic Air",
  OS: "Austrian Airlines",
  SN: "Brussels Airlines",
  TA: "TACA Airlines",
  UK: "Vistara",
  WE: "Thai Smile Airways",
  WK: "Edelweiss Air",
  ZH: "Shenzhen Airlines",
  "4U": "Germanwings",
  "4Y": "Eurowings Discover",
};

const Filters = ({ flights, onFiltersChange }) => {
  const [price, setPrice] = useState([10, 5000]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [carryOnBag, setCarryOnBag] = useState(0);
  const [airlines, setAirlines] = useState([]);
  const navigate = useNavigate();
  const [airlineCodes, setAirlineCodes] = useState([]);
  const [duration, setDuration] = useState({
    depart: [19, 32],
    return: [15, 32],
  });
// console.log(flights);
useEffect(() => {
    if (!flights || airlines.length > 0) return; // Run only if flights exist & airlines are empty

    let allLoyaltyPrograms = [];

    // Loop through the flights array
    flights.forEach((item) => {
      if (item.supported_loyalty_programmes) {
        allLoyaltyPrograms.push(...item.supported_loyalty_programmes);
      }

      // Check nested objects
      Object.values(item).forEach((innerItem) => {
        if (typeof innerItem === "object" && innerItem.supported_loyalty_programmes) {
          allLoyaltyPrograms.push(...innerItem.supported_loyalty_programmes);
        }
      });
    });

    // Remove duplicates
    const uniqueLoyaltyPrograms = [...new Set(allLoyaltyPrograms)];
    const uniqueProgramsArray = Array.from(uniqueLoyaltyPrograms);

    console.log(uniqueLoyaltyPrograms);

    // Save to localStorage
    localStorage.setItem("uniqueLoyaltyPrograms", JSON.stringify(uniqueProgramsArray));

    // Update state
    setAirlines(uniqueProgramsArray);
}, [flights]); // Runs only when flights change
// 
  // UseEffect to get flights data from localStorage
  useEffect(() => {
    const storedFlights = localStorage.getItem("flightsData");

    if (storedFlights) {
      try {
        const parsedFlights = JSON.parse(storedFlights);
        let uniqueLoyaltyPrograms = new Set();

        if (Array.isArray(parsedFlights)) {
          // If parsedFlights is an array
          parsedFlights.forEach((flight) => {
            const loyaltyPrograms = flight.supported_loyalty_programmes || [];
            loyaltyPrograms.forEach((program) =>
              uniqueLoyaltyPrograms.add(program)
            );
          });
        } else if (typeof parsedFlights === "object" && parsedFlights) {
          // If parsedFlights is an object
          Object.values(parsedFlights).forEach((flight) => {
            const loyaltyPrograms = flight.supported_loyalty_programmes || [];
            loyaltyPrograms.forEach((program) =>
              uniqueLoyaltyPrograms.add(program)
            );
          });
        } else {
          console.error(
            "The data in localStorage is neither an array nor a valid object"
          );
          return;
        }

        // Convert the Set to an array
        const uniqueProgramsArray = Array.from(uniqueLoyaltyPrograms);

        // Update localStorage
        localStorage.setItem(
          "uniqueLoyaltyPrograms",
          JSON.stringify(uniqueProgramsArray)
        );

        // Update state
        setAirlines(() => {
          return uniqueProgramsArray;
        });
      } catch (error) {
        console.error(
          "Error parsing the flights data from localStorage",
          error
        );
      }
    } else {
      console.error("No flights data found in localStorage");
    }
  }, []);

  const handlePriceChange = (newPrice) => {
    if (typeof onFiltersChange === "function") {
      setPrice(newPrice);
      onFiltersChange({ price: newPrice });
    } else {
      console.error("onFiltersChange is not a function");
    }
  };

  const handleStopsChange = (e) => {
    const { id } = e.target;
    setSelectedStops(id);
    if (typeof onFiltersChange === "function") {
      onFiltersChange({ stops: id });
    } else {
      console.error("onFiltersChange is not a function");
    }
  };

  const incrementBag = () => {
    setCarryOnBag((prev) => {
      const newCount = prev + 1;
      if (typeof onFiltersChange === "function") {
        onFiltersChange({ carryOnBag: newCount });
      }
      return newCount;
    });
  };

  const decrementBag = () => {
    setCarryOnBag((prev) => {
      const newCount = Math.max(0, prev - 1);
      if (typeof onFiltersChange === "function") {
        onFiltersChange({ carryOnBag: newCount });
      }
      return newCount;
    });
  };

  const handleAirlinesChange = (airlineCode) => {
    setAirlineCodes(airlineCode);
    if (typeof onFiltersChange === "function") {
      onFiltersChange({
        // loyaltyProgrammes: airlineCode,
        loyaltyProgrammes: airlineCode === "" ? null : airlineCode, // Reset filter if empty
      });
    } else {
      console.error("onFiltersChange is not a function");
    }
  };

  return (
    <div className="filters">
      <div className="filters-header">
        <h5>FILTERS</h5>
        <button
          type="button"
          className="btn btn-light clear-all"
          onClick={() => {
            setPrice([0, 5000]);
            setSelectedStops(""); // Reset stops to an empty string
            setAirlines([]);
            setCarryOnBag(0);
            setAirlineCodes("");
            if (typeof onFiltersChange === "function") {
              onFiltersChange({
                price: [0, 5000],
                stops: [], // Clear stops filter
                carryOnBag: 0,
                loyaltyProgrammes: airlines,
              });
            }
            navigate(0);
          }}
        >
          Clear All
        </button>
      </div>
      {/* Stops Filter */}
      <div className="filter-section">
        <h5>STOPS</h5>
        <div>
          
          <input
            type="radio"
            id="nonstop"
            name="stops"
            checked={selectedStops === "nonstop"} // Controlled input
            onChange={handleStopsChange}
          />
          <label htmlFor="nonstop">Nonstop</label>
        </div>
        <div>
          <input
            type="radio"
            id="oneStop"
            name="stops"
            checked={selectedStops === "oneStop"} // Controlled input
            onChange={handleStopsChange}
          />
          <label htmlFor="oneStop">1 Stop</label>
        </div>
        <div>
          <input
            type="radio"
            id="twoStop"
            name="stops"
            checked={selectedStops === "twoStop"} // Controlled input
            onChange={handleStopsChange}
          />
          <label htmlFor="twoStop">2 Stop</label>
        </div>
        <div>
          <input
            type="radio"
            id="twoPlusStop"
            name="stops"
            checked={selectedStops === "twoPlusStop"} // Controlled input
            onChange={handleStopsChange}
          />
          <label htmlFor="twoPlusStop">Any number of stops</label>
        </div>
      </div>

      {/* Airlines Filter */}
      <div className="filter-section">
        <h5>AIRLINES</h5>
        {airlines.length > 0 ? (
          <select
            className="form-control mb-4"
            onChange={(e) => handleAirlinesChange(e.target.value)}
          >
            <option value="">Select an airline</option>
            {airlines
              .sort((a, b) =>
                (airlineCodeMapping[a] || a).localeCompare(
                  airlineCodeMapping[b] || b
                )
              )
              .map((airlineCode, index) => (
                <option key={index} value={airlineCode}>
                  {airlineCodeMapping[airlineCode] || airlineCode}
                </option>
              ))}
          </select>
        ) : (
          <p>No airlines available</p>
        )}
      </div>
      {/* Price Filter */}
      {/* <div className="filter-section">
        <h5>PRICE</h5>
        <RangeSlider
          min={0}
          max={5000}
          step={0.5}
          value={price}
          onInput={(e) => handlePriceChange(e)}
          id="range-slider-custom"
          renderThumb={({ props, index }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "20px",
                width: "20px",
                borderRadius: "50%",
                backgroundColor: "#007bff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{ color: "white", fontSize: "10px" }}>
                {price[index]}
              </span>
            </div>
          )}
        />
        <div className="d-flex justify-content-between mt-3">
          <span className="text-left">${price[0]}</span>
          <span className="text-right">${price[1]}</span>
        </div>
      </div> */}
    <div className="filter-section">
      <h5>PRICE RANGE</h5>
      <div className="d-flex">
        <input
          type="number"
          className="form-control"
          placeholder="Min Price"
          value={price[0] === null ? "" : price[0]} // Prevent showing 0 when empty
          onChange={(e) => handlePriceChange([e.target.value === "" ? null : Number(e.target.value), price[1]])}
          min="0"
        />
        <span className="mx-2">-</span>
        <input
          type="number"
          className="form-control"
          placeholder="Max Price"
          value={price[1] === null ? "" : price[1]} // Prevent showing 0 when empty
          onChange={(e) => handlePriceChange([price[0], e.target.value === "" ? null : Number(e.target.value)])}
          min="0"
        />
      </div>
    </div>

      {/* Bags Filter */}
      {/* <div className="filter-section">
        <h5>BAGS</h5>
        <div className="bags-control">
          <label htmlFor="carryOnBag">Carry On Bag</label>
          <div className="bag-counter">
            <button onClick={decrementBag}>-</button>
            <span>{carryOnBag}</span>
            <button onClick={incrementBag}>+</button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  flights: state.flights,
});

const mapDispatchToProps = {
  findFlights,
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
