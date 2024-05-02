export const transformFlightDates = (flights) => {
  console.log(flights);
  return flights.map(flight => {
    console.log(flight.slices[0].segments[0].arriving_at);
    return {
      ...flight
      
    }
  })
};

export const getTimeDifferece = (timeDiff) => {
  const timeInHrs = Math.floor((timeDiff) / 3600000);
  const timeInMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
  return `${timeInHrs}h ${timeInMins}m`;
}