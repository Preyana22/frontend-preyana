import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from "axios";
import "./CurrencyPicker.css";
const API_BASE_URL =  process.env.REACT_APP_API_BASE_URL;

const Currency = ({ onCurrencySelect }) => {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return sessionStorage.getItem("selectedCurrency") || "USD";});

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(API_BASE_URL+'/currency/supportedcurrencylist');
        const data = await response.data;
        const parsedCurrencies = Object.keys(data.data).map(code => ({
          code: code,
          name: data.data[code].currency_name,
        }));
        setCurrencyOptions(parsedCurrencies);

      } catch (error) {
        console.error("Error fetching currencies:", error);
        // Handle error, e.g., set some default currencies or show an error message
      }
    };
    fetchCurrencies();
  }, []);

  const handleSelect = async (currencyCode) => {
  console.log("Handle select is triggered");
  setSelectedCurrency(currencyCode);

  // Bubble up
  if (onCurrencySelect) {
    onCurrencySelect(currencyCode);
  }

  try {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: currencyCode }),
    };
    const response = await fetch(`${API_BASE_URL}/currency/setcurrency`, requestOptions);
    const data = await response.json(); // ✅ Fix fetch + parse JSON

    console.log("Selected currency response:", data);

    sessionStorage.setItem("selectedCurrency", currencyCode);

    // ✅ Refresh to reflect new currency
    window.location.reload();

  } catch (err) {
    console.log("Selected currency:", currencyCode);
    console.error("Failed to notify backend of new currency:", err);
  }
};


return (
  <Dropdown onSelect={handleSelect} align="end">
    <Dropdown.Toggle
      variant="link"
      id="currency-dropdown"
      className="nav-btn currency-toggle"
    >
      {selectedCurrency}
    </Dropdown.Toggle>

    {/* align="end" will automatically add Bootstrap's `.dropdown-menu-end` */}
    <Dropdown.Menu
      style={{ maxHeight: '250px', overflowY: 'auto' }}
    >
      {currencyOptions.map((currency) => (
        <Dropdown.Item key={currency.code} eventKey={currency.code}>
          {currency.name} ({currency.code})
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);
}

export default Currency;