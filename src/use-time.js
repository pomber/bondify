import { useEffect, useState } from "react";

export default function useTime(ms = 1000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), ms);

    return () => clearInterval(intervalId);
  }, [ms]);

  return now;
}
