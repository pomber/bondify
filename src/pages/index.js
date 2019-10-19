import React from "react";
import Map from "pigeon-maps";
import useLocation from "../components/use-location";

import "./index.css";
import getStops from "../components/get-stops";
import getArrivals from "../arriving";
import useTime from "../use-time";

const defaultLocation = [-34.797232, -58.232208];

function Marker({ left, top }) {
  const size = 25;
  return (
    <span
      style={{
        position: "absolute",
        height: size,
        width: size,
        transform: `translate(${left - size / 2}px, ${top - size / 2}px)`,
        background: "rgba(100,200,220,0.75)",
        border: "1px solid pink",
        borderRadius: "50%"
      }}
    />
  );
}

function timeDifference(a, b) {
  const seconds = Math.round((b - a) / 1000);
  if (Math.abs(seconds) <= 60) {
    if (seconds < -1) {
      return ["se fue hace", -seconds, "segundos"];
    } else if (seconds === -1) {
      return ["se fue hace", -seconds, "segundo"];
    } else if (seconds === 1) {
      return ["llega en", seconds, "segundo"];
    } else {
      return ["llega en", seconds, "segundos"];
    }
  }

  const minutes = Math.round(seconds / 60);

  if (minutes < -1) {
    return ["se fue hace", -minutes, "minutos"];
  } else if (minutes === -1) {
    return ["se fue hace", -minutes, "minuto"];
  } else if (minutes === 1) {
    return ["llega en", minutes, "minuto"];
  } else {
    return ["llega en", minutes, "minutos"];
  }
}

function getBusNumberAndCode(bus) {
  const number = bus.match(/^\d+/)[0];
  const code = bus.slice(number.length);
  return { number, code };
}

function Arrival({ arrival, now }) {
  const { bus, description, arrival: time } = arrival;
  const { number, code } = getBusNumberAndCode(bus);
  const [time1, time2, time3] = timeDifference(now, new Date(time));
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px",
        background: "rgba(20,20,20,0.75)",
        color: "#fafafa",
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <div style={{ width: "80%" }}>
        <div style={{ fontSize: "32px" }}>
          <strong>{number}</strong>
          <span style={{ color: "#ccc" }}>{code}</span>
        </div>
        <div className="ellipsis" style={{ fontSize: "0.8em" }}>
          {description}
        </div>
      </div>
      <div
        style={{
          width: "64px",
          display: "flex",
          flexDirection: "column",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: "0.5em", color: "#ccc" }}>{time1}</div>
        <div style={{ fontSize: "28px" }}>{time2}</div>
        <div style={{ fontSize: "0.5em", color: "#ccc" }}> {time3}</div>
      </div>
    </div>
  );
}

function Arrivals({ arrivals }) {
  const now = useTime();
  return (
    <React.Fragment>
      {arrivals.map(arrival => (
        <Arrival key={arrival.trip} arrival={arrival} now={now} />
      ))}
    </React.Fragment>
  );
}

export default function() {
  const location = useLocation() || defaultLocation;
  console.log(location);
  const [stops, setStops] = React.useState([]);
  const [arrivals, setArrivals] = React.useState([]);

  const handleBoundsChange = async ({ bounds }) => {
    const stops = await getStops(bounds);
    console.log({ bounds, stops });
    setStops(stops);
    const arrivals = await getArrivals(stops.map(stop => stop[0]));
    console.log("arrivals", arrivals);
    setArrivals(arrivals);
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <Map
        center={location}
        zoom={18}
        minZoom={17}
        onBoundsChanged={handleBoundsChange}
      >
        {stops.map(([stopId, lat, long]) => (
          <Marker key={stopId} anchor={[lat, long]} />
        ))}
      </Map>
      <div
        className="hide-scrollbar"
        style={{
          position: "absolute",
          top: 0,
          fontSize: "1.3em",
          height: "100%",
          width: "100%",
          maxHeight: "100%"
        }}
      >
        <div style={{ height: "80%" }} />
        <Arrivals arrivals={arrivals} />
      </div>
    </div>
  );
}
