import React, { useState } from 'react';
import { Search, Replace, FileText, ArrowRight, Check } from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { soundManager } from '../../utils/sound';

export default function SidebarSearch() {
  const { files, openFile, updateFileContent } = useKronexStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showReplace, setShowReplace] = useState(false);

  // Filter files matching search term
  const results = files.filter(f => !f.isFolder && f.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleReplaceAll = () => {
    if (!searchTerm) return;
    soundManager.playSuccess();
    results.forEach(file => {
      const newContent = file.content.replaceAll(searchTerm, replaceTerm);
      updateFileContent(file.id, newContent);
    });
  };

  return (
    <div className="p-3 space-y-4 text-xs font-sans text-white select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-mono text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
          Search Workspace
        </span>
        <button
          onClick={() => setShowReplace(!showReplace)}
          className={`p-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
            showReplace ? 'bg-cyan-500/20 text-[#00D4FF]' : 'text-zinc-400 hover:text-white'
          }`}
          title="Toggle Replace"
        >
          Replace Mode
        </button>
      </div>

      {/* Search Input Box */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search in files..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        {showReplace && (
          <div className="space-y-2">
            <div className="relative">
              <Replace className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceTerm}
                onChange={e => setReplaceTerm(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <button
              onClick={handleReplaceAll}
              disabled={!searchTerm}
              className="w-full py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold cursor-pointer disabled:opacity-40"
            >
              Replace All Matches
            </button>
          </div>
        )}
      </div>

      {/* Results Listing */}
      {searchTerm && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-zinc-400 block">
            Found {results.length} file(s) matching "{searchTerm}"
          </span>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {results.map(f => {
              // Extract snippet matching line
              const lines = f.content.split('\n');
              const matchLine = lines.find(l => l.toLowerCase().includes(searchTerm.toLowerCase())) || '';

              return (
                <div
                  key={f.id}
                  onClick={() => {
                    soundManager.playClick();
                    openFile(f.id);
                  }}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-400/30 cursor-pointer space-y-1 transition-all"
                >
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold font-mono">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{f.path}</span>
                  </div>
                  <p className="font-mono text-[11px] text-zinc-400 truncate bg-black/40 p-1 rounded">
                    {matchLine}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
