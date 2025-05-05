import React, { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./filters.css";
import { connect } from "react-redux";
import { findFlights } from "../../actions";
import { useNavigate } from "react-router-dom";


const Filters = ({ flights, onFiltersChange ,onSearch}) => {
  const [price, setPrice] = useState([10, 5000]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [carryOnBag, setCarryOnBag] = useState(0);
  const [airlines, setAirlines] = useState([]);
  const navigate = useNavigate();
  const [airlineCodes, setAirlineCodes] = useState([]);
  const [airlineCounts, setairlineCounts] = useState([]);
  const [flightData, setflightData] = useState([]);
  const [duration, setDuration] = useState({
    depart: [19, 32],
    return: [15, 32],
  });

    // UseEffect to get flights data from localStorage
  useEffect(() => {
   const storedFlights = localStorage.getItem("flightsData");
   
    if (storedFlights) {
      try {
        const parsedFlights = JSON.parse(storedFlights);
        setflightData(parsedFlights);
        let uniqueLoyaltyPrograms = new Set();
        let uniqueIataCodes = new Set();
        let airlineCounts = {};
        const processFlight = (flight) => {
          // Get loyalty programs
          (flight.supported_loyalty_programmes || []).forEach((program) =>
            uniqueLoyaltyPrograms.add(program)
          );
    
          // Get IATA codes and count airlines
          if (flight.owner?.iata_code) {
           
            const iataCode = flight.owner.iata_code;
            const name = flight.owner.name;
            uniqueIataCodes.add(iataCode);
       

            if (!airlineCounts[iataCode]) {
              airlineCounts[iataCode] = { count: 1, name: name };
            } else {
              airlineCounts[iataCode].count += 1;
            }
          }
        };
        // console.log(airlineCounts);
        if (Array.isArray(parsedFlights)) {
          parsedFlights.forEach(processFlight);
        } else if (typeof parsedFlights === "object" && parsedFlights) {
          Object.values(parsedFlights).forEach(processFlight);
        } else {
          console.error("The data in localStorage is neither an array nor a valid object");
          return;
        }
    // console.log(uniqueAirlines);
        // Convert Sets to arrays
        const uniqueProgramsArray = Array.from(uniqueLoyaltyPrograms);
        const uniqueIataCodesArray = Array.from(uniqueIataCodes);
    
    
        // Update localStorage
        localStorage.setItem("uniqueLoyaltyPrograms", JSON.stringify(uniqueIataCodesArray));
        localStorage.setItem("airlineCounts", JSON.stringify(airlineCounts));
        setairlineCounts(airlineCounts);
        // Update state
        setAirlines(() => uniqueIataCodesArray);
      } catch (error) {
        console.error("Error parsing the flights data from localStorage", error);
      }
    } else {
      console.error("No flights data found in localStorage");
    }
  }, [onSearch]);
  const [filters, setFilters] = useState({});
  const updateFilters = (newFilter) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilter };
      if (typeof onFiltersChange === "function") {
        onFiltersChange(updatedFilters);
      } else {
        console.error("onFiltersChange is not a function");
      }
      return updatedFilters;
    });
  };
  
  const handlePriceChange = (newPrice) => {
    if (typeof updateFilters === "function") {
      setPrice(newPrice);
      updateFilters({ price: newPrice });
      
    } else {
      console.error("updateFilters is not a function");
    }
  };

  const handleStopsChange = (e) => {
    const { id } = e.target;
    setSelectedStops(id);
    if (typeof updateFilters === "function") {
      updateFilters({ stops: id });
    } else {
      console.error("updateFilters is not a function");
    }
  };

  const incrementBag = () => {
    setCarryOnBag((prev) => {
      const newCount = prev + 1;
      if (typeof updateFilters === "function") {
        updateFilters({ carryOnBag: newCount });
      }
      return newCount;
    });
  };

  const decrementBag = () => {
    setCarryOnBag((prev) => {
      const newCount = Math.max(0, prev - 1);
      if (typeof updateFilters === "function") {
        updateFilters({ carryOnBag: newCount });
      }
      return newCount;
    });
  };

  const handleAirlinesChange = (airlineCode) => {
    setAirlineCodes((prev) => {
      const updatedCodes = prev.includes(airlineCode)
        ? prev.filter((code) => code !== airlineCode) // Remove if already selected
        : [...prev, airlineCode]; // Add if not selected
  
      if (typeof updateFilters === "function") {
        updateFilters({
          loyaltyProgrammes: updatedCodes.length === 0 ? null : updatedCodes,
        });
      } else {
        console.error("updateFilters is not a function");
      }
  
      return updatedCodes;
    });
  };
  
  const [selectedDepartureTime, setSelectedDepartureTime] = useState('');
  const [selectedArrivalTime, setSelectedArrivalTime] = useState('');

  const timeFilters = [
    { label: 'Early Morning', value: 'earlyMorning', icon: '🌅', time: '00:00 - 04:59' },
    { label: 'Morning', value: 'morning', icon: '☀️', time: '05:00 - 11:59' },
    { label: 'Afternoon', value: 'afternoon', icon: '🌤️', time: '12:00 - 17:59' },
    { label: 'Evening', value: 'evening', icon: '🌙', time: '18:00 - 23:59' },
  ];
  const [selectedDepartureTimes, setSelectedDepartureTimes] = useState([]);
  const [selectedArrivalTimes, setSelectedArrivalTimes] = useState([]);
 const handleTimeChange = (type, timeValue) => {
  if (type === 'departure') {
    const updatedDepartureTimes = selectedDepartureTimes.includes(timeValue)
      ? selectedDepartureTimes.filter((time) => time !== timeValue)
      : [...selectedDepartureTimes, timeValue];
    setSelectedDepartureTimes(updatedDepartureTimes);
    updateFilters({ departureTime: updatedDepartureTimes });
  } else {
    const updatedArrivalTimes = selectedArrivalTimes.includes(timeValue)
      ? selectedArrivalTimes.filter((time) => time !== timeValue)
      : [...selectedArrivalTimes, timeValue];
    setSelectedArrivalTimes(updatedArrivalTimes);
    updateFilters({ arrivalTime: updatedArrivalTimes });
  }
};

  
  
  const handlePriceEdit = (e, index) => {
    const newValue = parseFloat(e.target.textContent.replace('$', '').trim());
  
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 5000) {
      const newPrice = [...price];
      newPrice[index] = newValue;
      setPrice(newPrice);
  
      // Apply the filter with the new price
      if (typeof updateFilters === "function") {
        updateFilters({ price: newPrice });
      }
    } else {
      // Reset if invalid input
      e.target.textContent = `$${price[index]}`;
      alert("Invalid price. Please enter a number between 0 and 5000.");
    }
  };
 
    const [showAll, setShowAll] = useState(false);
  
    // Sort the airlines before displaying
    const sortedAirlines = [...airlines].sort((a, b) =>
      (airlineCounts[a]?.name || a).localeCompare(airlineCounts[b]?.name || b)
    );
    
    // Show only 6 by default
    const visibleAirlines = showAll ? sortedAirlines : sortedAirlines.slice(0, 6);
    
    // Time ranges definition
const timeRanges = {
  earlyMorning: [0, 4],
  morning: [5, 11],
  afternoon: [12, 17],
  evening: [18, 23],
};
// console.log("flightData",flightData);
//Extract available time slots based on flights

const getAvailableTimeSlots = (flights, type) => {
  const availableTimes = new Set();
  
  if(flights || flights.length>0)
    flights.forEach((flight) => {
    flight.slices.forEach((slice) => {
      slice.segments.forEach((segment) => {
        const time = new Date(type === 'departure' ? segment.departing_at : segment.arriving_at).getHours();
        
        for (const [key, range] of Object.entries(timeRanges)) {
          if (time >= range[0] && time <= range[1]) {
            availableTimes.add(key);
          }
        }
      });
    });
  });
// console.log(availableTimes)
  return Array.from(availableTimes);
};
let availableDepartureTimes = [];
let availableArrivalTimes = [];

if (flightData?.length) {
  availableDepartureTimes = getAvailableTimeSlots(flightData, 'departure');
  availableArrivalTimes = getAvailableTimeSlots(flightData, 'arrival');
}

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
  {/* AIRLINES Filter */}
  <div className="filter-section">
  <h5>AIRLINES</h5>
  {sortedAirlines.length > 0 ? (
    <div className="flex flex-col space-y-2">
      {visibleAirlines.map((airlineCode, index) => (
        <div key={index} className="nextdiv">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="airline"
            value={airlineCode}
            onChange={() => handleAirlinesChange(airlineCode)}
            className="form-checkbox text-blue-600"
          />
          <span className="ml-2">
            {airlineCounts[airlineCode].name} ({airlineCounts[airlineCode].count || 0})
          </span>
        </label>
        </div>
      ))}
      
      {/* Show More / Show Less Button */}
      {sortedAirlines.length > 6 && (
        <div>
        <span
          onClick={() => setShowAll((prev) => !prev)}
          className="text-blue-600 text-sm mt-2 textcol cursor-pointer"
        >
          {showAll ? 'Show less' : 'Show more'}
        </span>
        </div>
      )}
    </div>
  ) : (
    <p>No airlines available</p>
  )}
