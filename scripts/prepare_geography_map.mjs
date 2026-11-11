// Regenerate with: node scripts/prepare_geography_map.mjs
// Natural Earth v5.1.2, public domain. No map service is contacted during play.
import { geoCentroid, geoContains, geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo';
import { readFile, writeFile } from 'node:fs/promises';

const source = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_110m_admin_0_countries.geojson';
let collection;
if (process.argv[2]) collection = JSON.parse(await readFile(process.argv[2], 'utf8'));
else {
  const response = await fetch(source);
  if (!response.ok) throw new Error(`Map download failed: ${response.status}`);
  collection = await response.json();
}
const projection = geoNaturalEarth1().fitExtent([[18, 18], [1182, 612]], { type: 'Sphere' });
const path = geoPath(projection).digits(2);
const continentNames = {
  Europe: 'Europa', Asia: 'Asien', Africa: 'Afrika',
  'North America': 'Nordamerika', 'South America': 'Sydamerika',
  Oceania: 'Oceanien', Antarctica: 'Antarktis',
  'Seven seas (open ocean)': 'Oceanien',
};
const countries = collection.features.map(feature => {
  const p = feature.properties;
  const label = [p.LABEL_X, p.LABEL_Y];
  const centroid = geoCentroid(feature);
  const point = projection(geoContains(feature, label) ? label : geoContains(feature, centroid) ? centroid : label);
  return { id: p.ADM0_A3, name: p.NAME_SV || p.ADMIN, continent: continentNames[p.CONTINENT],
    path: path(feature), point: point.map(n => +n.toFixed(2)) };
});
const extents = {
  Europa: [-14, 35, 39, 72], Asien: [33, -12, 151, 65], Afrika: [-20, -36, 54, 38],
  Nordamerika: [-168, 6, -50, 75], Sydamerika: [-84, -57, -32, 14], Oceanien: [92, -49, 179, 13],
};
const regions = Object.fromEntries(Object.entries(extents).map(([name, [west, south, east, north]]) => {
  const points = [];
  for (let lon = west; lon <= east; lon++) for (const lat of [south, north]) points.push(projection([lon, lat]));
  const x = Math.min(...points.map(p => p[0])) - 15;
  const y = Math.min(...points.map(p => p[1])) - 15;
  return [name, [x, y, Math.max(...points.map(p => p[0])) - x + 15, Math.max(...points.map(p => p[1])) - y + 15].map(n => +n.toFixed(2))];
}));
const labels = [
  ['Nordamerika', -108, 46], ['Sydamerika', -59, -19], ['Europa', 15, 53],
  ['Afrika', 19, 6], ['Asien', 92, 42], ['Oceanien', 139, -23], ['Antarktis', 0, -78],
].map(([name, lon, lat]) => ({ name, point: projection([lon, lat]).map(n => +n.toFixed(2)) }));
await writeFile(new URL('../src/data/geographyMap.json', import.meta.url), JSON.stringify({
  source, license: 'Public domain', projection: 'Natural Earth I', width: 1200, height: 630,
  sphere: path({ type: 'Sphere' }), graticule: path(geoGraticule10()), regions, labels, countries,
}) + '\n');
console.log(`Prepared ${countries.length} country outlines and ${labels.length} continent labels.`);
