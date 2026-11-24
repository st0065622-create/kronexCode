import React, { useState } from 'react';
import { 
  Terminal, X, CheckCircle2, AlertCircle, Clock, Cpu, 
  DollarSign, RefreshCw, Trash2, ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';
import { ExecutionLog } from './workflowTypes';

interface DebugConsoleProps {
  logs: ExecutionLog[];
  onClearLogs: () => void;
  isOpen: boolean;
  onClose: () => void;
  totalTokens: number;
  totalCostEstimate: number;
  totalDurationMs: number;
}

export default function DebugConsole({
  logs,
  onClearLogs,
  isOpen,
  onClose,
  totalTokens,
  totalCostEstimate,
  totalDurationMs
}: DebugConsoleProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="h-64 sm:h-72 bg-[#080C18]/95 border-t border-white/[0.08] backdrop-blur-2xl flex flex-col z-30 shrink-0 shadow-2xl">
      {/* Console Top Toolbar */}
      <div className="px-4 py-2 border-b border-white/[0.08] bg-[#0B1020]/90 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-[#00D4FF] font-bold">
            <Terminal className="w-4 h-4" />
            <span>Execution Console</span>
          </div>

          <div className="h-3 w-[1px] bg-white/10" />

          {/* Realtime Metrics */}
          <div className="flex items-center space-x-4 text-[10px] font-mono text-[#94A3B8]">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Duration: <strong className="text-[#F8FAFC]">{totalDurationMs}ms</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-[#7C5CFF]" />
              <span>Tokens: <strong className="text-[#F8FAFC]">{totalTokens.toLocaleString()}</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Est. Cost: <strong className="text-emerald-400">${totalCostEstimate.toFixed(5)}</strong></span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onClearLogs}
            title="Clear Log Output"
            className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Stream List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-xs custom-scrollbar">
        {logs.length > 0 ? (
          logs.map((log) => {
            const isExpanded = expandedLogId === log.id;
            return (
              <div 
                key={log.id} 
                className="p-2 rounded-xl bg-[#131A2E]/50 border border-white/[0.05] hover:border-white/10 transition-all text-[11px]"
              >
                <div 
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-[10px] text-[#94A3B8]">{log.timestamp}</span>

                    {log.status === 'running' && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold animate-pulse">
                        RUNNING
                      </span>
                    )}
                    {log.status === 'success' && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                        SUCCESS
                      </span>
                    )}
                    {log.status === 'error' && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[9px] font-bold">
                        ERROR
                      </span>
                    )}
                    {log.status === 'info' && (
                      <span className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 text-[#00D4FF] text-[9px] font-bold">
                        INFO
                      </span>
                    )}

                    <span className="text-[#F8FAFC] font-semibold truncate">{log.nodeName}:</span>
                    <span className="text-[#94A3B8] truncate">{log.message}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {log.durationMs !== undefined && (
                      <span className="text-[10px] text-[#94A3B8]">{log.durationMs}ms</span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#94A3B8]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                    )}
                  </div>
                </div>

                {/* Expanded Payload Output */}
                {isExpanded && log.output && (
                  <div className="mt-2 p-2.5 rounded-lg bg-[#080C18] border border-white/[0.08] relative group">
                    <button
                      onClick={() => handleCopy(JSON.stringify(log.output, null, 2), log.id)}
                      className="absolute top-2 right-2 p-1 rounded bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
                    >
                      {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <pre className="text-[10px] text-emerald-300 overflow-x-auto whitespace-pre-wrap max-h-36">
                      {typeof log.output === 'string' ? log.output : JSON.stringify(log.output, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-xs text-[#94A3B8] space-y-1">
            <p>Console is ready. Click "Execute Workflow" to view execution traces.</p>
          </div>
        )}
      </div>
    </div>
  );
}
