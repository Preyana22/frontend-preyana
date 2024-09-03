import React from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { DetailLabel } from "./../detail-label/detail-label";
import { PriceInfo } from "./../price-info/price-info";
import nonStopFlightLogo from "./../../assets/nonstop.png";
import { getTimeDifferece } from "./../../lib/utils";
import "./flight-info.css";
import { MultiFlightInfo } from "./../multi-flight-info/multi-flight-info";
import { useNavigate } from "react-router-dom";
const FlightLogo = (props) => {
  const img =
    props.data.slices[0].segments[0].operating_carrier.logo_symbol_url;
  return <img src={img} width="32" height="32"></img>;
};

export const FlightInfo = (props) => {
  const navigate = useNavigate();
  const flight = props.data;
  //console.log(JSON.stringify(props.data)+"props.data");
  const name = props.data.slices[0].segments[0].operating_carrier["name"];
  const flightNo =
    props.data.slices[0].segments[0].marketing_carrier_flight_number;
  const arrivalTime = props.data.slices[0].segments[0].arriving_at;
  const origin = props.data.slices[0].origin.iata_code;
  const destination = props.data.slices[0].destination.iata_code;
  const price = props.data.total_amount;
  const date = props.data.updated_at;
  const time = props.data.slices[0].segments[0].duration;

  const isMultiMode = props.isMultiMode;
  const timeDiff = new Date(`${date} ${arrivalTime}`) - new Date(`${date}`);

  const navigateToContacts = () => {
    // 👇️ navigate to /contacts

    navigate("/contacts", { state: { flight } });
  };
  return (
    <Card>
      <section
        className={`Flight-info ${isMultiMode ? "gray-background" : ""}`}
      >
        {/* <FlightLogo data={flight}></FlightLogo> */}

        {/* <DetailLabel mainText={name} subText={flightNo}></DetailLabel>

        <DetailLabel mainText={arrivalTime} subText={destination}></DetailLabel>
        <DetailLabel mainText="Duration" subText={time}></DetailLabel> */}
        {isMultiMode ? null : <PriceInfo amount={price} />}
        {isMultiMode ? null : (
          <Button className="btn btn-orange" onClick={navigateToContacts}>
            Book Now
          </Button>
        )}
      </section>
      <MultiFlightInfo data={flight} />
    </Card>
  );
};
