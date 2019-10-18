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
  const seconds = (b - a) / 1000;
  if (seconds < 60) {
    return `viene en ${Math.round(seconds)} segundos`;
  }
  const minutes = seconds / 60;
  return `viene en ${Math.round(minutes)} minutos`;
}

function Arrivals({ arrivals }) {
  const now = useTime();
  return (
    <React.Fragment>
      {arrivals.map(({ trip, arrival, bus }) => (
        <div key={trip}>
          <strong>{bus}</strong> {timeDifference(now, new Date(arrival))}
        </div>
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
      <div style={{ position: "absolute", top: 0, fontSize: "1.3em" }}>
        <Arrivals arrivals={arrivals} />
      </div>
    </div>
  );
}
