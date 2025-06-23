import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import * as Flags from "country-flag-icons/react/3x2";
import { Nav} from "react-bootstrap";
import "./CurrencyPicker.css";

countries.registerLocale(enLocale);

export default function CurrencyPicker() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${apiUrl}/currency/conversioncountry`);
      const list = Object.values(res.data.data).map(item => ({
        ...item,
        countryCode: countries.getAlpha2Code(item.country, "en")
      }));
      setOptions(list);
      console.log("Currency Options:", list);

      const savedCode = localStorage.getItem("selectedCurrency");
        if (savedCode) {
          const savedItem = list.find(item => item.code === savedCode);
          if (savedItem) {
            setSelected(savedItem);
            return;
          }
      }

      if (list.length) {
        try {
          const ipresponse = await fetch("https://ipapi.co/json/");
          const data = await ipresponse.json();
          const userIP = data.ip;
          console.log("User IP:", userIP);
          const response = await axios.get(apiUrl + `/airlines/coordinates/${userIP}`);
          console.log("Response from coordinates API:", response.data);
          const index = list.findIndex(item => item.code === response.data.currency.code.toUpperCase())
          setSelected(list[index]);
        } catch (error) {
          console.error("Error fetching user location or currency:", error);
          setSelected(list.at(-1));
        }
      } else {
        setSelected(list.at(-1));
      };
    })();
  }, [apiUrl]);



  const itemTemplate = opt => {
    if (!opt) return null;
    console.log(Flags);
    const Flag = Flags[opt.countryCode];
    if (Flag) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem"
      }}>
        {Flag && <Flag style={{ width: 24, height: 16, flexShrink: 0 }} />}
        <span>{opt.code}</span>
      </div>
    );
  }
  };

  const valueTemplate = opt => {
    if (!opt) return null;
    const Flag = Flags[opt.countryCode];
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
        border: "1px solid #ccc",
        borderRadius: 4,
        background: "#fff"
      }}>
        {Flag && <Flag style={{ width: 24, height: 16, flexShrink: 0 }} />}
        <span style={{ fontWeight: 500 }}>{opt.code}</span>
      </div>
    );
  };

  return (
  <Nav.Item className="px-2 d-flex align-items-center">
    <Dropdown
      className="nav-link d-flex align-items-center"
      value={selected}
      options={options}
      onChange={e => setSelected(e.value)}
      itemTemplate={itemTemplate}
      valueTemplate={valueTemplate}
      placeholder="Select Currency"
      style={{ background: "#fff", display: "inline-flex" }}
      panelStyle={{ background: "#fff" }}
      panelClassName="p-p-0"
    />
  </Nav.Item>

  );
}