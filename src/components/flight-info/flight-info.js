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
  console.log(flight);
  const flightsdata = props.data;
  // console.log(JSON.stringify(props.data)+"props.data");

  const name = props.data.slices[0].segments[0].operating_carrier["name"];
  const flightNo =
    props.data.slices[0].segments[0].marketing_carrier_flight_number;
  const arrivalTime = props.data.slices[0].segments[0].arriving_at;
  const origin = props.data.slices[0].origin.iata_code;
  const destination = props.data.slices[0].destination.iata_code;
  const baseAmount = Number(props.data.base_amount);
  const markup = baseAmount * 0.15;
  const baseprice = baseAmount + markup;
  const tax_amount = Number(props.data.tax_amount);
  const price = baseprice + tax_amount;
  const formattedTotalAmount = price.toFixed(2);

  const date = props.data.updated_at;
  const time = props.data.slices[0].segments[0].duration;

  console.log("Name",name);
  console.log("No",flightNo);
  

  const isMultiMode = props.isMultiMode;
  const timeDiff = new Date(`${date} ${arrivalTime}`) - new Date(`${date}`);

  const navigateToFareOption = () => {
    navigate("/fareoption", { state: { flightsdata } });
  };
  return (
    <Card>
      <div className="row">
        <div className="col-12 col-sm-12 col-xs-12  p-0">
          <MultiFlightInfo data={flight} />
        </div>

        
      </div>
      <div
          className={`Flight-info ${
            isMultiMode ? "gray-background" : ""
          } `}
        >
          {/* <FlightLogo data={flight}></FlightLogo> */}

          {/* <DetailLabel mainText={name} subText={flightNo}></DetailLabel>

        <DetailLabel mainText={arrivalTime} subText={destination}></DetailLabel>
        <DetailLabel mainText="Duration" subText={time}></DetailLabel> */}
          {isMultiMode ? null : <PriceInfo amount={formattedTotalAmount} />}
          {isMultiMode ? null : (
            <Button
              className="btn btn-orange mt-1 ml-3"
              onClick={navigateToFareOption}
            >
              Book Now
            </Button>
          )}
        </div>
    </Card>
  );
};
