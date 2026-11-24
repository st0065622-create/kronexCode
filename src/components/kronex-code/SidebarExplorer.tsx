import React, { useState } from 'react';
import { 
  Folder, FolderOpen, File, FilePlus, FolderPlus, 
  Trash2, Edit3, ChevronRight, ChevronDown, Sparkles, Plus, MoreVertical 
} from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { FileItem } from './types';
import { soundManager } from '../../utils/sound';

export default function SidebarExplorer() {
  const { 
    files, 
    openFile, 
    createFile, 
    deleteFile, 
    renameFile, 
    toggleFolder, 
    activeFileId 
  } = useKronexStore();

  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState<boolean | null>(null); // true = file, false = folder
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renamingName, setRenamingName] = useState('');

  const rootItems = files.filter(f => f.parentId === null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    soundManager.playSuccess();
    createFile(newFileName.trim(), isCreatingFile === false, targetFolderId);
    setNewFileName('');
    setIsCreatingFile(null);
  };

  const handleRenameSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!renamingName.trim()) return;
    soundManager.playSuccess();
    renameFile(id, renamingName.trim());
    setRenamingFileId(null);
  };

  const renderItem = (item: FileItem, depth: number = 0) => {
    const isSelected = activeFileId === item.id;
    const children = files.filter(f => f.parentId === item.id);

    if (item.isFolder) {
      return (
        <div key={item.id} className="space-y-0.5">
          <div 
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            className="group flex items-center justify-between py-1 px-2 rounded-lg text-xs font-sans text-zinc-300 hover:bg-white/5 cursor-pointer transition-colors"
            onClick={() => {
              soundManager.playClick();
              toggleFolder(item.id);
            }}
          >
            <div className="flex items-center space-x-1.5 min-w-0">
              {item.isOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              )}
              {item.isOpen ? (
                <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-amber-400/80 shrink-0" />
              )}
              <span className="font-bold text-white truncate">{item.name}</span>
            </div>

            <div className="hidden group-hover:flex items-center space-x-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTargetFolderId(item.id);
                  setIsCreatingFile(true);
                }}
                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                title="New File in Folder"
              >
                <FilePlus className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete folder '${item.name}' and its contents?`)) {
                    deleteFile(item.id);
                  }
                }}
                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-rose-400"
                title="Delete Folder"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Render children if folder is open */}
          {item.isOpen && (
            <div className="space-y-0.5">
              {children.map(child => renderItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Render File
    return (
      <div 
        key={item.id}
        style={{ paddingLeft: `${depth * 12 + 20}px` }}
        onClick={() => {
          soundManager.playClick();
          openFile(item.id);
        }}
        className={`group flex items-center justify-between py-1 px-2 rounded-lg text-xs font-sans cursor-pointer transition-all ${
          isSelected 
            ? 'bg-cyan-500/15 text-[#00D4FF] border border-cyan-500/30 font-bold shadow-sm' 
            : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <File className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#00D4FF]' : 'text-zinc-500'}`} />
          
          {renamingFileId === item.id ? (
            <form onSubmit={(e) => handleRenameSubmit(e, item.id)} onClick={e => e.stopPropagation()}>
              <input
                type="text"
                value={renamingName}
                onChange={e => setRenamingName(e.target.value)}
                autoFocus
                onBlur={() => setRenamingFileId(null)}
                className="bg-black border border-cyan-400 text-white text-xs px-1.5 py-0.5 rounded outline-none w-28"
              />
            </form>
          ) : (
            <span className="truncate">{item.name}</span>
          )}

          {item.isUnsaved && (
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unsaved" />
          )}
        </div>

        <div className="hidden group-hover:flex items-center space-x-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRenamingFileId(item.id);
              setRenamingName(item.name);
            }}
            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
            title="Rename File"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteFile(item.id);
            }}
            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-rose-400"
            title="Delete File"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 space-y-3 font-sans text-white text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-mono text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
          Explorer: Workspace
        </span>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setTargetFolderId(null);
              setIsCreatingFile(true);
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={() => {
              setTargetFolderId(null);
              setIsCreatingFile(false);
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* New File / Folder Form Input */}
      {isCreatingFile !== null && (
        <form onSubmit={handleCreateSubmit} className="p-2 rounded-xl bg-white/5 border border-cyan-400/50 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400">
            <span>{isCreatingFile ? 'Create New File' : 'Create New Folder'}</span>
            <button 
              type="button" 
              onClick={() => setIsCreatingFile(null)} 
              className="text-zinc-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder={isCreatingFile ? 'e.g. index.ts' : 'e.g. components'}
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            autoFocus
            className="w-full bg-black/60 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-cyan-400 font-mono"
          />

          <button
            type="submit"
            className="w-full py-1 rounded-lg bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-[11px] cursor-pointer"
          >
            Confirm
          </button>
        </form>
      )}

      {/* File Tree List */}
      <div className="space-y-1">
        {rootItems.map(item => renderItem(item, 0))}
      </div>
    </div>
  );
}
