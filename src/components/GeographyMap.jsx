import { useEffect, useRef, useState } from "react";
import { LocateFixed, Minus, Plus } from "lucide-react";
import map from "../data/geographyMap.json";

const byId = Object.fromEntries(map.countries.map(country => [country.id, country]));

function placeMarkers(ids, view, scale) {
  const placed = [];
  const gap = 32 * scale;
  for (const [index, id] of ids.entries()) {
    const [x, y] = byId[id].point;
    let point = [x, y];
    let found = false;
    for (let ring = 0; ring < 8 && !found; ring++) {
      for (let step = 0; step < (ring ? 12 : 1); step++) {
        const angle = step * Math.PI / 6;
        const candidate = [
          Math.max(view[0] + gap / 2, Math.min(view[0] + view[2] - gap / 2, x + Math.cos(angle) * ring * gap)),
          Math.max(view[1] + gap / 2, Math.min(view[1] + view[3] - gap / 2, y + Math.sin(angle) * ring * gap)),
        ];
        if (placed.every(p => Math.hypot(p.point[0] - candidate[0], p.point[1] - candidate[1]) >= gap)) {
          point = candidate; found = true; break;
        }
      }
    }
    placed.push({ id, index, origin: [x, y], point });
  }
  return placed;
}

export default function GeographyMap({ region, options = [], selected, onSelect, disabled = false, revealId, correctId, showLabels = false }) {
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState({ width: 800, height: 420 });
  const container = useRef(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width || 800, height: entry.contentRect.height || 420 }));
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const base = region ? map.regions[region] : [0, 0, map.width, map.height];
  const focusId = disabled ? (revealId || correctId || selected) : selected;
  const point = byId[focusId]?.point;
  const w = base[2] / zoom;
  const h = base[3] / zoom;
  const center = point || [base[0] + base[2] / 2, base[1] + base[3] / 2];
  const view = zoom === 1 ? base : [
    Math.max(base[0], Math.min(base[0] + base[2] - w, center[0] - w / 2)),
    Math.max(base[1], Math.min(base[1] + base[3] - h, center[1] - h / 2)), w, h,
  ];
  const scale = Math.max(view[2] / size.width, view[3] / size.height);
  // Only place pins actually inside the current view; the numbered buttons
  // remain available below the map when zoomed in.
  const visible = options.filter(id => {
    const [x, y] = byId[id].point;
    return x >= view[0] && x <= view[0] + view[2] && y >= view[1] && y <= view[1] + view[3];
  });
  const markers = placeMarkers(visible, view, scale);
  const reveal = byId[revealId];
  return <figure className="geo-map">
    <div className="geo-map-toolbar"><span>{region ? (region === "Oceanien" ? "Oceanien & Sydostasien" : region) : "Världskartan"}</span><div>
      <button type="button" disabled={zoom === 1} aria-label="Zooma ut kartan" onClick={() => setZoom(value => Math.max(1, value - 0.5))}><Minus size={17} /></button>
      <button type="button" disabled={zoom >= 3} aria-label="Zooma in kartan" onClick={() => setZoom(value => Math.min(3, value + 0.5))}><Plus size={17} /></button>
      <button type="button" disabled={zoom === 1} aria-label="Återställ kartutsnitt" onClick={() => setZoom(1)}><LocateFixed size={17} /></button>
    </div></div>
    <svg ref={container} className={`geo-map-svg ${region ? "is-regional" : ""}`} viewBox={view.join(" ")} role="group" aria-label={options.length ? "Välj en numrerad plats på kartan. Samma platser kan väljas med knapparna nedanför." : "Karta över världen med landsgränser"}>
      <title>{region ? `Karta över ${region}` : "Världskarta"}</title>
      <rect x={view[0]} y={view[1]} width={view[2]} height={view[3]} fill="#e4eff0" />
      <path d={map.graticule} className="geo-graticule" aria-hidden="true" />
      <g aria-hidden="true">{map.countries.map(country => <path key={country.id} d={country.path} className={`geo-land ${country.id === revealId || country.id === correctId ? "is-revealed" : ""}`} />)}</g>
      {showLabels && !region && zoom === 1 && <g className="geo-continent-labels" aria-hidden="true">{map.labels.map(label => <text key={label.name} x={label.point[0]} y={label.point[1]} style={{ fontSize: Math.max(21, 10 * scale) }}>{label.name}</text>)}</g>}
      {markers.map(marker => {
        const number = options.indexOf(marker.id) + 1;
        const chosen = selected === marker.id;
        const correct = correctId === marker.id;
        return <g key={marker.id} className={`geo-marker ${chosen ? "is-selected" : ""} ${correct ? "is-correct" : ""} ${disabled && chosen && !correct ? "is-wrong" : ""}`}
          role="button" tabIndex={disabled ? -1 : 0} aria-label={`Plats ${number}`} aria-pressed={chosen} aria-disabled={disabled}
          onClick={() => !disabled && onSelect?.(marker.id)}
          onKeyDown={event => { if (!disabled && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect?.(marker.id); } }}>
          <path d={byId[marker.id].path} className="geo-candidate" />
          <line x1={marker.origin[0]} y1={marker.origin[1]} x2={marker.point[0]} y2={marker.point[1]} strokeWidth={1.5 * scale} />
          <circle className="geo-pin-origin" cx={marker.origin[0]} cy={marker.origin[1]} r={2.5 * scale} />
          <circle cx={marker.point[0]} cy={marker.point[1]} r={13 * scale} strokeWidth={2 * scale} />
          <text x={marker.point[0]} y={marker.point[1]} fontSize={12 * scale}>{number}</text>
        </g>;
      })}
      {reveal && !options.length && <g className="geo-reveal-pin" aria-hidden="true"><circle cx={reveal.point[0]} cy={reveal.point[1]} r={7 * scale} strokeWidth={3 * scale} /></g>}
      <g className="geo-north" aria-hidden="true" transform={`translate(${view[0] + view[2] - 23 * scale}, ${view[1] + 28 * scale}) scale(${scale})`}><path d="M0 5 V-8 M-4 -4 L0 -8 L4 -4" /><text x="0" y="-13">N</text></g>
    </svg>
    <figcaption>{reveal ? <span><strong>{reveal.name}</strong> markerat på kartan</span> : <span>{options.length ? "Välj landets yta, dess siffra eller en platsknapp." : "Norr är uppåt. Linjerna visar ländernas gränser."}</span>}<span>Natural Earth · översiktskarta</span></figcaption>
  </figure>;
}
