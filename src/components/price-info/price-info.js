import React from "react";

export const PriceInfo = (props) => {
  return <p className="text-center">{props.currency} {props.amount}</p>;
};
