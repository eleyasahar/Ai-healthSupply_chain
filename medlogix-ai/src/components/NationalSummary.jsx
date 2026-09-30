// src/components/NationalSummary.jsx
import React from 'react';
import { 
  Building2, 
  AlertTriangle, 
  Truck, 
  IndianRupee, 
  TrendingDown, 
  Activity 
} from 'lucide-react';
import { nationalSummary } from '../services/mockData';

export default function NationalSummary({ summaryData = nationalSummary }) {
  const kpiCards = [
    {
      id: 'active-phcs',
      title: 'Active Network PHCs',
      value: summaryData.activePHCs,
      subtitle: 'Across UP & Delhi sectors',
      icon: Building2,
      accentColor: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      badge: 'Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'critical-alerts',
      title: 'Critical Supply Alerts',
      value: summaryData.criticalAlerts,
      subtitle: 'Stock-outs expected < 3 days',
      icon: AlertTriangle,
      accentColor: 'from-rose-500/20 to-pink-500/10',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400',
      badge: 'Requires Action',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse',
    },
    {
      id: 'rebalance-events',
      title: 'Rebalance Operations',
      value: summaryData.rebalanceEventsToday,
      subtitle: 'Active dispatches today',
      icon: Truck,
      accentColor: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      badge: 'In Transit',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      id: 'total-stock',
      title: 'Total Network Stock Value',
      value: summaryData.totalStockValue,
      subtitle: 'Essential pharma inventory',
      icon: IndianRupee,
      accentColor: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      badge: 'Optimized',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    },
    {
      id: 'stockout-risk',
      title: 'Avg Stockout Risk',
      value: summaryData.avgStockoutRisk,
      subtitle: '-2.1% from last week',
      icon: TrendingDown,
      accentColor: 'from-purple-500/20 to-indigo-500/10',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      badge: 'Low Risk',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
  ];

  return (
    <section className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            National Healthcare Grid Overview
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          Sync Frequency: <span className="text-cyan-400">Real-time</span>
        </span>
      </div>

      {/* Responsive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.accentColor} bg-slate-900/90 border ${card.borderColor} p-4 flex flex-col justify-between shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 hover:-translate-y-0.5`}
            >
              {/* Top Row: Icon + Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 ${card.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              {/* Value & Label */}
              <div>
                <span className="text-2xl font-black text-white tracking-tight block">
                  {card.value}
                </span>
                <span className="text-xs font-semibold text-slate-300 block mt-0.5">
                  {card.title}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {card.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}