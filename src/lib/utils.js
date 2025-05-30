export const transformFlightDates = (flights) => {
  if (!Array.isArray(flights)) {
    console.warn("transformFlightDates expected an array but got:", flights);
    return [];
  }

  return flights.map((flight) => ({
    ...flight,
    // you can transform flight.slices here if needed
  }));
};

export const getTimeDifferece = (timeDiff) => {
  const timeInHrs = Math.floor(timeDiff / 3600000);
  const timeInMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
  return `${timeInHrs}h ${timeInMins}m`;
};
