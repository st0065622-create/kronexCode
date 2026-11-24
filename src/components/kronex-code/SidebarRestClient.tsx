import React, { useState } from 'react';
import { Send, Play, Clock, FileCode, CheckCircle, AlertCircle } from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { soundManager } from '../../utils/sound';

export default function SidebarRestClient() {
  const { restRequests, activeRestRequestId, setActiveRestRequestId, updateRestRequest } = useKronexStore();

  const req = restRequests.find(r => r.id === activeRestRequestId) || restRequests[0];

  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!req.url) return;
    setIsLoading(true);
    soundManager.playClick();

    const startTime = performance.now();
    try {
      const headersObj: Record<string, string> = {};
      req.headers.forEach(h => {
        if (h.key && h.value) headersObj[h.key] = h.value;
      });

      const options: RequestInit = {
        method: req.method,
        headers: headersObj,
      };

      if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
        options.body = req.body;
      }

      const res = await fetch(req.url, options);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      let data: any;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      updateRestRequest({
        ...req,
        response: {
          status: res.status,
          statusText: res.statusText || (res.ok ? 'OK' : 'Error'),
          time: latency,
          size: `${JSON.stringify(data).length} B`,
          data
        }
      });
      soundManager.playSuccess();
    } catch (err: any) {
      const endTime = performance.now();
      updateRestRequest({
        ...req,
        response: {
          status: 0,
          statusText: 'Network / CORS Error',
          time: Math.round(endTime - startTime),
          size: '0 B',
          data: { error: err.message || 'Failed to fetch resource' }
        }
      });
      soundManager.playError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-3 space-y-4 text-xs font-sans text-white select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-mono text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
          REST API Client (Postman)
        </span>
      </div>

      {/* Select request */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-white/5">
        {restRequests.map(r => (
          <button
            key={r.id}
            onClick={() => setActiveRestRequestId(r.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0 transition-all cursor-pointer ${
              activeRestRequestId === r.id ? 'bg-cyan-500/20 text-[#00D4FF] border border-cyan-400/40' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className={r.method === 'GET' ? 'text-emerald-400 mr-1' : 'text-amber-400 mr-1'}>{r.method}</span>
            {r.name}
          </button>
        ))}
      </div>

      {/* Method & URL input */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <select
            value={req.method}
            onChange={e => updateRestRequest({ ...req, method: e.target.value as any })}
            className="bg-black border border-white/20 rounded-xl px-2 py-1.5 text-xs text-amber-400 font-mono font-bold outline-none cursor-pointer"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            value={req.url}
            onChange={e => updateRestRequest({ ...req, url: e.target.value })}
            placeholder="https://api.example.com/v1"
            className="flex-1 bg-black/60 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-cyan-400"
          />

          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-xs flex items-center space-x-1 cursor-pointer shrink-0 disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? '...' : 'Send'}</span>
          </button>
        </div>

        {/* Body editor if POST/PUT */}
        {['POST', 'PUT'].includes(req.method) && (
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 block">JSON Body:</span>
            <textarea
              value={req.body}
              onChange={e => updateRestRequest({ ...req, body: e.target.value })}
              className="w-full bg-black/60 border border-white/15 rounded-xl p-2 text-xs text-cyan-300 font-mono outline-none resize-none h-24"
            />
          </div>
        )}
      </div>

      {/* Response Panel */}
      {req.response && (
        <div className="space-y-2 pt-2 border-t border-white/10 font-mono text-[11px]">
          <div className="flex items-center justify-between">
            <span className={`font-bold flex items-center space-x-1 ${
              req.response.status >= 200 && req.response.status < 300 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {req.response.status >= 200 && req.response.status < 300 ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span>STATUS: {req.response.status} {req.response.statusText}</span>
            </span>

            <div className="flex space-x-2 text-zinc-500 text-[10px]">
              <span className="flex items-center space-x-0.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{req.response.time}ms</span>
              </span>
              <span>{req.response.size}</span>
            </div>
          </div>

          <div className="bg-black/80 border border-white/10 rounded-xl p-3 max-h-52 overflow-y-auto text-zinc-300 font-mono text-[10.5px]">
            <pre className="whitespace-pre-wrap">{JSON.stringify(req.response.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
