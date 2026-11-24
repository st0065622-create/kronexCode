import React from 'react';
import { History, X, Check, RotateCcw, GitBranch, Calendar, User } from 'lucide-react';
import { WorkflowVersion } from './workflowTypes';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: WorkflowVersion[];
  onRestoreVersion: (v: WorkflowVersion) => void;
}

export default function VersionHistoryModal({
  isOpen,
  onClose,
  versions,
  onRestoreVersion
}: VersionHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#0B1020] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00D4FF]/20 border border-[#00D4FF]/40 flex items-center justify-center">
              <History className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Workflow Version History</h3>
              <p className="text-xs text-[#94A3B8]">Immutable revision snapshots and rollback points</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {versions.length > 0 ? (
            versions.map((ver, idx) => (
              <div
                key={ver.id}
                className="p-4 rounded-2xl bg-[#131A2E]/70 border border-white/[0.08] flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 flex items-center justify-center shrink-0">
                    <GitBranch className="w-4 h-4 text-[#00D4FF]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-[#F8FAFC]">v{ver.versionNumber}.0 - {ver.label}</h4>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#94A3B8] font-mono">
                      {ver.timestamp} • {ver.nodesCount} nodes • {ver.edgesCount} edges
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRestoreVersion(ver);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#00D4FF]/20 border border-white/10 hover:border-[#00D4FF]/50 text-xs font-semibold text-[#F8FAFC] hover:text-[#00D4FF] transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              No previous version snapshots stored yet. Auto-save will record snapshots every 5 minutes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
