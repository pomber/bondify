async function fetchArrivals(stop) {
  try {
    const response = await fetch(`.netlify/functions/bus?stop=${stop}`);
    if (!response.ok) {
      throw new Error(response.json());
    }
    return await response.json();
  } catch (e) {
    console.warn(e);
    return [];
  }
}

export default async function getArrivals(stops) {
  const promises = stops.map(fetchArrivals);
  const arrivalsList = await Promise.all(promises);
  const arrivals = arrivalsList.reduce((a, b) => a.concat(b), []);
  arrivals.sort((a, b) => a.arrival - b.arrival);
  return arrivals;
}
