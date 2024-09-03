import React, { useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./filters.css";

const Filters = () => {
  const [price, setPrice] = useState([677.98, 1200.67]);

  const [duration, setDuration] = useState({
    depart: [19, 32],
    return: [15, 32],
  });

  const [carryOnBag, setCarryOnBag] = useState(0);

  const incrementBag = () => setCarryOnBag(carryOnBag + 1);
  const decrementBag = () => setCarryOnBag(carryOnBag > 0 ? carryOnBag - 1 : 0);

  return (
    <div className="filters">
      <div className="filters-header">
        <h5>FILTERS</h5>
        <a href="#" className="clear-all">
          Clear All
        </a>
      </div>
      <div className="filter-section">
        <h5>STOPS</h5>
        <div>
          <input type="checkbox" id="nonstop" name="nonstop" />
          <label htmlFor="nonstop">Nonstop (2)</label>
        </div>
        <div>
          <input type="checkbox" id="oneStop" name="oneStop" />
          <label htmlFor="oneStop">1 Stop (12)</label>
        </div>
        <div>
          <input type="checkbox" id="twoStop" name="twoStop" />
          <label htmlFor="twoStop">2 Stop (23)</label>
        </div>
        <div>
          <input type="checkbox" id="twoPlusStop" name="twoPlusStop" />
          <label htmlFor="twoPlusStop">2+ Stop (19)</label>
        </div>
      </div>

      <div className="filter-section">
        <h5>AIRLINES</h5>
        <div>
          <input type="checkbox" id="airCanada" name="airCanada" />
          <label htmlFor="airCanada">Air Canada (2)</label>
        </div>
        <div>
          <input type="checkbox" id="airFrance" name="airFrance" />
          <label htmlFor="airFrance">Air France (2)</label>
        </div>
        <div>
          <input type="checkbox" id="airIndia" name="airIndia" />
          <label htmlFor="airIndia">Air India (7)</label>
        </div>
        {/* Add more airlines similarly */}
        <div className="more">
          <a href="#">+ 34 more</a>
        </div>
      </div>

      <div className="filter-section">
        <h5>PRICE</h5>
        <RangeSlider
          min={price[0]}
          max={price[1]}
          step={5}
          value={[price[0], price[1]]}
          id="range-slider-custom"
          rangeSlideDisable={false}
          thumbsDisabled={[false, false]}
        />
        <div className="d-flex justify-content-between mt-3">
          <span className="text-left">${price[0]}</span>
          <span className="text-right">${price[1]}</span>
        </div>
      </div>

      <div className="filter-section">
        <h5>FLIGHT DURATION</h5>
        <p>Depart</p>
        <RangeSlider
          min={duration.depart[0]}
          max={duration.depart[1]}
          step={5}
          value={[duration.depart[0], duration.depart[1]]}
          id="range-slider-custom"
          rangeSlideDisable={false}
          thumbsDisabled={[false, false]}
        />
        <div className="d-flex justify-content-between mt-3">
          <span className="text-left">{duration.depart[0]} hr 10 min</span>
          <span className="text-right">{duration.depart[1]} hr 45 min</span>
        </div>

        <p>Return</p>
        <RangeSlider
          min={duration.return[0]}
          max={duration.return[1]}
          step={5}
          value={[duration.return[0], duration.return[1]]}
          id="range-slider-custom"
          rangeSlideDisable={false}
          thumbsDisabled={[false, false]}
        />
        <div className="d-flex justify-content-between mt-3">
          <span className="text-left">{duration.return[0]} hr 10 min</span>
          <span className="text-right">{duration.return[1]} hr 45 min</span>
        </div>
      </div>
      <div className="filter-section">
        <h5>BAGS</h5>
        <div className="bags-control">
          <label htmlFor="carryOnBag">Carry on bag</label>
          <div className="bag-counter">
            <button onClick={decrementBag}>-</button>
            <span>{carryOnBag}</span>
            <button onClick={incrementBag}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
