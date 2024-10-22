import React, { useState } from "react";
import multiFlightLogo from "./../../assets/multiflight.png";
import "./multi-flight-info.css";
import "./../flight-info/flight-info.css";
import moment from "moment"; // Import Moment.js
const MultiFlightLogo = (props) => {
  return (
    <img
      src={multiFlightLogo}
      alt="multiple flights logo"
      width="32"
      height="32"
    />
  );
};

const LayoverInfo = (props) => {
  return <p className="layover-info">Layover of {props.time}</p>;
};

export const MultiFlightInfo = (props) => {
  // const arrTime = props.data.slices[0].segments[0].arriving_at;
  // const depTime = props.data.slices[0].segments[0].departing_at;
  // const arrivalTime = new Date(arrTime).toLocaleTimeString([], {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });
  // const departureTime = new Date(depTime).toLocaleTimeString([], {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });

  const formatDuration = (duration) => {
    // Extract hours, minutes, and seconds using a regular expression
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    // Get hours, minutes, seconds from match (if present, or default to 0)
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;

    // Return a formatted string
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const iata_code =
    props.data.slices[0].segments[0].operating_carrier.iata_code;
  const operating_carrier_flight_number =
    iata_code +
    props.data.slices[0].segments[0].operating_carrier_flight_number;
  const img =
    props.data.slices[0].segments[0].operating_carrier.logo_symbol_url;
  const name = props.data.slices[0].segments[0].operating_carrier.name;
  // const destinationName = props.data.slices[0].destination.name;
  // const OriginName = props.data.slices[0].origin.name;
  const arrivalTimeStamp = new Date(
    `${props.data.slices[0].segments[0].arriving_at}`
  ).getTime();
  const departureTimeStamp = new Date(
    `${props.data.slices[0].segments[0].departing_at}`
  ).getTime();
  const options = {
    weekday: "short",
    // year: "numeric",
    month: "short",
    day: "numeric",
  };
  const departuredatename = new Date(
    `${props.data.slices[0].segments[0].departing_at}`
  ).toLocaleDateString("en-us", {
    weekday: "short",
    // year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const arrivaldatename = new Date(
    `${props.data.slices[0].segments[0].arriving_at}`
  ).toLocaleDateString("en-us", {
    weekday: "short",
    // year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  // const originCode = props.data.slices[0].origin.iata_code;
  // const destinationCode = props.data.slices[0].destination.iata_code;
  // const totalFare = props.data.total_amount;
  const durationTime = props.data.slices[0].segments[0].duration;
  // Parse the duration using moment.js
  const momentDuration = moment.duration(durationTime);

  // Extract the components
  const days = momentDuration.days();
  const hours = momentDuration.hours();
  const minutes = momentDuration.minutes();

  const aircraftName = props.data.slices[0].segments[0].aircraft
    ? props.data.slices[0].segments[0].aircraft.name
    : null;
  const cabin_class =
    props.data.slices[0].segments[0].passengers[0].cabin_class_marketing_name;
  const [showHideLabel, toggleLabel] = useState("Trip Details");

  const timeDiff = arrivalTimeStamp - departureTimeStamp;
  return (
    <>
      <section className="Flight-info-details">
        {props.data.slices.map((flight) => (
          <div
            key={flight.comparison_key}
            className="itinerary-card__travel-items itinerary-card__travel-items--with-footer"
          >
            {flight.segments.map((segment, index) => (
              <div
                key={segment.id}
                className="itinerary-card__travel-item itinerary-card__travel-item--origin d-block"
              >
                <p className="mb-0">
                  <strong className="mr-1">Depart:</strong>{" "}
                  {new Date(segment.departing_at).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {","}
                  <strong>
                    {segment.origin.city_name} ({segment.origin.iata_code})
                  </strong>
                </p>
                <div className="itinerary-card__travel-item itinerary-card__travel-item--segment-info">
                  <div>
                    <img
                      className="airline-logo--small mr-4"
                      src={segment.operating_carrier.logo_symbol_url}
                      alt={`Logo for ${segment.operating_carrier.name}`}
                      id={`logo-${segment.origin.iata_code}-${segment.operating_carrier.iata_code}`}
                      phx-update="ignore"
                    />
                    <p className="mb-0">{segment.operating_carrier.name}</p>
                  </div>
                  <p className="mb-0">
                    {formatDuration(segment.duration)}
                    <span>•</span>
                    {segment.origin.city_name}
                    <span>•</span>
                    {segment.operating_carrier_flight_number}
                    <span>•</span>
                    {segment.passengers[0].cabin_class_marketing_name}
                  </p>
                </div>
                <div className="itinerary-card__travel-item itinerary-card__travel-item--destination">
                  <p className="mb-0">
                    <strong className="mr-1">Arrive at:</strong>{" "}
                    {new Date(segment.arriving_at).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {","}
                    <strong>
                      {segment.destination.city_name} (
                      {segment.destination.iata_code})
                    </strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </>
  );
};
