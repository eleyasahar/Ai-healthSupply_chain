import React, { useState, useEffect, useMemo, useRef } from 'react';

const LiveLogs = ({ wsUrl = 'ws://localhost:5000' }) => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [isLive, setIsLive] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const socketRef = useRef(null);

  // WebSocket Connection Lifecycle
  useEffect(() => {
    if (!isLive) {
      if (socketRef.current) {
        socketRef.current.close();
      }
      setIsConnected(false);
      return;
    }

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        setLogs((prevLogs) => [newLog, ...prevLogs]);
      } catch (err) {
        console.error('Failed to parse incoming log frame:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error('WebSocket Error:', err);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [wsUrl, isLive]);

  // Filtered logs calculation based on Search Query & Level
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
      const matchesSearch =
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.timestamp.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [logs, selectedLevel, searchQuery]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLevel, pageSize]);

  // Paginated slice
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Export handlers
  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${Date.now()}.json`;
    a.click();
  };

  const exportAsCSV = () => {
    const headers = ['Timestamp', 'Level', 'Message'];
    const rows = filteredLogs.map((log) => [log.timestamp, log.level, `"${log.message}"`]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 p-4 bg-gray-950 text-gray-100 rounded-xl border border-gray-800 shadow-2xl font-sans">
      {/* Top Header & Connection Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-wide">Live System Logs</h2>
          
          {/* Status Indicator */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition ${
              isConnected
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
              }`}
            />
            {isConnected ? 'LIVE' : isLive ? 'CONNECTING...' : 'PAUSED'}
          </button>
        </div>

        {/* Export & Clear Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={exportAsJSON}
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition"
          >
            Export JSON
          </button>
          <button
            onClick={exportAsCSV}
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition"
          >
            Export CSV
          </button>
          <button
            onClick={() => setLogs([])}
            className="px-3 py-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          placeholder="Search log message or time..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-72 bg-gray-900 border border-gray-800 text-sm rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'INFO', 'WARN', 'ERROR'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                selectedLevel === level
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-900 text-xs uppercase text-gray-400 border-b border-gray-800 font-semibold">
            <tr>
              <th scope="col" className="px-4 py-3">Timestamp</th>
              <th scope="col" className="px-4 py-3">Level</th>
              <th scope="col" className="px-4 py-3">Message</th>
              <th scope="col" className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-950 font-mono text-xs">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-900/60 transition">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-400">{log.timestamp}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        log.level === 'ERROR'
                          ? 'bg-red-950/60 text-red-400 border border-red-800/50'
                          : log.level === 'WARN'
                          ? 'bg-yellow-950/60 text-yellow-400 border border-yellow-800/50'
                          : 'bg-blue-950/60 text-blue-400 border border-blue-800/50'
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-200 truncate max-w-md">{log.message}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-blue-400 hover:underline font-sans text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500 font-sans">
                  No matching logs received.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-gray-200 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <span>Total: {filteredLogs.length} logs</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-900 border border-gray-800 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || filteredLogs.length === 0}
            className="px-3 py-1 rounded bg-gray-900 border border-gray-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 text-sm font-sans">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="font-semibold text-gray-100">Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2 font-mono text-xs text-gray-300">
              <p><strong>Timestamp:</strong> {selectedLog.timestamp}</p>
              <p><strong>Level:</strong> {selectedLog.level}</p>
              <p><strong>Message:</strong> {selectedLog.message}</p>
              <div className="mt-2">
                <strong className="font-sans text-gray-400">Payload / Metadata:</strong>
                <pre className="mt-1 bg-gray-950 p-3 rounded-lg border border-gray-800 text-emerald-400 overflow-x-auto">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-500 font-medium rounded-lg text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveLogs;