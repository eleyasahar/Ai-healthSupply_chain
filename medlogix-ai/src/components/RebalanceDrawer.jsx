// src/components/RebalanceDrawer.jsx
import React, { useState } from 'react';
import { X, Bot, Truck, ArrowRight, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { phcDistricts } from '../services/mockData';

export default function RebalanceDrawer({ selectedPhc, onClose }) {
  if (!selectedPhc) return null;

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);

  // Find donor PHCs (PHCs with surplus stock for items the selected PHC is critical on)
  const criticalItems = selectedPhc.inventory.filter((item) => item.status === 'Critical');

  const handleRunAiAnalysis = () => {
    setIsGenerating(true);
    setAiPlan(null);

    // Simulate AI optimization response based on selected PHC
    setTimeout(() => {
      const suggestedDonor = phcDistricts.find(
        (p) => p.id !== selectedPhc.id && !p.criticalShortage
      ) || phcDistricts[1];

      setAiPlan({
        donorName: suggestedDonor.name,
        donorDistrict: suggestedDonor.district,
        estimatedDistance: '142 km',
        estimatedTime: '2 hours 40 mins',
        transferItems: criticalItems.map((item) => ({
          name: item.name,
          quantityToTransfer: Math.round(item.minRequired * 0.7),
          unit: item.unit,
        })),
        priorityScore: '94/100 (Urgent)',
        reasoning: `Selected ${suggestedDonor.name} as optimal donor due to high stock reserves and direct highway connectivity to ${selectedPhc.name}.`,
      });
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">AI Stock Rebalance Hub</h3>
                <p className="text-xs text-slate-400">Target: {selectedPhc.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Shortages Summary */}
          <div className="mt-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Detected Critical Shortages
            </h4>
            {criticalItems.length > 0 ? (
              criticalItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="font-semibold text-rose-200">{item.name}</span>
                  </div>
                  <span className="text-rose-300 font-medium">
                    {item.stock} / {item.minRequired} {item.unit} ({item.daysLeft}d left)
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>No critical stock-out risks detected for this PHC.</span>
              </div>
            )}
          </div>

          {/* Trigger AI Button */}
          <div className="mt-6">
            <button
              onClick={handleRunAiAnalysis}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>{isGenerating ? 'Analyzing Redistribution Routes...' : 'Generate AI Redistribution Plan'}</span>
            </button>
          </div>

          {/* AI Strategy Result */}
          {aiPlan && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                    Recommended Donor Center
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-semibold">
                    Priority: {aiPlan.priorityScore}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-200 font-medium">
                  <div>
                    <span className="block text-slate-400 text-[10px]">FROM</span>
                    <span className="font-bold">{aiPlan.donorName}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <div className="text-right">
                    <span className="block text-slate-400 text-[10px]">TO</span>
                    <span className="font-bold">{selectedPhc.name}</span>
                  </div>
                </div>

                <p className="text-slate-400 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {aiPlan.reasoning}
                </p>

                {/* Items to Transfer */}
                <div className="space-y-2 pt-1">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                    Dispatched Quantity
                  </span>
                  {aiPlan.transferItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-200 text-xs bg-slate-900 p-2 rounded-lg">
                      <span>{item.name}</span>
                      <strong className="text-cyan-300">{item.quantityToTransfer} {item.unit}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between space-x-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            disabled={!aiPlan}
            onClick={() => {
              alert('Rebalance order dispatched to transport unit!');
              onClose();
            }}
            className="w-1/2 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Truck className="w-4 h-4" />
            <span>Approve & Dispatch</span>
          </button>
        </div>

      </div>
    </div>
  );
}