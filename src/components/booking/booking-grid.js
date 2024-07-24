import React from 'react';
import './booking-grid.css';
import { useLocation } from 'react-router-dom';
import { FC, Fragment, useState } from 'react'


  const MyComponent = (props) => {
  const [isFetching, setIsFetching] = useState(false)

  console.log("props");
  console.log(props);


  const location = useLocation();
  console.log("location.state.contactDetails");
  console.log(location);
  let arr=[];
  let passengers =[];
  arr=location.state.contactDetails;

  arr.map((item, index) => {
    let familyname1 ="familyname"+index;
    let given_name1 ="given_name"+index;
    let email1 ="email"+index;
    passengers.push({
        phone_number: "+" + location.state.contactDetails[index].phone,
        email: location.state.contactDetails[index].email,
        given_name: location.state.contactDetails[index].givenName,
        family_name: location.state.contactDetails[index].familyname,
        gender: location.state.contactDetails[index].gender == 'Female' ? 'F' : 'M',
        title: location.state.contactDetails[index].title,
        born_on: location.state.contactDetails[index].dateOfBirth,
        id: location.state.contactDetails[index].passenger_id,

    })
    if(location.state.contactDetails[index].type === 'infant_without_seat'){
      passengers[0].infant_passenger_id = location.state.contactDetails[index].passenger_id;
    }
  })


  console.log("passengers"+JSON.stringify(passengers));
  console.log("jwtKey"+props.flights[0]);
  const flights = props.flights || {};
  flights.nonStopFlights = props.flights;
  const flightsCount = (flights.length);
  const duffelAncillariesElement = document.querySelector(
    "duffel-ancillaries"
  );

  duffelAncillariesElement.render({    
    offer_id: location.state.contactDetails[0].offer_id,
    client_key: props.flights[0],
    services: ["bags", "seats"],
    passengers:passengers,
  
    
  });
  var test;
  // 4. Listen to 'onPayloadReady' event on the component. `event.detail.data` contains the payload you need to send to Duffel's API to create an order.
  duffelAncillariesElement.addEventListener("onPayloadReady", (event) => {

    let final_amountdata = Number.parseFloat(event.detail.data.payments[0].amount).toFixed(2);
    event.detail.data.payments[0].amount = final_amountdata;
    let body = JSON.stringify({ data: event.detail.data });
    console.log("body");
    console.log(body);

    let amountdata = Number.parseFloat(event.detail.data.payments[0].amount).toFixed(2);
    console.log(amountdata);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    test = body;
  });
  
    const duffelpaymentsElement = document.querySelector("duffel-payments");

    // 3. Render the component with the required data, you can safely call this function as many times as you want.
    duffelpaymentsElement.render({
      paymentIntentClientToken:location.state.data.client_token,
      debug: false,
      live_mode : true
    });

    // 4. Listen to 'onSuccessfulPayment' event on the component:
    duffelpaymentsElement.addEventListener("onSuccessfulPayment", () =>
      console.log("onPayloadReady\n")
    );

    // 5. If we run into an issue with the payment, you can listen to 'onFailedPayment' event:
    duffelpaymentsElement.addEventListener("onFailedPayment", (event) =>
      console.log("onPayloadReady\n", event.detail)
    );

    const bookOffer = async () => {
      console.log("fsddddddddddddddd");
      setIsFetching(true)


      console.log("location");
      console.log(location);

     const amount = props.flights[1][0].base_amount;
     const currency = props.flights[1][0].base_currency;
     const type = 'balance';

     const payments ={type:type,amount:amount,currency:currency};

      // test = {
      //     "type": "hold",
      //     "selected_offers": [location.state.contactDetails[0].offer_id],
      //     "passengers":passengers,
      //     "payments":payments
      //         }

      //         console.log("test");
      //         console.log(test);

      // const { data, errors } = await (
      //   await fetch('http://192.168.1.49:3000/airlines/book', {
      //     method: 'post',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(test)
      //   })
      // ).json()

      // if (data) {
      //   console.log(data)
      // } else {
      //   // TODO: handle the errors properly
      //   console.info(errors)
      // }
      setIsFetching(false)
    }
    return (
 
null


  )

  }




export default MyComponent


