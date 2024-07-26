import { put, takeLatest, all } from "redux-saga/effects";
import { findPaths } from "./../lib/flightManager";
import { transformFlightDates } from "./../lib/utils";

function* fetchFlights() {
  try {
    //https://my-json-server.typicode.com/mneema/mock-db/flights
    const json = yield fetch("http://192.168.1.170:3000/airlines").then(
      (response) => response.json()
    );
    return json;
    // yield put({ type: "GET_FLIGHTS_SUCCESS", json: transformFlightDates(json) });
  } catch (e) {
    console.log("error", e);
    yield put({ type: "GET_FLIGHTS_FAIL", error: e });
  }
}

function* findFlights(payload) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.payload.criteria),
  };
  console.log(requestOptions + "requestOptions");
  try {
    yield put({ type: "GET_FILTERS_SUCCESS", json: payload.payload.criteria });

    const {
      flights,
      criteria: {
        returnDate,
        origin,
        destination,
        departureDate,
        numOfPassengers,
        cabinclass,
      },
    } = payload.payload;
    const listOfFlights = {};
    const json1 = yield fetch(
      "http://192.168.1.170:3000/airlines/test",
      requestOptions
    ).then((response) => response.json());
    console.log(JSON.stringify(json1));

    /*const json = yield fetch('http://192.168.1.170:3000/airlines')
      .then(response => response.json());*/
    yield put({ type: "GET_FLIGHTS_SUCCESS", json: json1 });
    yield put({
      type: "GET_FLIGHTS_SUCCESS",
      json: transformFlightDates(json1),
    });

    if (returnDate) {
      listOfFlights.return = findPaths({
        flights,
        criteria: {
          origin: destination,
          destination: origin,
          date: returnDate,
          numOfPassengers,
        },
      });
    }

    // listOfFlights.onwards = findPaths({ flights, criteria: { origin, destination, date: departureDate, numOfPassengers } });

    yield put({ type: "GET_ROUTES_SUCCESS", json: json1 });
    return json1;
  } catch (e) {
    console.log("error", e);
    yield put({ type: "GET_ROUTES_FAIL", error: e });
  }
}

function* flightsWatcher() {
  yield takeLatest("GET_FLIGHTS", fetchFlights);
}

function* findFlightsWatcher() {
  yield takeLatest("GET_ROUTES", findFlights);
}

export default function* rootSaga() {
  yield all([flightsWatcher(), findFlightsWatcher()]);
}
