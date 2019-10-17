import React from "react";
import Map from "pigeon-maps";
import useLocation from "../components/use-location";

import "./index.css";
import getStops from "../components/get-stops";

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
    ></span>
  );
}

export default function() {
  const location = useLocation() || defaultLocation;
  console.log(location);
  const [stops, setStops] = React.useState([]);

  const handleBoundsChange = async ({ bounds }) => {
    const stops = await getStops(bounds);
    console.log({ bounds, stops });
    setStops(stops);
  };

  return (
    <div style={{ height: "100%" }}>
      <Map
        center={location}
        zoom={18}
        minZoom={17}
        onBoundsChanged={handleBoundsChange}
      >
        {stops.map(([stopId, lat, long]) => (
          <Marker key={stopId} anchor={[lat, long]}>
            Hi
          </Marker>
        ))}
      </Map>
    </div>
  );
}