</div>

      {/* Price Filter */}
      <div className="filter-section">
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
        <span style={{ color: "white", fontSize: "10px" }}>{price[index]}</span>
      </div>
    )}
  />
  <div className="d-flex justify-content-between mt-3">
    <span
      className="text-left"
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => handlePriceEdit(e, 0)}
    >
      ${price[0]}
    </span>
    <span
      className="text-right"
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => handlePriceEdit(e, 1)}
    >
      ${price[1]}
    </span>
  </div>
</div>
  {/* Departure Time */}
{/* <div className="flex justify-around items-start w-full ">
  <div className="filter-section">
    <h5>Departure time</h5>
    <div className="flex gap-4">
      {timeFilters.map((filter) => (
        <button
          key={`departure-${filter.value}`}
          onClick={() => handleTimeChange('departure', filter.value)}
          className={`border rounded-lg p-2 w-[100px] ${
            selectedDepartureTimes.includes(filter.value)
              ? 'bg-blue-500 text-white'
              : 'bg-white'
          }`}
        >
          <span className="text-2xl">{filter.icon}</span>
          <p>{filter.label}</p>
          <p className="text-sm">{filter.time}</p>
        </button>
      ))}
    </div>
  </div></div> */}
  {/* Arrival Time */}
  {/* <div className="filter-section">
    <h5>Arrival time</h5>
    <div className="flex gap-4">
      {timeFilters.map((filter) => (
        <button
          key={`arrival-${filter.value}`}
          onClick={() => handleTimeChange('arrival', filter.value)}
          className={`border rounded-lg p-2 w-[100px] ${
            selectedArrivalTimes.includes(filter.value)
              ? 'bg-green-500 text-white'
              : 'bg-white'
          }`}
        >
          <span className="text-2xl">{filter.icon}</span>
          <p>{filter.label}</p>
          <p className="text-sm">{filter.time}</p>
        </button>
      ))}
    </div>
  </div>
</div> */}
    {/* Departure Time */}  {/* Arrival Time */}
    <div className="flex justify-around items-start w-full">

{/* Departure Time Filter */}
<div className="filter-section">
  <h5>Departure time</h5>
  <div className="flex gap-4 flex-wrap">
    {timeFilters.map((filter) => {
      const isAvailable = availableDepartureTimes.includes(filter.value);
      const isSelected = selectedDepartureTimes.includes(filter.value);

      return (
        <button
          key={`departure-${filter.value}`}
          onClick={() => isAvailable && handleTimeChange('departure', filter.value)}
          disabled={!isAvailable}
          className={`border-slot border rounded-lg p-2 w-[100px] transition duration-200
            ${isSelected ? 'bg-blue-500 text-white' : 'bg-white'}
             ${!isSelected && !isAvailable ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : ''}
            
          `}
          title={!isAvailable ? 'Not available' : ''}
        >
          <span className="text-2xl">{filter.icon}</span>
          <p>{filter.label}</p>
          <p className="text-sm">{filter.time}</p>
        </button>
      );
    })}
  </div>
</div>

{/* Arrival Time Filter */}
<div className="filter-section">
  <h5>Arrival time</h5>
  <div className="flex gap-4 flex-wrap">
    {timeFilters.map((filter) => {
      const isAvailable = availableArrivalTimes.includes(filter.value);
      const isSelected = selectedArrivalTimes.includes(filter.value);

      return (
        <button
          key={`arrival-${filter.value}`}
          onClick={() => isAvailable && handleTimeChange('arrival', filter.value)}
          disabled={!isAvailable}
          className={`border-slot border rounded-lg p-2 w-[100px] transition duration-200
            ${isSelected ? 'bg-green-500 text-white' : 'bg-white'}
            ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title={!isAvailable ? 'Not available' : ''}
        >
          <span className="text-2xl">{filter.icon}</span>
          <p>{filter.label}</p>
          <p className="text-sm">{filter.time}</p>
        </button>
      );
    })}
  </div>
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