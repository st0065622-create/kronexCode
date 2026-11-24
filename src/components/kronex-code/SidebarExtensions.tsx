import React from 'react';
import { Boxes, Check, Star, Download } from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { soundManager } from '../../utils/sound';

export default function SidebarExtensions() {
  const { extensions, toggleExtensionInstall } = useKronexStore();

  return (
    <div className="p-3 space-y-4 text-xs font-sans text-white select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-mono text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
          Extensions Marketplace
        </span>
      </div>

      <div className="space-y-3">
        {extensions.map(ext => (
          <div 
            key={ext.id}
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="text-xl p-1 bg-white/5 rounded-lg shrink-0">{ext.icon}</span>
                <div className="min-w-0">
                  <h4 className="font-bold text-white truncate text-xs">{ext.name}</h4>
                  <p className="text-[10px] text-zinc-400">{ext.publisher} • v{ext.version}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  toggleExtensionInstall(ext.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer shrink-0 ${
                  ext.installed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold'
                }`}
              >
                {ext.installed ? 'Installed' : 'Install'}
              </button>
            </div>

            <p className="text-[11px] text-zinc-300 leading-tight">
              {ext.description}
            </p>

            <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/5">
              <span className="flex items-center space-x-1">
                <Download className="w-3 h-3 text-cyan-400" />
                <span>{ext.downloads}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{ext.rating}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
