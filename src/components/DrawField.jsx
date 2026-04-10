import { useState, useRef } from "react";
import { MapContainer, Marker, Polygon, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "../hooks/useTranslation";

// Child component to safely use leaflet hooks
function MapEventsHandler({ onPointerAdd }) {
  useMapEvents({
    click: (e) => {
      onPointerAdd([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function DrawField({ points = [], onAddPoint }) {
  const mapRef = useRef(null);
  const { t } = useTranslation();

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 16);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not get your location. Please check permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handlePointerAdd = (latlng) => {
    if (onAddPoint) {
      onAddPoint(latlng);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <MapContainer
        center={[22.3038, 72.5564]}
        zoom={14}
        scrollWheelZoom={true}
        className="h-96 w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url={`https://api.maptiler.com/maps/satellite/256/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
        />

        {/* Draw a marker for every clicked point */}
        {points.map((point, index) => (
          <Marker key={`marker-${index}`} position={point} />
        ))}

        {/* Draw the polygon shape connecting points only if 3+ exist */}
        {points.length >= 3 && (
          <Polygon
            positions={points}
            pathOptions={{ color: "#2f9f31", fillColor: "#5fbf66", fillOpacity: 0.28 }}
          />
        )}

        {/* The map event listener */}
        <MapEventsHandler onPointerAdd={handlePointerAdd} />
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[400] pointer-events-none">
        <button
          onClick={handleLocateMe}
          className="pointer-events-auto rounded-lg bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white shadow-md transition hover:bg-leaf-700"
        >
          📍 {t("locate_me")}
        </button>
      </div>
    </div>
  );
}
