// src/components/DistrictGrid.jsx
import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Bed, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { phcDistricts } from '../services/mockData';

export default function DistrictGrid({ onSelectDistrict }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'NORMAL'

  // Filtered PHCs based on search query and status filter
  const filteredDistricts = useMemo(() => {
    return phcDistricts.filter((phc) => {
      // 1. Search Filter (Name, District, State)
      const matchesSearch =
        phc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phc.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phc.state.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Status Filter
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'CRITICAL' && phc.criticalShortage) ||
        (statusFilter === 'NORMAL' && !phc.criticalShortage);

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
  };

  return (
    <section className="space-y-5">
      {/* Top Header & Search / Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Primary Health Centers Inventory Grid</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time bed occupancy, critical medicine stock, and trigger AI rebalances.
          </p>
        </div>

        {/* Controls Container */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search PHC name, district..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-800 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({phcDistricts.length})
            </button>
            <button
              onClick={() => setStatusFilter('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 ${
                statusFilter === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Critical</span>
            </button>
            <button
              onClick={() => setStatusFilter('NORMAL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 ${
                statusFilter === 'NORMAL'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Normal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Results */}
      {filteredDistricts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredDistricts.map((phc) => {
            const occupancyRate = Math.round((phc.bedsOccupied / phc.totalBeds) * 100);

            return (
              <div
                key={phc.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all"
              >
                {/* PHC Header Info */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base">{phc.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {phc.district}, {phc.state}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center space-x-1 ${
                        phc.criticalShortage
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {phc.criticalShortage ? (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          <span>Critical Shortage</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Normal</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Bed Occupancy Bar */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400 flex items-center space-x-1">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>Bed Occupancy</span>
                      </span>
                      <span className="font-semibold text-slate-200">
                        {phc.bedsOccupied} / {phc.totalBeds} ({occupancyRate}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          occupancyRate > 85 ? 'bg-rose-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Medicine Stock Summary */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Pharma Inventory Breakdown
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {phc.inventory.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60 flex items-center justify-between"
                        >
                          <span className="text-slate-300 font-medium truncate pr-1">
                            {item.name}
                          </span>
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              item.status === 'Critical'
                                ? 'text-rose-400'
                                : item.status === 'Warning'
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {item.stock} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Trigger Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Last Sync: {phc.lastSync}
                  </span>
                  <button
                    onClick={() => onSelectDistrict(phc)}
                    className="py-2 px-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Trigger AI Rebalance</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <Filter className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No Health Centers Found</h3>
          <p className="text-xs text-slate-500">
            No PHC matched your search term "{searchTerm}" or selected status filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center space-x-1.5 text-xs text-cyan-400 hover:underline pt-2 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      )}
    </section>
  );
}