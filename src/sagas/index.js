import { put, takeLatest, all } from "redux-saga/effects";
import { findPaths } from "./../lib/flightManager";
import { transformFlightDates } from "./../lib/utils";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

function* fetchFlights() {
  // try {
  //   //https://my-json-server.typicode.com/mneema/mock-db/flights
  //   const json = yield fetch(apiUrl + "airlines").then(
  //     (response) => response.json()
  //   );
  //   return json;
  //   // yield put({ type: "GET_FLIGHTS_SUCCESS", json: transformFlightDates(json) });
  // } catch (e) {
  //   console.log("error", e);
  //   yield put({ type: "GET_FLIGHTS_FAIL", error: e });
  // }
}

function* findFlights(payload) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.payload.criteria),
  };

  try {
    yield put({ type: "GET_FILTERS_SUCCESS", json: payload.payload.criteria });

    const {
      flights,
      criteria: {
        returnDate,
        origin,
        destination,
        // departureDate,
        numOfPassengers,
        // cabinclass,
        origin_city_name,
        destination_city_name,
      },
    } = payload.payload;

    const listOfFlights = {};
    const json1 = yield fetch(apiUrl + "/airlines/test", requestOptions).then(
      (response) => response.json()
    );
    // console.log(JSON.stringify(json1));

    /*const json = yield fetch(apiUrl + '/airlines')
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
          origin_city_name: origin_city_name,
          destination_city_name: destination_city_name,
        },
      });
    }

    // listOfFlights.onwards = findPaths({ flights, criteria: { origin, destination, date: departureDate, numOfPassengers } });

    yield put({ type: "GET_ROUTES_SUCCESS", json: json1 });
    localStorage.setItem("flightkey", json1[0]);
    // console.log(json1);
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
