import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Building2, Users, RefreshCw, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

const CommandDashboard = () => {
    const [phcs, setPhcs] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = 'http://localhost:5000/api';

    const fetchData = async () => {
        try {
            setLoading(true);
            const [phcRes, invRes, redRes] = await Promise.all([
                fetch(`${API_BASE}/phcs`),
                fetch(`${API_BASE}/inventory`),
                fetch(`${API_BASE}/redistribute`)
            ]);

            const phcData = await phcRes.json();
            const invData = await invRes.json();
            const redData = await redRes.json();

            setPhcs(phcData);
            setInventory(invData);
            setAlerts(redData.alerts || []);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const totalBeds = phcs.reduce((acc, p) => acc + (p.capacity?.total_beds || 0), 0);
    const occupiedBeds = phcs.reduce((acc, p) => acc + (p.capacity?.occupied_beds || 0), 0);
    const totalDoctors = phcs.reduce((acc, p) => acc + (p.personnel?.doctors_present || 0), 0);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            {/* Header Bar */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-5">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            National Health Resource Command Hub
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            BRICS Node Sync Active
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">
                        Federated AI Supply Chain & Automated Resource Redistribution
                    </p>
                </div>

                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing...' : 'Refresh Live Data'}
                </button>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total PHC Nodes</span>
                        <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-3xl font-extrabold text-white">{phcs.length}</div>
                    <span className="text-xs text-slate-500 mt-2 block">Across 1 National Command Hub</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Bed Occupancy</span>
                        <Activity className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="text-3xl font-extrabold text-white">
                        {occupiedBeds} <span className="text-lg font-normal text-slate-500">/ {totalBeds}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Medical Personnel</span>
                        <Users className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-extrabold text-white">{totalDoctors}</div>
                    <span className="text-xs text-emerald-400 mt-2 block font-medium">Doctors Active on Duty</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm border-l-4 border-l-rose-500">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stock-Out Warnings</span>
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="text-3xl font-extrabold text-rose-400">{alerts.length}</div>
                    <span className="text-xs text-rose-400/80 mt-2 block">Automated Action Required</span>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Redistribution AI Alerts */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Truck className="w-5 h-5 text-amber-400" />
                            Automated Redistribution Engine
                        </h2>
                    </div>

                    {alerts.length === 0 ? (
                        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-center">
                            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                            <p className="text-sm text-slate-300 font-medium">All Supply Levels Optimal</p>
                            <p className="text-xs text-slate-500 mt-1">No cross-district transfers required at this moment.</p>
                        </div>
                    ) : (
                        alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="p-5 bg-slate-900 border border-amber-500/30 rounded-xl shadow-sm relative overflow-hidden group hover:border-amber-500/60 transition"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        {alert.severity} CRITICAL
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">{alert.item_name}</span>
                                </div>

                                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                                    {alert.message}
                                </p>

                                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Source PHC:</span>
                                        <span className="text-white font-mono">{alert.source_phc}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Target Shortage PHC:</span>
                                        <span className="text-rose-400 font-mono">{alert.target_phc}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                                        <span>Transfer Qty:</span>
                                        <span className="text-amber-400 font-bold">{alert.recommended_transfer_qty} Units</span>
                                    </div>
                                </div>

                                <button className="w-full mt-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-lg border border-amber-500/30 flex items-center justify-center gap-1.5 transition">
                                    Dispatch Allocation Order <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Right Column: PHC Network Status Table */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Live PHC Network Monitoring</h2>
                        <span className="text-xs text-slate-400">Real-Time Data Feed</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="p-4">PHC ID</th>
                                        <th className="p-4">Center Name</th>
                                        <th className="p-4">District</th>
                                        <th className="p-4">Bed Status</th>
                                        <th className="p-4">Staff On Duty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-300">
                                    {phcs.map((phc) => (
                                        <tr key={phc.phc_id} className="hover:bg-slate-800/50 transition">
                                            <td className="p-4 font-mono font-bold text-blue-400">{phc.phc_id}</td>
                                            <td className="p-4 font-medium text-white">{phc.name}</td>
                                            <td className="p-4 text-slate-400">{phc.district_id}</td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                                                    {phc.capacity?.occupied_beds} / {phc.capacity?.total_beds} Beds
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-slate-400">
                                                <span className="text-emerald-400 font-semibold">{phc.personnel?.doctors_present} Doctors</span>, {phc.personnel?.nurses_present} Nurses
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CommandDashboard;