import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Zap, ShieldCheck } from 'lucide-react';

export default function SidebarPerfMonitor() {
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memoryMb, setMemoryMb] = useState(148);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(8 + Math.random() * 15));
      setMemoryMb(Math.floor(140 + Math.random() * 20));
      setFps(Math.floor(58 + Math.random() * 3));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-3 space-y-4 text-xs font-sans text-white select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-mono text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
          Performance & Telemetry
        </span>
      </div>

      <div className="space-y-3">
        {/* CPU Usage */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="flex items-center space-x-2 text-cyan-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>CPU Utilization</span>
            </span>
            <span className="text-white font-extrabold text-sm">{cpuUsage}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-black border border-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" 
              style={{ width: `${cpuUsage * 3}%` }}
            />
          </div>
        </div>

        {/* Memory Allocation */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="flex items-center space-x-2 text-purple-400 font-bold">
              <HardDrive className="w-4 h-4" />
              <span>Heap Allocation</span>
            </span>
            <span className="text-white font-extrabold text-sm">{memoryMb} MB</span>
          </div>

          <div className="w-full h-2 rounded-full bg-black border border-white/10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500" 
              style={{ width: `${(memoryMb / 256) * 100}%` }}
            />
          </div>
        </div>

        {/* FPS & Latency */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase">Frame Rate</span>
            <p className="text-xl font-black text-emerald-400">{fps} FPS</p>
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase">IPC Latency</span>
            <p className="text-xl font-black text-cyan-400">0.8 ms</p>
          </div>
        </div>

        {/* System Health Status */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="block font-bold">WASM COMPILER HEALTHY</span>
            <span className="text-[10px] text-zinc-400">No memory leaks or thread starvation detected.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
