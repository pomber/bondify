const csv = require("fast-csv");
const fs = require("fs");

const tiles = {};
function addStop({ id, lat, long }) {
  const name = p => Math.round(Math.abs(+p) * 10);
  const tilekey = `${name(lat)}${name(long)}`;
  const stop = [id, +lat, +long];
  if (tilekey in tiles) {
    tiles[tilekey].push(stop);
  } else {
    tiles[tilekey] = [stop];
  }
}

function saveTiles() {
  Object.keys(tiles).map(key => {
    console.log(`stops/${key}.json: ${tiles[key].length} stops`);
    fs.writeFileSync(`stops/${key}.json`, JSON.stringify(tiles[key]));
  });
}

fs.createReadStream("./stops.txt")
  .pipe(csv.parse({ headers: ["id", , , "lat", "long"], renameHeaders: true }))
  .on("error", error => console.error(error))
  .on("data", addStop)
  .on("end", saveTiles);
