import { useState, useEffect } from "react";

const onError = error => {
  console.error(error);
};

export default function() {
  const [position, setPosition] = useState();

  const onChange = ({ coords }) => {
    setPosition([coords.latitude, coords.longitude]);
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      console.error("Geolocation is not supported");
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);

  return position;
}
