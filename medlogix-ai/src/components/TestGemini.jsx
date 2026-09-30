// src/components/TestGemini.jsx
import React, { useState } from 'react';
import { getStockRedistributionPlan } from '../services/gemini';
import { phcDistricts } from '../services/mockData';
import { Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function TestGemini() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleTestAPI = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Test using the Okhla PHC mock data
            const targetPHC = phcDistricts[0];
            const data = await getStockRedistributionPlan(targetPHC, phcDistricts);
            setResult(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'API Call Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Gemini 2.5 Flash API Connection Test</h3>
                </div>
                <button
                    onClick={handleTestAPI}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Testing Connection...</span>
                        </>
                    ) : (
                        <span>Run Gemini Test</span>
                    )}
                </button>
            </div>

            {/* Success Output */}
            {result && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                    <div className="flex items-center space-x-2 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>API Connected Successfully!</span>
                    </div>
                    <p><strong>Urgency Level:</strong> {result.urgencyLevel}</p>
                    <p><strong>AI Summary:</strong> {result.summary}</p>
                </div>
            )}

            {/* Error Output */}
            {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                    <div className="flex items-center space-x-2 font-semibold">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Error: {error}</span>
                    </div>
                    <div className="pl-6 pt-1 text-slate-300 text-[11px] space-y-1">
                        <p className="font-semibold text-cyan-300">How to fix:</p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-400">
                            <li>Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Google AI Studio</a>.</li>
                            <li>Open <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">.env.local</code> in project root and add: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">VITE_GEMINI_API_KEY=your_key</code></li>
                            <li>Restart the dev server (<code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">Ctrl+C</code> then <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">npm run dev</code>).</li>
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
}