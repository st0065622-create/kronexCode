import React, { useState } from 'react';
import { GitBranch, GitCommit, GitPullRequest, Check, Plus, RefreshCw, UploadCloud } from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { soundManager } from '../../utils/sound';

export default function SidebarGit() {
  const { 
    files, 
    gitBranch, 
    setGitBranch, 
    commits, 
    commitChanges 
  } = useKronexStore();

  const [commitMsg, setCommitMsg] = useState('');
  const [isPushing, setIsPushing] = useState(false);

  const unsavedFiles = files.filter(f => !f.isFolder && f.isUnsaved);

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMsg.trim()) return;
    soundManager.playSuccess();
    commitChanges(commitMsg.trim());
    setCommitMsg('');
  };

  const handlePush = () => {
    setIsPushing(true);
    soundManager.playSuccess();
    setTimeout(() => {
      setIsPushing(false);
      alert(`Pushed latest commit to origin/${gitBranch} successfully!`);
    }, 1200);
  };

  return (
    <div className="p-3 space-y-4 text-xs font-sans text-white select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-mono text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
          Source Control
        </span>

        <select
          value={gitBranch}
          onChange={e => setGitBranch(e.target.value)}
          className="bg-black border border-white/20 rounded-lg px-2 py-0.5 text-xs text-cyan-400 font-mono outline-none cursor-pointer"
        >
          <option value="main">branch: main</option>
          <option value="develop">branch: develop</option>
          <option value="feature/v2.5">branch: feature/v2.5</option>
        </select>
      </div>

      {/* Commit Input Box */}
      <form onSubmit={handleCommit} className="space-y-2">
        <textarea
          placeholder="Commit message (e.g., feat: add neural router)"
          value={commitMsg}
          onChange={e => setCommitMsg(e.target.value)}
          className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400 font-mono resize-none h-20"
        />

        <div className="flex items-center space-x-2">
          <button
            type="submit"
            disabled={!commitMsg.trim()}
            className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-40"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Commit to {gitBranch}</span>
          </button>

          <button
            type="button"
            onClick={handlePush}
            disabled={isPushing}
            className="p-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold cursor-pointer"
            title="Push to Remote"
          >
            <UploadCloud className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </form>

      {/* Changes list */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold">
          Changes ({unsavedFiles.length})
        </span>

        {unsavedFiles.length === 0 ? (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center text-zinc-500 text-[11px] font-mono">
            Working directory clean ✨
          </div>
        ) : (
          <div className="space-y-1">
            {unsavedFiles.map(f => (
              <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 font-mono text-[11px]">
                <span className="text-amber-300 truncate">{f.path}</span>
                <span className="text-amber-400 font-bold">M</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Commit History Log */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold">
          Commit History
        </span>

        <div className="space-y-2">
          {commits.map(c => (
            <div key={c.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span className="truncate">{c.message}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[10px]">
                <span>{c.id}</span>
                <span>{c.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
