const axios = require("axios");
require("dotenv").config();

exports.handler = async function(event, context) {
  const stopId = event.queryStringParameters.stop;
  const {
    API_TRANSPORTE_ID: clientId,
    API_TRANSPORTE_SECRET: clientSecret
  } = process.env;

  const url = `https://apitransporte.buenosaires.gob.ar/colectivos/oba/arrivals-and-departures-for-stop/82_${stopId}?minutesBefore=1&client_id=${clientId}&client_secret=${clientSecret}`;

  try {
    const { data } = await axios.get(url);
    const result = data.data.entry.arrivalsAndDepartures.map(x => ({
      bus: x.routeShortName,
      arrival: x.scheduledArrivalTime,
      trip: x.tripId
    }));
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    const { status, statusText, headers, data } = error.response;
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ status, statusText, headers, data })
    };
  }
};
