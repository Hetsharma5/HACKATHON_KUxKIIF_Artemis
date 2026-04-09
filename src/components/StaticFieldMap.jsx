import { useEffect } from "react";
import { MapContainer, Polygon, TileLayer, useMapEvents, useMap } from "react-leaflet";

const DEMO_POLYGON = [
  [22.315, 72.548],
  [22.315, 72.566],
  [22.304, 72.571],
  [22.298, 72.556],
  [22.303, 72.545],
];

function TapHandler({ onTap }) {
  useMapEvents({
    click: () => {
      if (onTap) {
        onTap();
      }
    },
  });

  return null;
}

function MapBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      map.fitBounds(positions, { padding: [20, 20], maxZoom: 18 });
    }
  }, [map, positions]);
  return null;
}

function StaticFieldMap({ showRows = false, previewLines = [], onDemoTap, points = [] }) {
  const activePositions = points.length > 2 ? points : DEMO_POLYGON;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-leaf-200 bg-white shadow-soft">
      <MapContainer
        center={[22.3038, 72.5564]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-72 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url={`https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
        />
        <Polygon
          positions={activePositions}
          pathOptions={{ color: "#2f9f31", fillColor: "#5fbf66", fillOpacity: 0.28 }}
        />
        <MapBounds positions={activePositions} />
        <TapHandler onTap={onDemoTap} />
      </MapContainer>
      {showRows && (
        <div className="pointer-events-none absolute inset-0">
          {previewLines.map((line) => {
            const lineStyle =
              line.orientation === "vertical"
                ? { left: `${line.positionPercent}%`, top: "12%", bottom: "12%" }
                : { top: `${line.positionPercent}%`, left: "12%", right: "12%" };

            return (
              <span
                key={line.id}
                className={`absolute rounded-full bg-leaf-600/60 ${
                  line.orientation === "vertical" ? "w-[2px]" : "h-[2px]"
                }`}
                style={lineStyle}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StaticFieldMap;
