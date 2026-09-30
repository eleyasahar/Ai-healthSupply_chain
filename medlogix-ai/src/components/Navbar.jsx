import React from 'react';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0F17]/80 border-b border-slate-800/80 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Brand & Project Name */}
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </div>

                    <div>
                        <div className="flex items-center space-x-2">
                            <h1 className="text-xl font-bold tracking-tight text-white">
                                MedLogix <span className="text-cyan-400">AI</span>
                            </h1>

                            <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                AntiGravity
                            </span>
                        </div>

                        <p className="text-xs text-slate-400">
                            Healthcare Supply Chain & Redistribution Network
                        </p>
                    </div>
                </div>

                {/* Live Status & Team Branding */}
                <div className="flex items-center space-x-4">

                    {/* Gemini AI Status */}
                    <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                        <Cpu className="w-4 h-4 text-emerald-400" />

                        <span>Gemini 2.5 Flash:</span>

                        <span className="text-emerald-400 font-medium">
                            Active
                        </span>
                    </div>

                    {/* Team Branding */}
                    <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />

                        <span className="text-xs font-semibold text-slate-200">
                            Team <span className="text-cyan-300">eleya.exe</span>
                        </span>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Navbar;