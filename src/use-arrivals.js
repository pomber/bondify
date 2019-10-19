import React from "react";

import useTime from "./use-time";
import getStops from "./get-stops";
import getArrivals from "./arriving";

export default function useArrivals(bounds) {
  const [stops, setStops] = React.useState([]);
  const [arrivals, setArrivals] = React.useState([]);
  const now = useTime(1000 * 10).getTime();

  React.useEffect(
    function fetchStopsAndArrivals() {
      let didCancel = false;
      const load = async () => {
        const stops = await getStops(bounds);
        // console.log("stops", didCancel, stops);
        if (didCancel) return;
        setStops(stops);
        const arrivals = await getArrivals(stops.map(stop => stop[0]));
        // console.log("arrivals", didCancel, arrivals);
        if (didCancel) return;
        setArrivals(arrivals);
      };

      load();

      return () => {
        didCancel = true;
      };
    },
    [bounds.ne[0], bounds.ne[1], bounds.sw[0], bounds.sw[1], now]
  );

  return { stops, arrivals };
}
