import React, { useState, useEffect, useRef } from "react";
import "./single-booking-details.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment"; // Import Moment.js
import flightimage from "../../../assets/images/flightimage.svg";
import html2pdf from "html2pdf.js";
import flightwing from "../../../assets/images/flight_wing.png";
import headerlogoimage from "../../../assets/images/Preyana-pdf.png";
const apiUrl = process.env.REACT_APP_API_BASE_URL;

const SingleBookingDetails = () => {
  const location = useLocation();
  const [bookingData, setBookingData] = useState([]);
  const [bookingOrderId, setBookingOrderId] = useState("");
  const navigate = useNavigate(); // Use navigate for redirecting
  // Create a reference to the hidden div
  const hiddenDivRef = useRef(null);

  // const [bookingData, setBookingData] = useState({
  //   slices: {
  //     origin: { iata_code: "" },
  //     destination: { iata_code: "" },
  //     fare_brand_name: "",
  //     duration: "",
  //   },
  //   base_amount: "",
  //   tax_amount: "",
  //   total_amount: "",
  //   booking_id: "",
  //   segments: {
  //     operating_carrier_flight_number: "",
  //     departure_date: "",
  //     cabin: "",
  //     stops: "",
  //     aircraftName: "",
  //     airlinesName: "",
  //   },
  //   // Other necessary defaults
  // });
  const [sliceLength, setSliceLength] = useState();

  useEffect(() => {
    if (location.state && location.state.order_booking_id !== undefined) {
      setBookingOrderId(location.state.order_booking_id);
      console.log("booking ID" + location.state.order_booking_id);
      getBookingDetail(location.state.order_booking_id);
    } else {
      console.log(
        "No booking ID found in state." + location.state?.order_booking_id
      );
    }
  }, [location.state]);

  const getSingleBooking = async (orderBookingId) => {
    console.log("Booking ID:", orderBookingId);

    const configuration = {
      method: "get",
      url: apiUrl + `/booking/singleorder/${orderBookingId}`,
      headers: { "Content-Type": "application/json" },
    };
    try {
      const result = await axios(configuration);
      console.log("Single order data:", result.data.data); // Store the data in state

      if (result.data.data !== undefined) {
        // Assuming slices is an array and you want the first element
        const { slices } = result.data.data;
        setSliceLength(slices.length);
        console.log("slices", slices.length);
        const { segments } = result.data.data.slices[0];
        const booking = result.data.data;
        const firstSlice = slices && slices.length > 0 ? slices[0] : {};
        console.log("firstSlice", firstSlice.length);
        const firstSegment = segments && segments.length > 0 ? segments[0] : {};
        console.log(
          "firstSegment",
          firstSegment.operating_carrier_flight_number
        );
        // Example ISO 8601 duration
        const duration = firstSegment.duration;
        // Parse the duration using moment.js
        const momentDuration = moment.duration(duration);
        // Extract the components
        const days = momentDuration.days();
        const hours = momentDuration.hours();
        const minutes = momentDuration.minutes();
        const cabin = firstSegment.passengers[0].cabin_class_marketing_name;

        const date = firstSegment.departing_at;
        const formattedDate = moment(date).format(
          "dddd MMMM DD, YYYY, hh:mm A"
        );
  
        console.log("Raw Date:",firstSegment.departing_at);
        const stops = firstSegment.stops;
        const aircraftName = firstSegment.aircraft
          ? firstSegment.aircraft.name
          : null;
        console.log(booking.base_amount);
        const markup = Number(booking.base_amount) * 0.15;
        const baseMarkup_amount = (
          Number(booking.base_amount) + markup
        ).toFixed(2);
        const total_markup_amount = (
          Number(booking.total_amount) + markup
        ).toFixed(2);
        setBookingData({
          slices: {
            origin: {
              iata_code: firstSlice.origin.city_name
                ? firstSlice.origin.city_name
                : "",
            },
            destination: {
              iata_code: firstSlice.destination.city_name
                ? firstSlice.destination.city_name
                : "",
            },
            fare_brand_name: firstSlice.fare_brand_name
              ? firstSlice.fare_brand_name
              : "",
            duration: `${
              days > 0 ? `${days} day${days !== 1 ? "s" : ""}, ` : ""
            }${hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""}, ` : ""}${
              minutes > 0 ? `${minutes} minute${minutes !== 1 ? "s" : ""}` : ""
            }`, // Format the output as "1 day, 7 hours, 25 minutes"
          },
          segments: {
            operating_carrier_flight_number:
              firstSegment.operating_carrier.iata_code &&
              firstSegment.operating_carrier_flight_number
                ? firstSegment.operating_carrier.iata_code +
                  "" +
                  firstSegment.operating_carrier_flight_number
                : "",

            departure_date: formattedDate,
            cabin: cabin,
            stops: stops,
            aircraftName: aircraftName,
            airlinesName: firstSegment.operating_carrier.name
              ? firstSegment.operating_carrier.name
              : "",
          },
          base_amount: baseMarkup_amount,
          tax_amount: booking.tax_amount,
          total_amount: total_markup_amount,
          booking_id: booking.id,
        });
      } else {
        alert("Please enter correct booking id");
        navigate("/mybookings"); // Redirect to a safe page or show an error message
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };
  const cancelBooking = async (bookingId, email) => {
    console.log("Booking ID:" + bookingId);
    console.log("Booking email:" + email);
    // Show confirmation dialog
    const userConfirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!userConfirmed) {
      // If user cancels the confirmation dialog, abort the process
      return;
    }

    const baseURL = apiUrl + "/booking";
    const headers = { "Content-Type": "application/json" };

    // Fetch cancellation details
    try {
      const cancelResult = await axios.get(`${baseURL}/ordercancel/${bookingId}`,
        { headers }
      );
      console.log("Single order cancel data:", cancelResult.data);

      const { errors, data } = cancelResult.data;
      if (errors && errors.length > 0) {
        console.error("Errors:", errors[0].message);
        alert(`Errors: ${errors[0].message}`);
        return;
      }

      if (data) {
        await confirmCancellation(data.id, email);
        navigate("/mybookings");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  // Confirm cancellation
  const confirmCancellation = async (cancelId, email) => {
    console.log("cancelId" + cancelId);
    console.log("cancel email" + email);
    const baseURL = apiUrl + "/booking";
    const headers = { "Content-Type": "application/json" };

    try {
      const confirmResult = await axios.get(
        `${baseURL}/ordercancelconfirm/${cancelId}/${email}`,
        { headers }
      );
      console.log("Single order cancel confirm data:", confirmResult.data);

      const { errors, data } = confirmResult.data;
      if (errors && errors.length > 0) {
        console.error("Errors:", errors[0].message);
        alert(`Errors: ${errors[0].message}`);
        return;
      }

      if (data) {
        await updateBookingStatus();
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  // Update booking status
  const updateBookingStatus = async () => {
    const baseURL = apiUrl + "/booking";
    const headers = { "Content-Type": "application/json" };

    if (location.state && location.state.pk_booking_Id !== undefined) {
      const test = {
        booking_id: location.state.order_booking_id,
        status: "cancelled",
      };
      console.log("update booking status", test);
      try {
        const updateResult = await axios.put(
          `${baseURL}/updatebookingstatus/${location.state.pk_booking_Id}`,
          JSON.stringify(test),
          { headers }
        );
        console.log("Update Single order status data:", updateResult.data);
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    }
  };

  const downloadPdf = async (bookingId) => {
    const element = hiddenDivRef.current;
    // Step 1: Fetch booking details and wait for updates
    await getBookingDetail(bookingId);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Ensure React renders updates

    // Step 2: Temporarily make the element visible
    const originalDisplay = element.style.display;
    element.style.display = "block";

    // Step 3: Generate PDF from the visible element
    html2pdf()
      .from(element)
      .set({
        margin: 0.1,
        filename: "download.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save(`Order-${bookingId}.pdf`)
      .then(() => {
        // Step 4: Restore original display style
        element.style.display = originalDisplay;
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        element.style.display = originalDisplay; // Ensure cleanup on failure
      });
  };

  const getBookingDetail = async (bookingId) => {
    const configuration = {
      method: "get",
      url: apiUrl + `/booking/singleorder/${bookingId}`,
      headers: { "Content-Type": "application/json" },
    };
    console.log(configuration);
    console.log("configuration");
    try {
      const result = await axios(configuration);
      if (result.data.data !== undefined) {
        console.log(result.data.data);
        setBookingData(result.data.data);
      } else {
        alert("Please enter correct booking id");
        // navigate("/mybookings"); // Redirect to a safe page or show an error message
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const formatDuration = (duration) => {
    const momentDuration = moment.duration(duration);
    const hours = momentDuration.hours();
    const minutes = momentDuration.minutes();

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  };

  return (
    <section className="innerpage-wrapper" id="single-booking-sec">
      <div className="container p-5">
        <h3>Booking Details</h3>
        <div className="col-12 col-md-12 col-lg-12 col-xl-12 text-right m-4">
          <button
            className="btn btn-primary mr-3"
            onClick={() => downloadPdf(bookingOrderId)}
          >
            Download
          </button>
          {bookingData?.status?.toLowerCase() === "cancelled" || bookingData?.cancelled_at ? (
            <button className="btn btn-secondary" disabled>
              Cancelled
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() =>
                cancelBooking(bookingOrderId, bookingData?.passengers[0].email)
              }
            >
              Cancel Booking
            </button>
          )}
        </div>
        {/* Additional booking details can be rendered here */}
        {bookingData && (
          <div className="border rounded p-3">
            <div className="header" style={{ display: "flex" }}>
              {/* <div style={{ width: "50%", textAlign: "left" }}>
                <img src={headerlogoimage} alt="header logo" />
              </div> */}
              <div style={{ width: "100%", textAlign: "right", right: "10px" }}>
                <h3>Booking Reference</h3>
                <h4>{bookingData.booking_reference}</h4>
              </div>
            </div>
            <div
              className="flight-details"
              style={{ display: "block", marginBottom: "20px" }}
            >
              <div style={{ textAlign: "left" }}>
                <h3>Flight details</h3>
              </div>
              {/* Check if slices is an array and handle accordingly */}
              {Array.isArray(bookingData.slices) &&
              bookingData.slices.length > 1 ? (
                bookingData.slices.map((slice, index) => (
                  <div
                    className="flight-detail-card"
                    style={{
                      width: "100%",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      padding: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    {slice.segments.map((segment, segIndex) => (
                      <>
                        <div
                          className="flight-time-detail"
                          style={{ display: "flex", margin: "5px" }}
                        >
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <img
                              src={flightwing}
                              alt="flight"
                              width={50}
                              height={50}
                            />
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>
                             {segment.departing_at
                                ? new Date(segment.departing_at).toLocaleTimeString("en-US")
                                : "Invalid Departure Time"}{" "}
                              -{" "}
                              {segment.arriving_at
                                ? new Date(segment.arriving_at).toLocaleTimeString("en-US")
                                : "Invalid Arrival Time"}
                                {console.log(segment)}
                            </h5>
                            <h6>{segment.operating_carrier.name}</h6>
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>{formatDuration(slice.duration)}</h5>
                            <h4>
                              {segment.origin.iata_code} -{" "}
                              {segment.destination.iata_code}
                            </h4>
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>Non-stop</h5>
                          </div>
                        </div>
                        <div
                          className="flight-origin-detail"
                          style={{ display: "flex", margin: "5px" }}
                        >
                          <div style={{ width: "40%", textAlign: "left" }}>
                            {new Date(
                              segment.departing_at
                            ).toLocaleString("en-US", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div style={{ width: "60%", textAlign: "right" }}>
                            <h5>
                              Depart from {segment.origin.name} (
                              {segment.origin.iata_code}), Terminal{" "}
                              {segment.departure_terminal}
                            </h5>
                          </div>
                        </div>
                        <div
                          className="flight-destination-detail"
                          style={{ display: "flex", margin: "5px" }}
                        >
                          <div style={{ width: "50%", textAlign: "left" }}>
                            <h5>
                              Flight Duration: {formatDuration(slice.duration)}
                            </h5>
                            <h5>
                              {new Date(
                                segment.arriving_at
                              ).toLocaleString("en-US", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </h5>
                          </div>
                          <div style={{ width: "50%", textAlign: "right" }}>
                            <h5>
                              Arrive at {segment.destination.name} (
                              {segment.destination.iata_code}), Terminal{" "}
                              {segment.arrival_terminal}
                            </h5>
                          </div>
                        </div>
                        <div
                          className="flight-class-detail"
                          style={{ display: "flex" }}
                        >
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>
                              {segment.passengers[0].cabin_class_marketing_name}
                            </h5>
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>{segment.operating_carrier.name}</h5>
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>{segment.aircraft.name}</h5>
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>{segment.operating_carrier_flight_number}</h5>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                ))
              ) : (
                <div
                  className="flight-detail-card"
                  style={{
                    width: "100%",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  {bookingData.slices?.[0] ? (
                    <>
                      {bookingData.slices?.[0].segments.map(
                        (segment, segIndex) => (
                          <>
                            <div
                              className="flight-time-detail"
                              style={{ display: "flex", margin: "5px" }}
                            >
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <img
                                  src={flightwing}
                                  alt="flight"
                                  width={50}
                                  height={50}
                                />
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>
                                  {" "}
                                  {new Date(
                                    segment.departing_at
                                  ).toLocaleTimeString("en-US")}{" "}
                                  -{" "}
                                  {new Date(
                                    segment.arriving_at
                                  ).toLocaleTimeString("en-US")}
                                </h5>
                                <h6>{segment.operating_carrier.name}</h6>
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>
                                  {formatDuration(
                                    bookingData.slices?.[0].duration
                                  )}
                                </h5>
                                {segment.origin.iata_code} -{" "}
                                {segment.destination.iata_code}
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>Non-stop</h5>
                              </div>
                            </div>
                            <div
                              className="flight-origin-detail"
                              style={{ display: "flex", margin: "5px" }}
                            >
                              <div style={{ width: "40%", textAlign: "left" }}>
                                {new Date(
                                  segment.departing_at
                                ).toLocaleString("en-US", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <div style={{ width: "60%", textAlign: "right" }}>
                                <h5>
                                  Depart from {segment.origin.name} (
                                  {segment.origin.iata_code}), Terminal{" "}
                                  {segment.departure_terminal}
                                </h5>
                              </div>
                            </div>
                            <div
                              className="flight-destination-detail"
                              style={{ display: "flex", margin: "5px" }}
                            >
                              <div style={{ width: "50%", textAlign: "left" }}>
                                <h5>
                                  Flight Duration:{" "}
                                  {formatDuration(
                                    bookingData.slices?.[0].duration
                                  )}
                                </h5>
                                <h5>
                                  {new Date(
                                    segment.arriving_at
                                  ).toLocaleString("en-US", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </h5>
                              </div>
                              <div style={{ width: "50%", textAlign: "right" }}>
                                <h5>
                                  Arrive at {segment.destination.name} (
                                  {segment.destination.iata_code}), Terminal{" "}
                                  {segment.arrival_terminal}
                                </h5>
                              </div>
                            </div>
                            <div
                              className="flight-class-detail"
                              style={{ display: "flex" }}
                            >
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>
                                  {
                                    segment.passengers[0]
                                      .cabin_class_marketing_name
                                  }
                                </h5>
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>{segment.operating_carrier.name}</h5>
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>{segment.aircraft.name}</h5>
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>
                                  {segment.operating_carrier_flight_number}
                                </h5>
                              </div>
                            </div>
                          </>
                        )
                      )}
                    </>
                  ) : (
                    <p>No flight details available.</p>
                  )}
                </div>
              )}
            </div>

            <div
              className="passenger-details"
              style={{ display: "block", marginBottom: "20px" }}
            >
              <div style={{ textAlign: "left" }}>
                <h3>Passengers</h3>
              </div>
            </div>
            <div
              className="passenger-detail-card"
              style={{
                width: "100%",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "20px",
              }}
            >
              {Array.isArray(bookingData.passengers) &&
              bookingData.passengers.length > 1 ? (
                bookingData.passengers.map((passenger, index) => (
                  <>
                    <div className="passenger-type">
                      <h3>{passenger.type}</h3>
                    </div>

                    <div
                      className="passenger-detail"
                      style={{
                        display: "flex",
                        margin: "5px",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ width: "40%", textAlign: "left" }}>
                        <h4>Name</h4>
                        <h5>
                          {passenger.given_name} {passenger.family_name}
                        </h5>
                      </div>
                      <div style={{ width: "30%", textAlign: "left" }}>
                        <h4>Date of Birth</h4>
                        <h5>{passenger.born_on}</h5>
                      </div>
                      <div style={{ width: "30%", textAlign: "left" }}>
                        <h4>Gender</h4>
                        <h5>{passenger.gender == "f" ? "Female" : "Male"}</h5>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <>
                  {bookingData.passengers?.[0] ? (
                    <>
                      <div className="passenger-type">
                        <h3>{bookingData.passengers?.[0].type}</h3>
                      </div>

                      <div
                        className="passenger-detail"
                        style={{
                          display: "flex",
                          margin: "5px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "40%", textAlign: "left" }}>
                          <h4>Name</h4>
                          <h5>
                            {bookingData.passengers?.[0].given_name}{" "}
                            {bookingData.passengers?.[0].family_name}
                          </h5>
                        </div>
                        <div style={{ width: "30%", textAlign: "left" }}>
                          <h4>Date of Birth</h4>
                          <h5>{bookingData.passengers?.[0].born_on}</h5>
                        </div>
                        <div style={{ width: "30%", textAlign: "left" }}>
                          <h4>Gender</h4>
                          <h5>
                            {bookingData.passengers?.[0].gender == "f"
                              ? "Female"
                              : "Male"}
                          </h5>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>No passenger details available.</p>
                  )}
                </>
              )}
              <div className="passenger-type">
                <h3>Flight Information</h3>
              </div>

              <div
                className="flight-detail-card"
                style={{
                  width: "100%",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                {/* Check if slices is an array and handle accordingly */}
                {Array.isArray(bookingData.slices) &&
                bookingData.slices.length > 1 ? (
                  bookingData.slices.map((slice, index) => (
                    <>
                      {slice.segments.map((segment, segIndex) => (
                        <>
                          <div
                            className="flight-class-detail"
                            style={{ display: "flex" }}
                          >
                            <div style={{ width: "25%", textAlign: "left" }}>
                              <img src={flightwing} alt="flight" />
                            </div>
                            <div style={{ width: "75%", textAlign: "left" }}>
                              <h4>
                                {" "}
                                {segment.origin.iata_code} {" to "}
                                {segment.destination.iata_code} on{" "}
                                {new Date(
                                  segment.departing_at
                                ).toLocaleString("en-US", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </h4>
                            </div>
                          </div>
                          <div
                            className="flight-class-detail"
                            style={{ display: "flex" }}
                          >
                            {segment.passengers.map(
                              (passenger, passengerIndex) => (
                                <>
                                  <div
                                    style={{
                                      width: "25%",
                                      textAlign: "left",
                                    }}
                                  >
                                    <h4>
                                      {passenger.baggages[0] &&
                                      passenger.baggages[0].quantity
                                        ? passenger.baggages[0].quantity
                                        : ""}{" "}
                                      {passenger.baggages[0] &&
                                      passenger.baggages[0].type
                                        ? passenger.baggages[0].type
                                        : ""}
                                    </h4>
                                  </div>
                                  <div
                                    style={{
                                      width: "25%",
                                      textAlign: "left",
                                    }}
                                  >
                                    <h4>
                                      {passenger.baggages[1] &&
                                      passenger.baggages[1].quantity
                                        ? passenger.baggages[1].quantity
                                        : ""}{" "}
                                      {passenger.baggages[1] &&
                                      passenger.baggages[1].type
                                        ? passenger.baggages[1].type
                                        : ""}
                                    </h4>
                                  </div>
                                </>
                              )
                            )}
                          </div>
                        </>
                      ))}
                    </>
                  ))
                ) : (
                  <>
                    {bookingData.slices?.[0] ? (
                      <>
                        {bookingData.slices?.[0].segments.map(
                          (segment, segIndex) => (
                            <>
                              <div
                                className="flight-class-detail"
                                style={{ display: "flex" }}
                              >
                                <div
                                  style={{ width: "25%", textAlign: "left" }}
                                >
                                  <img src={flightwing} alt="flight" />
                                </div>
                                <div
                                  style={{ width: "75%", textAlign: "left" }}
                                >
                                  <h4>
                                    {segment.origin.iata_code} {" to "}
                                    {segment.destination.iata_code} on{" "}
                                    {new Date(
                                      segment.departing_at
                                    ).toLocaleString("en-US", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </h4>
                                </div>
                              </div>
                              <div
                                className="flight-class-detail"
                                style={{ display: "flex" }}
                              >
                                {segment.passengers.map(
                                  (passenger, passengerIndex) => (
                                    <>
                                      <div
                                        style={{
                                          width: "25%",
                                          textAlign: "left",
                                        }}
                                      >
                                        <h4>
                                          {passenger.baggages[0] &&
                                          passenger.baggages[0].quantity
                                            ? passenger.baggages[0].quantity
                                            : ""}{" "}
                                          {passenger.baggages[0] &&
                                          passenger.baggages[0].type
                                            ? passenger.baggages[0].type +
                                              " bag"
                                            : ""}
                                        </h4>
                                      </div>
                                      <div
                                        style={{
                                          width: "25%",
                                          textAlign: "left",
                                        }}
                                      >
                                        <h4>
                                          {passenger.baggages[1] &&
                                          passenger.baggages[1].quantity
                                            ? passenger.baggages[1].quantity
                                            : ""}{" "}
                                          {passenger.baggages[1] &&
                                          passenger.baggages[1].type
                                            ? passenger.baggages[1].type
                                            : ""}
                                        </h4>
                                      </div>
                                    </>
                                  )
                                )}
                              </div>
                            </>
                          )
                        )}
                      </>
                    ) : (
                      <p>No flight information details available.</p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div
              className="ticket-details"
              style={{ display: "block", marginBottom: "20px" }}
            >
              <div style={{ textAlign: "left" }}>
                <h3>Ticket numbers</h3>
              </div>
            </div>
            <div
              className="ticket-detail-card"
              style={{
                width: "100%",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <div className="passenger-type">
                {Array.isArray(bookingData.passengers) &&
                bookingData.passengers.length > 1 ? (
                  bookingData.passengers.map((passenger, index) => (
                    <>
                      <div
                        className="passenger-detail"
                        style={{
                          display: "flex",
                          margin: "5px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "40%", textAlign: "left" }}>
                          <h5>
                            {passenger.given_name} {passenger.family_name} :{" "}
                            {"1"}
                          </h5>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <>
                    {bookingData.passengers?.[0] ? (
                      <>
                        <div
                          className="passenger-detail"
                          style={{
                            display: "flex",
                            margin: "5px",
                            marginBottom: "20px",
                          }}
                        >
                          <div style={{ width: "40%", textAlign: "left" }}>
                            <h5>
                              {bookingData.passengers?.[0].given_name}{" "}
                              {bookingData.passengers?.[0].family_name} : {"1"}
                            </h5>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No tickets details available.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Hidden div with content you want to convert to PDF */}
      <div
        ref={hiddenDivRef}
        style={{ display: "none", padding: "10px" }} // Hidden div, will not be visible
        id="itinerary_download"
      >
        {bookingData && (
          <>
            <div className="header" style={{ display: "flex" }}>
              <div style={{ width: "50%", textAlign: "left" }}>
                <img src={headerlogoimage} alt="header logo" />
              </div>
              <div style={{ width: "50%", textAlign: "right", right: "10px" }}>
                <h2>Booking Reference</h2>
                <h3>{bookingData.booking_reference}</h3>
              </div>
            </div>
            <div
              className="flight-details"
              style={{ display: "block", marginBottom: "20px" }}
            >
              <div style={{ textAlign: "left" }}>
                <h2>Flight details</h2>
              </div>
              {/* Check if slices is an array and handle accordingly */}
              {Array.isArray(bookingData.slices) &&
              bookingData.slices.length > 1 ? (
                bookingData.slices.map((slice, index) => (
                  <div
                    className="flight-detail-card"
                    style={{
                      width: "100%",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      padding: "10px",
                    }}
                  >
                    {slice.segments.map((segment, segIndex) => (
                      <>
                        <div
                          className="flight-time-detail"
                          style={{ display: "flex", margin: "5px" }}
                        >
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <img
                              src={flightwing}
                              alt="flight"
                              width={50}
                              height={50}
                            />
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>
                              {" "}
                              {new Date(
                                segment.departing_at
                              ).toLocaleTimeString("en-US")}{" "}
                              -{" "}
                              {new Date(
                                segment.arriving_at
                              ).toLocaleTimeString("en-US")}
                            </h5>
                            <h6>{segment.operating_carrier.name}</h6>
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>{formatDuration(slice.duration)}</h5>
                            {segment.origin.iata_code} -{" "}
                            {segment.destination.iata_code}
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>Non-stop</h5>
                          </div>
                        </div>
                        <div
                          className="flight-origin-detail"
                          style={{ display: "flex", margin: "5px" }}
                        >
                          <div style={{ width: "40%", textAlign: "left" }}>
                            {new Date(
                              segment.departing_at
                            ).toLocaleString("en-US", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div style={{ width: "60%", textAlign: "right" }}>
                            <h5>
                              Depart from {segment.origin.name} (
                              {segment.origin.iata_code}), Terminal{" "}
                              {segment.departure_terminal}
                            </h5>
                          </div>
                        </div>
                        <div
                          className="flight-destination-detail"
                          style={{ display: "flex", margin: "5px" }}
                        >
                          <div style={{ width: "50%", textAlign: "left" }}>
                            <h5>
                              Flight Duration: {formatDuration(slice.duration)}
                            </h5>
                            <h5>
                              {new Date(
                                segment.arriving_at
                              ).toLocaleString("en-US", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </h5>
                          </div>
                          <div style={{ width: "50%", textAlign: "right" }}>
                            <h5>
                              Arrive at {segment.destination.name} (
                              {segment.destination.iata_code}), Terminal{" "}
                              {segment.arrival_terminal}
                            </h5>
                          </div>
                        </div>
                        <div
                          className="flight-class-detail"
                          style={{ display: "flex" }}
                        >
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>
                              {segment.passengers[0].cabin_class_marketing_name}
                            </h5>
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>{segment.operating_carrier.name}</h5>
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>{segment.aircraft.name}</h5>
                          </div>
                          <div style={{ width: "25%", textAlign: "center" }}>
                            <h5>{segment.operating_carrier_flight_number}</h5>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                ))
              ) : (
                <div
                  className="flight-detail-card"
                  style={{
                    width: "100%",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  {bookingData.slices?.[0] ? (
                    <>
                      {bookingData.slices?.[0].segments.map(
                        (segment, segIndex) => (
                          <>
                            <div
                              className="flight-time-detail"
                              style={{ display: "flex", margin: "5px" }}
                            >
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <img
                                  src={flightwing}
                                  alt="flight"
                                  width={50}
                                  height={50}
                                />
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>
                                  {" "}
                                  {new Date(
                                    segment.departing_at
                                  ).toLocaleTimeString("en-US")}{" "}
                                  -{" "}
                                  {new Date(
                                    segment.arriving_at
                                  ).toLocaleTimeString("en-US")}
                                </h5>
                                <h6>{segment.operating_carrier.name}</h6>
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>
                                  {formatDuration(
                                    bookingData.slices?.[0].duration
                                  )}
                                </h5>
                                {segment.origin.iata_code} -{" "}
                                {segment.destination.iata_code}
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>Non-stop</h5>
                              </div>
                            </div>
                            <div
                              className="flight-origin-detail"
                              style={{ display: "flex", margin: "5px" }}
                            >
                              <div style={{ width: "40%", textAlign: "left" }}>
                                {new Date(
                                  segment.departing_at
                                ).toLocaleString("en-US", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <div style={{ width: "60%", textAlign: "right" }}>
                                <h5>
                                  Depart from {segment.origin.name} (
                                  {segment.origin.iata_code}), Terminal{" "}
                                  {segment.departure_terminal}
                                </h5>
                              </div>
                            </div>
                            <div
                              className="flight-destination-detail"
                              style={{ display: "flex", margin: "5px" }}
                            >
                              <div style={{ width: "50%", textAlign: "left" }}>
                                <h5>
                                  Flight Duration:{" "}
                                  {formatDuration(
                                    bookingData.slices?.[0].duration
                                  )}
                                </h5>
                                <h5>
                                  {new Date(
                                    segment.arriving_at
                                  ).toLocaleString("en-US", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </h5>
                              </div>
                              <div style={{ width: "50%", textAlign: "right" }}>
                                <h5>
                                  Arrive at {segment.destination.name} (
                                  {segment.destination.iata_code}), Terminal{" "}
                                  {segment.arrival_terminal}
                                </h5>
                              </div>
                            </div>
                            <div
                              className="flight-class-detail"
                              style={{ display: "flex" }}
                            >
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>
                                  {
                                    segment.passengers[0]
                                      .cabin_class_marketing_name
                                  }
                                </h5>
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>{segment.operating_carrier.name}</h5>
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>{segment.aircraft.name}</h5>
                              </div>
                              <div
                                style={{ width: "25%", textAlign: "center" }}
                              >
                                <h5>
                                  {segment.operating_carrier_flight_number}
                                </h5>
                              </div>
                            </div>
                          </>
                        )
                      )}
                    </>
                  ) : (
                    <p>No flight details available.</p>
                  )}
                </div>
              )}
            </div>

            <div
              className="passenger-details"
              style={{ display: "block", marginBottom: "20px" }}
            >
              <div style={{ textAlign: "left" }}>
                <h2>Passengers</h2>
              </div>
            </div>
            <div
              className="passenger-detail-card"
              style={{
                width: "100%",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "20px",
              }}
            >
              {Array.isArray(bookingData.passengers) &&
              bookingData.passengers.length > 1 ? (
                bookingData.passengers.map((passenger, index) => (
                  <>
                    <div className="passenger-type">
                      <h3>{passenger.type}</h3>
                    </div>

                    <div
                      className="passenger-detail"
                      style={{
                        display: "flex",
                        margin: "5px",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ width: "40%", textAlign: "left" }}>
                        <h4>Name</h4>
                        <h5>
                          {passenger.given_name} {passenger.family_name}
                        </h5>
                      </div>
                      <div style={{ width: "30%", textAlign: "left" }}>
                        <h4>Date of Birth</h4>
                        <h5>{passenger.born_on}</h5>
                      </div>
                      <div style={{ width: "30%", textAlign: "left" }}>
                        <h4>Gender</h4>
                        <h5>{passenger.gender == "f" ? "Female" : "Male"}</h5>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <>
                  {bookingData.passengers?.[0] ? (
                    <>
                      <div className="passenger-type">
                        <h3>{bookingData.passengers?.[0].type}</h3>
                      </div>

                      <div
                        className="passenger-detail"
                        style={{
                          display: "flex",
                          margin: "5px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "40%", textAlign: "left" }}>
                          <h4>Name</h4>
                          <h5>
                            {bookingData.passengers?.[0].given_name}{" "}
                            {bookingData.passengers?.[0].family_name}
                          </h5>
                        </div>
                        <div style={{ width: "30%", textAlign: "left" }}>
                          <h4>Date of Birth</h4>
                          <h5>{bookingData.passengers?.[0].born_on}</h5>
                        </div>
                        <div style={{ width: "30%", textAlign: "left" }}>
                          <h4>Gender</h4>
                          <h5>
                            {bookingData.passengers?.[0].gender == "f"
                              ? "Female"
                              : "Male"}
                          </h5>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>No passenger details available.</p>
                  )}
                </>
              )}
              <div className="passenger-type">
                <h3>Flight Information</h3>
              </div>

              <div
                className="flight-detail-card"
                style={{
                  width: "100%",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                {/* Check if slices is an array and handle accordingly */}
                {Array.isArray(bookingData.slices) &&
                bookingData.slices.length > 1 ? (
                  bookingData.slices.map((slice, index) => (
                    <>
                      {slice.segments.map((segment, segIndex) => (
                        <>
                          <div
                            className="flight-class-detail"
                            style={{ display: "flex" }}
                          >
                            <div style={{ width: "25%", textAlign: "left" }}>
                              <img src={flightwing} alt="flight" />
                            </div>
                            <div style={{ width: "75%", textAlign: "left" }}>
                              <h4>
                                {" "}
                                {segment.origin.iata_code} {" to "}
                                {segment.destination.iata_code} on{" "}
                                {new Date(
                                  segment.departing_at
                                ).toLocaleString("en-US", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </h4>
                            </div>
                          </div>
                          <div
                            className="flight-class-detail"
                            style={{ display: "flex" }}
                          >
                            {segment.passengers.map(
                              (passenger, passengerIndex) => (
                                <>
                                  <div
                                    style={{
                                      width: "25%",
                                      textAlign: "left",
                                    }}
                                  >
                                    <h4>
                                      {passenger.baggages[0] &&
                                      passenger.baggages[0].quantity
                                        ? passenger.baggages[0].quantity
                                        : ""}{" "}
                                      {passenger.baggages[0] &&
                                      passenger.baggages[0].type
                                        ? passenger.baggages[0].type + " bag"
                                        : ""}
                                    </h4>
                                  </div>
                                  <div
                                    style={{
                                      width: "25%",
                                      textAlign: "left",
                                    }}
                                  >
                                    <h4>
                                      {passenger.baggages[1] &&
                                      passenger.baggages[1].quantity
                                        ? passenger.baggages[1].quantity
                                        : ""}{" "}
                                      {passenger.baggages[1] &&
                                      passenger.baggages[1].type
                                        ? passenger.baggages[1].type
                                        : ""}
                                    </h4>
                                  </div>
                                </>
                              )
                            )}
                          </div>
                        </>
                      ))}
                    </>
                  ))
                ) : (
                  <>
                    {bookingData.slices?.[0] ? (
                      <>
                        {bookingData.slices?.[0].segments.map(
                          (segment, segIndex) => (
                            <>
                              <div
                                className="flight-class-detail"
                                style={{ display: "flex" }}
                              >
                                <div
                                  style={{ width: "25%", textAlign: "left" }}
                                >
                                  <img src={flightwing} alt="flight" />
                                </div>
                                <div
                                  style={{ width: "75%", textAlign: "left" }}
                                >
                                  <h4>
                                    {segment.origin.iata_code} {" to "}
                                    {segment.destination.iata_code} on{" "}
                                    {new Date(
                                      segment.departing_at
                                    ).toLocaleString("en-US", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </h4>
                                </div>
                              </div>
                              <div
                                className="flight-class-detail"
                                style={{ display: "flex" }}
                              >
                                {segment.passengers.map(
                                  (passenger, passengerIndex) => (
                                    <>
                                      <div
                                        style={{
                                          width: "25%",
                                          textAlign: "left",
                                        }}
                                      >
                                        <h4>
                                          {passenger.baggages[0] &&
                                          passenger.baggages[0].quantity
                                            ? passenger.baggages[0].quantity
                                            : ""}{" "}
                                          {passenger.baggages[0] &&
                                          passenger.baggages[0].type
                                            ? passenger.baggages[0].type +
                                              " bag"
                                            : ""}
                                        </h4>
                                      </div>
                                      <div
                                        style={{
                                          width: "25%",
                                          textAlign: "left",
                                        }}
                                      >
                                        <h4>
                                          {passenger.baggages[1] &&
                                          passenger.baggages[1].quantity
                                            ? passenger.baggages[1].quantity
                                            : ""}{" "}
                                          {passenger.baggages[1] &&
                                          passenger.baggages[1].type
                                            ? passenger.baggages[1].type
                                            : ""}
                                        </h4>
                                      </div>
                                    </>
                                  )
                                )}
                              </div>
                            </>
                          )
                        )}
                      </>
                    ) : (
                      <p>No flight information details available.</p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div
              className="ticket-details"
              style={{ display: "block", marginBottom: "20px" }}
            >
              <div style={{ textAlign: "left" }}>
                <h2>Ticket numbers</h2>
              </div>
            </div>
            <div
              className="ticket-detail-card"
              style={{
                width: "100%",
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <div className="passenger-type">
                {Array.isArray(bookingData.passengers) &&
                bookingData.passengers.length > 1 ? (
                  bookingData.passengers.map((passenger, index) => (
                    <>
                      <div
                        className="passenger-detail"
                        style={{
                          display: "flex",
                          margin: "5px",
                          marginBottom: "20px",
                        }}
                      >
                        <div style={{ width: "40%", textAlign: "left" }}>
                          <h5>
                            {passenger.given_name} {passenger.family_name} :{" "}
                            {"1"}
                          </h5>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <>
                    {bookingData.passengers?.[0] ? (
                      <>
                        <div
                          className="passenger-detail"
                          style={{
                            display: "flex",
                            margin: "5px",
                            marginBottom: "20px",
                          }}
                        >
                          <div style={{ width: "40%", textAlign: "left" }}>
                            <h5>
                              {bookingData.passengers?.[0].given_name}{" "}
                              {bookingData.passengers?.[0].family_name} : {"1"}
                            </h5>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No tickets details available.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SingleBookingDetails;
