import React, { useState } from "react";
import multiFlightLogo from "./../../assets/multiflight.png";
import "./multi-flight-info.css";
import "./../flight-info/flight-info.css";
import moment from "moment"; // Import Moment.js
import { useEffect } from "react";
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

  const getStopText = (segmentsCount) => {
    if (segmentsCount === 1) {
      return "Non stop";
    } else if (segmentsCount === 2) {
      return "1 stop";
    } else if (segmentsCount > 2) {
      return `${segmentsCount - 1} stops`;
    }
    return "";
  };
  // Function to calculate total trip duration
  // const calculateTotalDuration = (segments) => {
  //   if (segments.length === 0) return null;

  //   const startTime = new Date(segments[0].departing_at);
  //   const endTime = new Date(segments[segments.length - 1].arriving_at);

  //   // Convert both start and end times to UTC to avoid time zone issues
  //   const startUTC = new Date(startTime.toUTCString());
  //   const endUTC = new Date(endTime.toUTCString());

  //   // Calculate the total duration in milliseconds
  //   const durationInMillis = endUTC - startUTC;

  //   // Convert milliseconds to minutes
  //   const durationInMinutes = durationInMillis / (1000 * 60);

  //   // Calculate days, hours, and minutes
  //   const days = Math.floor(durationInMinutes / (60 * 24)); // 60 minutes * 24 hours
  //   const hours = Math.floor((durationInMinutes % (60 * 24)) / 60); // Remaining hours
  //   const minutes = Math.round(durationInMinutes % 60); // Remaining minutes

  //   // Conditionally display days, hours, and minutes
  //   if (days > 0) {
  //     return `${days}d ${hours}h ${minutes}m`; // Show days, hours, and minutes
  //   } else {
  //     return `${hours}h ${minutes}m`; // Show only hours and minutes
  //   }
  // };

  const calculateTotalDuration = (segments) => {
    if (segments.length === 0) return null;

    const startTime = new Date(segments[0].departing_at);
    const endTime = new Date(segments[segments.length - 1].arriving_at);

    // Calculate total duration in minutes
    const durationInMinutes = (endTime - startTime) / (1000 * 60);

    // Convert minutes to hours and minutes
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours}h ${minutes}m`; // Return in hours and minutes
  };

  const calculateLayover = (arrivalTime, departureTime) => {
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);

    // Calculate the layover in minutes
    const layoverInMinutes = (departure - arrival) / (1000 * 60);

    // Convert minutes to hours and minutes
    const hours = Math.floor(layoverInMinutes / 60);
    const minutes = layoverInMinutes % 60;

    return `${hours}h ${minutes}m`; // Return layover in hours and minutes
  };

  // Helper function to convert duration from ISO 8601 format to minutes
  const formatDuration = (duration) => {
    let totalMinutes = 0;

    // Check if the format is ISO 8601 (PT...)
    if (duration.startsWith("PT")) {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

      // Get hours, minutes, seconds (if present, or default to 0)
      const hours = match[1] ? parseInt(match[1], 10) : 0;
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      const seconds = match[3] ? parseInt(match[3], 10) : 0;

      // Convert everything to minutes
      totalMinutes = hours * 60 + minutes + Math.floor(seconds / 60);
    }
    // Check if the format is "18h 30m"
    else if (/^\d+h \d+m$/.test(duration)) {
      const match = duration.match(/(\d+)h (\d+)m/);

      // Get hours and minutes
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);

      // Convert everything to minutes
      totalMinutes = hours * 60 + minutes;
    } else {
      throw new Error("Unsupported duration format");
    }

    return totalMinutes;
  };

  // Helper function to calculate total duration for a given slice (including layovers)
  const calculateTotalDurationWithLayovers = (segments) => {
    let totalDuration = 0;
    let totalLayoverTime = 0;

    // Add duration of each segment (convert each segment's duration to minutes)
    segments.forEach((segment) => {
      totalDuration += formatDuration(segment.duration);
    });

    // Add layover times (between consecutive segments)
    for (let i = 0; i < segments.length - 1; i++) {
      const layoverTime = calculateLayover(
        segments[i].arriving_at,
        segments[i + 1].departing_at
      );
      totalLayoverTime += formatDuration(layoverTime); // Assuming `layoverTime` is in duration format
    }

    // Return total duration (segments + layovers) in minutes
    const totalMinutes = totalDuration + totalLayoverTime;

    // Convert the total time back to hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Return formatted time
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <section className="Flight-info-details">
        {props.data.slices.length > 0 &&
          props.data.slices.map((slice, sliceIndex) => (
            <div
              key={slice.comparison_key}
              className="itinerary-card__travel-items itinerary-card__travel-items--with-footer"
            >
              {/* Render only the first segment of each slice */}
              {slice.segments.length > 0 && (
                <div
                  key={slice.segments[0].id}
                  className="itinerary-card__travel-item itinerary-card__travel-item--origin d-block pb-0"
                >
                  <p className="mb-0">
                    <strong className="mr-1">
                      {sliceIndex === 0
                        ? "Depart:"
                        : sliceIndex === 1
                        ? "Return:"
                        : `Segment ${sliceIndex + 1}:`}
                    </strong>{" "}
                    {new Date(slice.segments[0].departing_at).toLocaleString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                    {","}
                    <strong>
                      {[
                        ...new Set(
                          slice.segments.map(
                            (segment) => segment.operating_carrier.name
                          )
                        ),
                      ].join(" | ")}
                    </strong>
                  </p>
                  <div className="itinerary-card__travel-item itinerary-card__travel-item--segment-info border rounded p-2 mt-3 ml-0 mr-0">
                    {console.log(slice)}
                    {/* {sliceIndex === 0 && (
                      <div className="logo-stack">
                        {slice.segments.map((segment) => (
                          <img
                            key={segment.id}
                            className={`airline-logo-overlap ${
                              slice.segments.length === 1 ? "single-logo" : ""
                            }`}
                            src={segment.operating_carrier.logo_symbol_url}
                            alt={`Logo for ${segment.operating_carrier.name}`}
                            id={`logo-${segment.origin.iata_code}-${segment.operating_carrier.iata_code}`}
                            phx-update="ignore"
                          />
                        ))}
                      </div>
                    )} */}
                    {sliceIndex === 0 && (
                      <div className="logo-stack">
                        {[...new Map(
                          slice.segments.map(segment => [segment.operating_carrier.iata_code, segment])
                        ).values()].map((segment) => (
                          <img
                            key={segment.operating_carrier.iata_code} // Unique key based on airline code
                            className={`airline-logo-overlap ${slice.segments.length === 1 ? "single-logo" : ""}`}
                            src={segment.operating_carrier.logo_symbol_url}
                            alt={`Logo for ${segment.operating_carrier.name}`}
                            id={`logo-${segment.origin.iata_code}-${segment.operating_carrier.iata_code}`}
                            phx-update="ignore"
                          />
                        ))}
                      </div>
                    )}
                    {sliceIndex !== 0 && (
                      <img
                        className="airline-logo--medium mr-4"
                        src={
                          slice.segments[0].operating_carrier.logo_symbol_url
                        }
                        alt={`Logo for ${slice.segments[0].operating_carrier.name}`}
                        id={`logo-${slice.segments[0].origin.iata_code}-${slice.segments[0].operating_carrier.iata_code}`}
                        phx-update="ignore"
                      />
                    )}
                    <div className="d-block">
                      <p className="mb-0 text-black">
                        <strong>
                          {new Date(
                            slice.segments[0].departing_at
                          ).toLocaleString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </p>
                      <p className="mb-0">
                        <small>
                          {" "}
                          {new Date(
                            slice.segments[0].departing_at
                          ).toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </small>
                      </p>
                      <p className="mb-0">
                        <small>{slice.segments[0].origin.city_name}</small>
                      </p>
                      <p className="mb-0">
                        <small>{slice.segments[0].origin.iata_code}</small>
                      </p>
                    </div>
                    <div className="d-block">
                      <p className="mb-0 text-black">
                        {/* Calculate total duration (including layovers) */}
                        {calculateTotalDurationWithLayovers(slice.segments)}
                      </p>
                      <p className="mb-0">
                        <small>
                          {slice.segments[0].origin.iata_code}-
                          {
                            slice.segments[slice.segments.length - 1]
                              .destination.iata_code
                          }
                        </small>
                      </p>
                    </div>
                    <div className="d-block">
                      <p className="mb-0 text-black">
                        {getStopText(slice.segments.length)}
                      </p>
                      {slice.segments.length > 1 &&
                        slice.segments.slice(0, -1).map((segment, index) => {
                          const nextSegment = slice.segments[index + 1];
                          const layoverTime = calculateLayover(
                            segment.arriving_at,
                            nextSegment.departing_at
                          );

                          return (
                            <div
                              key={segment.id}
                              className="layover-detail d-block"
                            >
                              <p className="mb-0">
                                <small>
                                  <span>{layoverTime}</span>
                                  <span className="ml-0">
                                    {segment.destination.city_name}
                                  </span>
                                </small>
                              </p>
                            </div>
                          );
                        })}
                    </div>
                    <div className="d-block">
                      <p className="mb-0 text-black">
                        <strong>
                          {new Date(
                            slice.segments[
                              slice.segments.length - 1
                            ].arriving_at
                          ).toLocaleString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </p>
                      <p className="mb-0">
                        <small>
                          {" "}
                          {new Date(
                            slice.segments[
                              slice.segments.length - 1
                            ].arriving_at
                          ).toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </small>
                      </p>
                      <p className="mb-0">
                        <small>
                          {
                            slice.segments[slice.segments.length - 1]
                              .destination.city_name
                          }
                        </small>
                      </p>
                      <p className="mb-0">
                        <small>
                          {
                            slice.segments[slice.segments.length - 1]
                              .destination.iata_code
                          }
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </section>
    </>
  );
};
