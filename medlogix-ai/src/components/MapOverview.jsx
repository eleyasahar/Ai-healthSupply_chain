// src/components/MapOverview.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertTriangle, Bed, Sparkles, CheckCircle2 } from 'lucide-react';
import { phcDistricts } from '../services/mockData';

// Custom Map Pins (Critical = Red, Normal = Emerald Green)
const createCustomIcon = (isCritical) => {
  const color = isCritical ? '#f43f5e' : '#10b981'; // Rose-500 or Emerald-500
  const svgHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'custom-map-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });
};

export default function MapOverview({ onSelectDistrict }) {
  // Center map around Delhi / Western UP (Average Coordinates)
  const defaultCenter = [28.8, 77.8];
  const defaultZoom = 8;

  return (
    <section className="space-y-3">
      {/* Map Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Geographic Network Map
            </h2>
            <p className="text-xs text-slate-400">
              Interactive GPS tracking of PHCs across Delhi NCR & Uttar Pradesh
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            <span className="text-slate-300">Critical Shortage</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-300">Adequate Stock</span>
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl relative">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={false}
          className="h-full w-full z-10"
        >
          {/* Dark Mode Map Tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Markers */}
          {phcDistricts.map((phc) => (
            <Marker
              key={phc.id}
              position={[phc.lat, phc.lng]}
              icon={createCustomIcon(phc.criticalShortage)}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px] text-slate-900 font-sans">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                    <h4 className="font-bold text-xs leading-tight text-slate-900">
                      {phc.name}
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-600 mb-2">
                    📍 {phc.district}, {phc.state}
                  </p>

                  <div className="space-y-1 mb-3 text-[11px]">
                    <div className="flex justify-between text-slate-700">
                      <span>Beds Occupied:</span>
                      <strong>
                        {phc.bedsOccupied}/{phc.totalBeds}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Status:</span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${phc.criticalShortage
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                          }`}
                      >
                        {phc.criticalShortage ? 'Critical Alert' : 'Normal'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectDistrict(phc)}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold rounded text-[11px] flex items-center justify-center space-x-1 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Trigger AI Rebalance</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}