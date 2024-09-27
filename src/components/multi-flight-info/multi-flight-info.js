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
  console.log(props.data + "props.datass");
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
  });

  const arrivaldatename = new Date(
    `${props.data.slices[0].segments[0].arriving_at}`
  ).toLocaleDateString("en-us", {
    weekday: "short",
    // year: "numeric",
    month: "short",
    day: "numeric",
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
        {/* <div className="detail-label">
          
          <a href="javascript:void(0)" onClick={() => toggleLabel( showHideLabel === 'Trip Details' ? 'Hide Details' : 'Trip Details') }>
            {showHideLabel}
          </a>
        </div>
   
       { showHideLabel === 'Hide Details' &&  */}
        <>
          <div className="itinerary-card__travel-items itinerary-card__travel-items--with-footer">
            <div className="itinerary-card__travel-item itinerary-card__travel-item--origin">
              <p className="mb-0">
                <strong className="mr-3">Depart:</strong> {departuredatename}
                {","}
                {name}
                {" | "}
                {aircraftName}
              </p>
            </div>

            <div className="itinerary-card__travel-item itinerary-card__travel-item--segment-info">
              <div></div>
              <div></div>
              <p className="mb-0">
                <img
                  className="airline-logo--small mr-4"
                  src={img}
                  alt="Logo for Duffel Airways"
                  onerror="handleAirlineLogoError(this, 'ZZ')"
                  id="logo-Heathrow Airport (LHR)-Duffel Airways-off_0000AdJAB7UV6XKZGN2MZH_0-arp_lhr_gb"
                  phx-update="ignore"
                />
                {`${days > 0 ? `${days} day${days !== 1 ? "s" : ""}, ` : ""}${
                  hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""}, ` : ""
                }${
                  minutes > 0
                    ? `${minutes} minute${minutes !== 1 ? "s" : ""}`
                    : ""
                }`}

                <span>•</span>
                {name}
                <span>•</span>
                {aircraftName}
                <span>•</span>
                {operating_carrier_flight_number}
                <span>•</span>
                {cabin_class}
              </p>
            </div>

            {/* <div className="itinerary-card__travel-item itinerary-card__travel-item--departure">
              <div></div>
              <span className="material-symbols-outlined">calendar_month</span>
              <p>{arrivaldatename}</p>
            </div> */}

            {/* <div className="itinerary-card__travel-item itinerary-card__travel-item--origin">
              <p>{departureTime}</p>
              <span className="material-symbols-outlined">flight_takeoff</span>
              <p>
                Depart from {OriginName}-{originCode}
              </p>
            </div> */}

            <div className="itinerary-card__travel-item itinerary-card__travel-item--destination">
              <p className="mb-0">
                <strong className="mr-3">Arrive at:</strong> {arrivaldatename}
                {/* {destinationName}-{destinationCode} */}
              </p>
            </div>

            {/* <div className="itinerary-card__travel-item itinerary-card__travel-item--arrival">
              <div></div>
              <span className="material-symbols-outlined">calendar_month</span>
              <p></p>
            </div> */}
          </div>

          {/*<React.Fragment>

              <DetailLabel mainText={departureTime} subText={origin}></DetailLabel>
              <DetailLabel mainText={arrivalTime} subText={destination}></DetailLabel>
              <DetailLabel mainText={getTimeDifferece(timeDiff)} subText={'Total Duration'}></DetailLabel>
              <PriceInfo amount={totalFare} />
          </React.Fragment>*/}
        </>

        {/* } */}
      </section>
    </>
  );
};
