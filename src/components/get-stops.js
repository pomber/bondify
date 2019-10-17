async function fetchTile(lat, long) {
  try {
    const response = await fetch(`stops/${lat}${long}.json`);
    return await response.json();
  } catch (e) {
    console.warn(e);
    return [];
  }
}

export default async function getStops(bounds) {
  const { ne, sw } = bounds;
  const toKey = l => Math.round(Math.abs(l) * 10);
  const minLat = Math.min(toKey(ne[0]), toKey(sw[0]));
  const maxLat = Math.max(toKey(ne[0]), toKey(sw[0]));
  const minLong = Math.min(toKey(ne[1]), toKey(sw[1]));
  const maxLong = Math.max(toKey(ne[1]), toKey(sw[1]));

  const promises = [];
  for (let lat = minLat; lat <= maxLat; lat++) {
    for (let long = minLong; long <= maxLong; long++) {
      promises.push(fetchTile(lat, long));
    }
  }
  const tiles = await Promise.all(promises);
  const allStops = tiles.reduce((a, b) => a.concat(b), []);

  return allStops.filter(
    ([, lat, long]) =>
      sw[0] <= lat && lat <= ne[0] && sw[1] <= long && long <= ne[1]
  );
}
