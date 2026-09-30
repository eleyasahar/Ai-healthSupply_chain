// src/App.jsx
import React, { useState } from 'react';
import NationalSummary from './components/NationalSummary';
import MapOverview from './components/MapOverview';
import DistrictGrid from './components/DistrictGrid';
import LiveLogs from './components/LiveLogs';
import RebalanceDrawer from './components/RebalanceDrawer';
import CommandDashboard from './components/CommandDashboard';
export default function App() {
  const [selectedPhc, setSelectedPhc] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              PHC AI Inventory Rebalance Network
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated medical stock tracking and emergency supply chain optimization for Primary Health Centers.
          </p>
        </header>

        {/* 1. National KPI Overview */}
        <NationalSummary />

        {/* 2. Geographic Leaflet Map */}
        <MapOverview onSelectDistrict={(phc) => setSelectedPhc(phc)} />

        {/* 3. District PHCs Grid */}
        <DistrictGrid onSelectDistrict={(phc) => setSelectedPhc(phc)} />

        {/* 4. Live Rebalance Transit Logs */}
        <LiveLogs />

        {/* 5. Slide-over AI Rebalance Drawer */}
        <RebalanceDrawer
          selectedPhc={selectedPhc}
          onClose={() => setSelectedPhc(null)}
        />


        {/* COMMAND DASHBOARD SECTION */}
        <CommandDashboard />

      </div>
      {/* Main content ke bilkul niche footer paste karein */}
      <footer className="w-full mt-12 py-6 px-8 bg-slate-950 border-t border-slate-800 text-slate-500 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>National Health Grid Service Status: <strong className="text-slate-300">Operational</strong></span>
        </div>

        <div className="text-center sm:text-right">
          <p>&copy; {new Date().getFullYear()} <span className="text-slate-300 font-semibold">eleya.exe</span>. All rights reserved.</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Federated AI Health Supply Chain & Emergency Rebalance System</p>
        </div>
      </footer>
    </div>
  );
}