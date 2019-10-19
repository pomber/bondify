import React from "react";
import Map from "pigeon-maps";
import useLocation from "./use-location";

import "./index.css";
import getStops from "./get-stops";
import getArrivals from "./arriving";
import useTime from "./use-time";

function Marker({ left, top }) {
  const size = 25;
  return (
    <span
      style={{
        position: "absolute",
        height: size,
        width: size,
        boxSizing: "border-box",
        transform: `translate(${left - size / 2}px, ${top - size / 2}px)`,
        background: "rgba(200,200,200,0.5)",
        border: "1px solid #222",
        boxShadow: "0px 0px 5px #222",
        borderRadius: "50%"
      }}
    />
  );
}

function timeDifference(a, b) {
  const seconds = Math.round((b - a) / 1000);
  if (Math.abs(seconds) <= 60) {
    if (seconds < -1) {
      return ["se fue hace", -seconds, "segundos", true];
    } else if (seconds === -1) {
      return ["se fue hace", -seconds, "segundo", true];
    } else if (seconds === 1) {
      return ["llega en", seconds, "segundo", false];
    } else {
      return ["llega en", seconds, "segundos", false];
    }
  }

  const minutes = Math.round(seconds / 60);

  if (minutes < -1) {
    return ["se fue hace", -minutes, "minutos", true];
  } else if (minutes === -1) {
    return ["se fue hace", -minutes, "minuto", true];
  } else if (minutes === 1) {
    return ["llega en", minutes, "minuto", false];
  } else {
    return ["llega en", minutes, "minutos", false];
  }
}

function getBusNumberAndCode(bus) {
  const number = bus.match(/^\d+/)[0];
  const code = bus.slice(number.length);
  return { number, code };
}

const timeWidth = 64;
const restWidth = `calc(100% - ${timeWidth}px)`;
const arrivalHeight = 78;
const rowHeight = 78 + 4;

function Arrival({ arrival, now }) {
  const { bus, description, arrival: time } = arrival;
  const { number, code } = getBusNumberAndCode(bus);
  const [time1, time2, time3, isGone] = timeDifference(now, new Date(time));
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "0 10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "height 0.2s ease-in",
        height: isGone ? 0 : rowHeight,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px",
          paddingLeft: "20px",
          background: "rgba(20,20,20,0.75)",
          color: "#fafafa",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "space-between",
          height: arrivalHeight
        }}
      >
        <div style={{ width: restWidth }}>
          <div style={{ fontSize: "32px" }}>
            <strong>{number}</strong>
            <span style={{ color: "#ccc" }}>{code}</span>
          </div>
          <div
            className="ellipsis"
            style={{ fontSize: "15px", lineHeight: "18px", color: "#eee" }}
          >
            {description}
          </div>
        </div>
        <div
          style={{
            width: timeWidth,
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

function MyLocation({ left, top }) {
  const size = 16;
  return (
    <span
      style={{
        boxSizing: "border-box",
        position: "absolute",
        height: size,
        width: size,
        transform: `translate(${left - size / 2}px, ${top - size / 2}px)`,
        background: "#4183f3",
        border: "2px solid rgba(250,250,250,0.9)",
        borderRadius: "50%",
        boxShadow: "0px 0px 5px #4183f3"
      }}
    />
  );
}

export default function() {
  const [{ bounds, center, location }, dispatch] = useLocation();
  console.log("center", center);
  const [stops, setStops] = React.useState([]);
  const [arrivals, setArrivals] = React.useState([]);
  const [isMovingMap, setIsMovingMap] = React.useState(false);

  const handleBoundsChange = async ({ bounds, center }) => {
    dispatch({ type: "bounds-change", bounds, center });
  };

  React.useEffect(() => {
    const load = async () => {
      const stops = await getStops(bounds);
      console.log({ bounds, stops });
      setStops(stops);
      const arrivals = await getArrivals(stops.map(stop => stop[0]));
      console.log("arrivals", arrivals);
      setArrivals(arrivals);
    };

    load();
    // clean effect
  }, [bounds.ne[0], bounds.ne[1], bounds.sw[0], bounds.sw[1]]);

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <Map
        center={center}
        maxZoom={22}
        zoom={19}
        minZoom={17}
        onBoundsChanged={handleBoundsChange}
      >
        {stops.map(([stopId, lat, long]) => (
          <Marker key={stopId} anchor={[lat, long]} />
        ))}
        <MyLocation anchor={location} />
      </Map>
      <div
        style={{
          display: !isMovingMap && "none",
          boxSizing: "border-box",
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "10px",
          background: "rgba(255,255,255,0.5)"
        }}
      >
        <p style={{ color: "#444" }}>
          Mové el mapa y hacé zoom para que solo queden las paradas que te
          interesan.
        </p>
        <button
          className="button white"
          style={{ marginBottom: "6px" }}
          onClick={() => dispatch({ type: "center" })}
        >
          Centrar
        </button>
        <button className="button green" onClick={() => setIsMovingMap(false)}>
          Listo
        </button>
      </div>
      <div
        className="hide-scrollbar"
        style={{
          display: isMovingMap && "none",
          position: "absolute",
          top: 0,
          fontSize: "1.3em",
          height: "100%",
          width: "100%",
          maxHeight: "100%"
          // background: "rgba(255,255,255,0.4)"
        }}
      >
        <div style={{ height: `calc(100% - ${rowHeight * 3.8}px` }} />
        <div
          style={{
            padding: "0 16px 5px 0",
            textAlign: "right",
            fontSize: "16px",
            textTransform: "uppercase",
            color: "#333",
            fontWeight: "bolder",
            textShadow: "0 1px 2px rgba(255, 255, 255, 0.3)",
            cursor: "pointer"
          }}
          onClick={() => setIsMovingMap(true)}
        >
          Mover Mapa
        </div>
        <Arrivals arrivals={arrivals} />
      </div>
    </div>
  );
}
