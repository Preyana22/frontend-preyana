import React from 'react';
import './booking-grid.css';
import { useLocation } from 'react-router-dom';
import { FC, Fragment, useState } from 'react'


  const MyComponent = (props) => {
  const [isFetching, setIsFetching] = useState(false)


  const location = useLocation();
  console.log(location.state.contactDetails);
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
  //flights[0].passengers[0].id
  duffelAncillariesElement.render({
    //offer_id: "off_0000AdycwcNfXS9AediFBL",
    //"id": "pas_0000AdXrf0Y879iGpT7vj1"

    
    offer_id: location.state.contactDetails[0].offer_id,
    client_key: props.flights[0],
    services: ["bags", "seats"],
    passengers:passengers,
    /*passengers: [
      /* {
          "phone_number": location.state.contactDetails.phone,
                    "email": location.state.contactDetails.email,
                    "born_on": location.state.contactDetails.dateOfBirth,
                    "title": location.state.contactDetails.title,
                    "gender": location.state.contactDetails.gender == 'Female'? 'f': 'm',
                    "family_name": location.state.contactDetails.familyname,
                    "given_name": location.state.contactDetails.givenName,
                    "id": location.state.contactDetails.passenger_id
        },*/
    /*  {
        phone_number: "+" + location.state.contactDetails.phone,
        email: location.state.contactDetails.email,
        given_name: location.state.contactDetails.givenName,
        family_name: location.state.contactDetails.familyname,
        gender: location.state.contactDetails.gender == 'Female' ? 'F' : 'M',
        title: location.state.contactDetails.title,
        born_on: location.state.contactDetails.dateOfBirth,
        id: location.state.contactDetails.passenger_id
      }
     
    ],*/
    
  });
  var test;
  // 4. Listen to 'onPayloadReady' event on the component. `event.detail.data` contains the payload you need to send to Duffel's API to create an order.
  duffelAncillariesElement.addEventListener("onPayloadReady", (event) => {

    let final_amountdata = Number.parseFloat(event.detail.data.payments[0].amount).toFixed(2);
    event.detail.data.payments[0].amount = final_amountdata;
    let body = JSON.stringify({ data: event.detail.data });
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
    /* fetch('http://localhost:3000/airlines/book',requestOptions)
          .then(response => response.json())
          .then(({ data }) => console.log("Order created", data))
          .catch((error) => console.error("Order creation failed", error));
    });
    // 5. Send the order creation payload to your server to create an order with the Duffel API.
    /*fetch("http://localhost:3000/airlines/book", { method: "POST", body })
      .then((response) => response.json())
      .then(({ data }) => console.log("Order created", data))
      .catch((error) => console.error("Order creation failed", error));
    });*/

   
    const duffelpaymentsElement = document.querySelector("duffel-payments");

    // 3. Render the component with the required data, you can safely call this function as many times as you want.
    duffelpaymentsElement.render({
      paymentIntentClientToken:'eyJjbGllbnRfc2VjcmV0IjoicGlfM1A3U3ZhQWcySmhFeTh2WTFxaXAzR2lrX3NlY3JldF9aa3NqM2FyWnYxRXRZb2lBc0hwN0NhR0VTIiwicHVibGlzaGFibGVfa2V5IjoicGtfdGVzdF9EQUJLY0E2Vzh6OTc0cTdPSWY0YmJ2MVQwMEpwRmMyOUpWIn0=',
      debug: true,
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
      setIsFetching(true)

      const { data, errors } = await (
        await fetch('http://localhost:3000/airlines/book', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: test
        })
      ).json()

      if (data) {
        console.log(data)
      } else {
        // TODO: handle the errors properly
        console.info(errors)
      }
      setIsFetching(false)
    }
    return (
 

      <button disabled={isFetching}
        onClick={async () => await bookOffer()}
      >{isFetching ? 'Booking…' : 'Book'}</button>


  )

  }




export default MyComponent


