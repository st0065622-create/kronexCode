import { create } from 'zustand';
import { 
  FileItem, 
  ActivityTab, 
  BottomTab, 
  EditorSettings, 
  ExtensionItem, 
  RestRequest, 
  DbTable 
} from './types';

const INITIAL_FILES: FileItem[] = [
  // Folders
  { id: 'f-src', name: 'src', path: 'src', content: '', language: '', isFolder: true, parentId: null, isOpen: true },
  { id: 'f-api', name: 'api', path: 'api', content: '', language: '', isFolder: true, parentId: null, isOpen: true },
  { id: 'f-db', name: 'database', path: 'database', content: '', language: '', isFolder: true, parentId: null, isOpen: true },
  
  // Files in src
  {
    id: 'file-app-tsx',
    name: 'App.tsx',
    path: 'src/App.tsx',
    language: 'typescript',
    isFolder: false,
    parentId: 'f-src',
    content: `import React, { useState } from 'react';
import { Sparkles, Cpu, Terminal, Zap } from 'lucide-react';

export default function KronexApp() {
  const [pulseCount, setPulseCount] = useState<number>(42);
  const [activeModel, setActiveModel] = useState<string>('KRONEX-v2.5-Omni');

  const triggerNeuralPulse = () => {
    setPulseCount(prev => prev + 1);
    console.log(\`[KRONEX TELEMETRY] Neural Pulse triggered. Total: \${pulseCount + 1}\`);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-white p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">KRONEX QUANTUM NODE</h1>
              <p className="text-xs text-zinc-400">Model: {activeModel}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-bold">
            ONLINE
          </span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Welcome to <span className="text-cyan-400 font-bold">Kronex Code</span> — the next-generation browser IDE powered by Monaco & WebAssembly.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-xs font-mono text-zinc-400 uppercase">Pulse Count</span>
            <p className="text-2xl font-mono font-bold text-cyan-400">{pulseCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-xs font-mono text-zinc-400 uppercase">Latency</span>
            <p className="text-2xl font-mono font-bold text-emerald-400">1.2ms</p>
          </div>
        </div>

        <button
          onClick={triggerNeuralPulse}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all cursor-pointer flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Trigger Neural Pulse ({pulseCount})</span>
        </button>
      </div>
    </div>
  );
}`
  },
  {
    id: 'file-index-js',
    name: 'index.js',
    path: 'src/index.js',
    language: 'javascript',
    isFolder: false,
    parentId: 'f-src',
    content: `// Kronex Code Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import KronexApp from './App';
import './styles.css';

console.log("⚡ [KRONEX ENGINE] Mounting React Application...");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <KronexApp />
  </React.StrictMode>
);`
  },
  {
    id: 'file-styles-css',
    name: 'styles.css',
    path: 'src/styles.css',
    language: 'css',
    isFolder: false,
    parentId: 'f-src',
    content: `@import "tailwindcss";

@layer base {
  body {
    background-color: #080d1a;
    color: #f8fafc;
    font-family: 'Inter', system-ui, sans-serif;
  }
}

.kronex-glow {
  box-shadow: 0 0 25px rgba(0, 212, 255, 0.25);
}`
  },

  // Files in api
  {
    id: 'file-server-py',
    name: 'server.py',
    path: 'api/server.py',
    language: 'python',
    isFolder: false,
    parentId: 'f-api',
    content: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time

app = FastAPI(title="Kronex Cognitive API", version="2.5.0")

class TelemetryPayload(BaseModel):
    node_id: str
    pulse_rate: float
    status: str

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "engine": "Kronex Cognitive Core v2.5",
        "latency_ms": 0.85
    }

@app.post("/api/v1/telemetry")
def receive_telemetry(payload: TelemetryPayload):
    if not payload.node_id:
        raise HTTPException(status_code=400, detail="Node ID required")
    
    return {
        "success": True,
        "processed_node": payload.node_id,
        "status": "synchronized"
    }

print("🚀 FastAPI Kronex Gateway running on port 8000")`
  },

  // Files in database
  {
    id: 'file-schema-sql',
    name: 'schema.sql',
    path: 'database/schema.sql',
    language: 'sql',
    isFolder: false,
    parentId: 'f-db',
    content: `-- KRONEX DATABASE SCHEMA (PostgreSQL / SQLite)

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'architect',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS telemetry_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    pulse_rate NUMERIC(8,2) NOT NULL,
    status_code VARCHAR(20) DEFAULT '200_OK',
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, role) 
VALUES ('shashvat', 'shashvat@kronex.ai', 'Sovereign Architect')
ON CONFLICT DO NOTHING;`
  },

  // Root files
  {
    id: 'file-readme-md',
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    isFolder: false,
    parentId: null,
    content: `# Kronex Code ⚡

> **A Futuristic Browser-Based IDE** engineered with React, Monaco Editor, Zustand, and WebAssembly execution.

## Features

- 📁 **Nested File Explorer**: Create, rename, delete, drag & drop files.
- ⚡ **Monaco Editor Engine**: Full syntax highlighting, auto-completion, and minimap.
- 🛠️ **Built-in Tools**:
  - 🌐 **REST API Client**: Postman-style API tester with real live requests.
  - 🗄️ **Database Explorer**: Mock SQL table browser & query runner.
  - 📊 **Performance Monitor**: Real-time CPU/Memory gauge & telemetry graphs.
  - 🧩 **Extensions Marketplace**: Install & configure IDE plugins.
  - 🌿 **Git Integration**: Track staged/unstaged changes, view diffs, & commit.
  - 🤖 **AI Copilot**: Code explain, bug fix, refactor, and terminal assistant.
  - 📺 **Live Sandbox Preview**: Instant HTML/JS/CSS live preview rendering.

## Quick Start Hotkeys

- \`Ctrl + S\` : Save current file
- \`Ctrl + P\` or \`Ctrl + Shift + P\` : Open Command Palette
- \`Ctrl + \` \` : Toggle Terminal panel
- \`Ctrl + B\` : Toggle Sidebar

Enjoy building with **Kronex Code**!`
  },
  {
    id: 'file-package-json',
    name: 'package.json',
    path: 'package.json',
    language: 'json',
    isFolder: false,
    parentId: null,
    content: `{
  "name": "kronex-code-workspace",
  "version": "2.5.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.546.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "vite": "^6.2.0"
  }
}`
  }
];

const INITIAL_EXTENSIONS: ExtensionItem[] = [
  { id: 'ext-prettier', name: 'Prettier Code Formatter', publisher: 'Esben Petersen', description: 'Code formatter using opinionated rules', version: '10.4.0', downloads: '45.2M', rating: 4.9, installed: true, icon: '✨' },
  { id: 'ext-eslint', name: 'ESLint', publisher: 'Microsoft', description: 'Integrates ESLint JavaScript into VS Code', version: '2.4.2', downloads: '31.1M', rating: 4.8, installed: true, icon: '🛡️' },
  { id: 'ext-tailwind', name: 'Tailwind CSS IntelliSense', publisher: 'Tailwind Labs', description: 'Intelligent Tailwind CSS tooling', version: '0.12.1', downloads: '18.9M', rating: 4.9, installed: true, icon: '🎨' },
  { id: 'ext-gitlens', name: 'GitLens — Git supercharged', publisher: 'GitKraken', description: 'Supercharge Git capabilities inside editor', version: '15.0.1', downloads: '28.4M', rating: 4.9, installed: true, icon: '🌿' },
  { id: 'ext-errorlens', name: 'Error Lens', publisher: 'Alexander', description: 'Enhance error highlighting in code lines', version: '3.16.0', downloads: '8.2M', rating: 4.9, installed: true, icon: '🔍' },
  { id: 'ext-python', name: 'Python IntelliSense', publisher: 'Microsoft', description: 'Rich Python support & debugging', version: '2025.1.0', downloads: '120M', rating: 4.7, installed: false, icon: '🐍' },
];

const INITIAL_REST_REQUESTS: RestRequest[] = [
  {
    id: 'req-1',
    name: 'Get System Health',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    body: ''
  },
  {
    id: 'req-2',
    name: 'Post Telemetry Pulse',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    body: JSON.stringify({ title: 'Kronex Pulse', body: 'Neural link active', userId: 1 }, null, 2)
  }
];

const INITIAL_DB_TABLES: DbTable[] = [
  {
    name: 'users',
    rowCount: 3,
    columns: [
      { name: 'id', type: 'UUID', pk: true },
      { name: 'username', type: 'VARCHAR(100)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'role', type: 'VARCHAR(50)' }
    ],
    rows: [
      { id: 'usr_101', username: 'shashvat', email: 'shashvat@kronex.ai', role: 'Sovereign Architect' },
      { id: 'usr_102', username: 'quantum_dev', email: 'dev@quantum.io', role: 'Engineer' },
      { id: 'usr_103', username: 'ai_bot', email: 'bot@kronex.ai', role: 'Agent' }
    ]
  },
  {
    name: 'telemetry_logs',
    rowCount: 2,
    columns: [
      { name: 'id', type: 'INTEGER', pk: true },
      { name: 'pulse_rate', type: 'NUMERIC' },
      { name: 'status_code', type: 'VARCHAR' },
      { name: 'logged_at', type: 'TIMESTAMP' }
    ],
    rows: [
      { id: 1, pulse_rate: 98.4, status_code: '200_OK', logged_at: '2026-07-23 21:00:00' },
      { id: 2, pulse_rate: 99.1, status_code: '200_OK', logged_at: '2026-07-23 21:30:00' }
    ]
  }
];

// Helper to load persistent state from localStorage
const loadSavedFiles = (): FileItem[] => {
  try {
    const saved = localStorage.getItem('kronex_code_files_v1');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_FILES;
};

interface KronexStore {
  // Files State
  files: FileItem[];
  openFileIds: string[];
  activeFileId: string | null;
  splitFileId: string | null;
  isSplitView: boolean;

  // Navigation / Panels
  activeActivityTab: ActivityTab | null;
  isSidebarOpen: boolean;
  sidebarWidth: number;
  activeBottomTab: BottomTab;
  isBottomPanelOpen: boolean;
  bottomPanelHeight: number;
  isZenMode: boolean;
  isFullscreen: boolean;

  // Settings
  settings: EditorSettings;

  // Search
  searchQuery: string;

  // Command Palette
  isCommandPaletteOpen: boolean;

  // Extensions
  extensions: ExtensionItem[];

  // REST Client
  restRequests: RestRequest[];
  activeRestRequestId: string;

  // DB Explorer
  dbTables: DbTable[];
  activeDbTableName: string;

  // Git state
  gitBranch: string;
  stagedFiles: string[];
  commits: { id: string; message: string; timestamp: string }[];

  // Actions
  setFiles: (files: FileItem[]) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  setActiveFile: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  createFile: (name: string, isFolder: boolean, parentId: string | null) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  saveActiveFile: () => void;
  toggleFolder: (id: string) => void;

  // View actions
  setActiveActivityTab: (tab: ActivityTab | null) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setActiveBottomTab: (tab: BottomTab) => void;
  toggleBottomPanel: () => void;
  setBottomPanelHeight: (height: number) => void;
  toggleZenMode: () => void;
  toggleFullscreen: () => void;
  toggleSplitView: () => void;
  setSplitFileId: (id: string | null) => void;

  // Settings actions
  updateSettings: (newSettings: Partial<EditorSettings>) => void;

  // Command Palette
  setCommandPaletteOpen: (isOpen: boolean) => void;

  // Extensions
  toggleExtensionInstall: (id: string) => void;

  // REST actions
  updateRestRequest: (req: RestRequest) => void;
  setActiveRestRequestId: (id: string) => void;

  // Git actions
  commitChanges: (message: string) => void;
  setGitBranch: (branch: string) => void;

  // Reset Project
  resetToDefaults: () => void;
}

export const useKronexStore = create<KronexStore>((set, get) => ({
  files: loadSavedFiles(),
  openFileIds: ['file-app-tsx', 'file-server-py', 'file-readme-md'],
  activeFileId: 'file-app-tsx',
  splitFileId: 'file-readme-md',
  isSplitView: false,

  activeActivityTab: 'explorer',
  isSidebarOpen: true,
  sidebarWidth: 260,
  activeBottomTab: 'terminal',
  isBottomPanelOpen: true,
  bottomPanelHeight: 220,
  isZenMode: false,
  isFullscreen: false,

  settings: {
    theme: 'kronex-dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    minimap: true,
    autoSave: true,
    formatOnSave: true,
    lineNumbers: 'on',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },

  searchQuery: '',
  isCommandPaletteOpen: false,

  extensions: INITIAL_EXTENSIONS,

  restRequests: INITIAL_REST_REQUESTS,
  activeRestRequestId: 'req-1',

  dbTables: INITIAL_DB_TABLES,
  activeDbTableName: 'users',

  gitBranch: 'main',
  stagedFiles: ['src/App.tsx'],
  commits: [
    { id: 'c-101', message: 'feat: initialize Kronex Code core engine', timestamp: '10 mins ago' },
    { id: 'c-100', message: 'chore: initial project layout', timestamp: '1 hour ago' }
  ],

  setFiles: (files) => {
    localStorage.setItem('kronex_code_files_v1', JSON.stringify(files));
    set({ files });
  },

  openFile: (id) => {
    const { openFileIds } = get();
    if (!openFileIds.includes(id)) {
      set({ openFileIds: [...openFileIds, id], activeFileId: id });
    } else {
      set({ activeFileId: id });
    }
  },

  closeFile: (id) => {
    const { openFileIds, activeFileId } = get();
    const nextOpen = openFileIds.filter(fId => fId !== id);
    let nextActive = activeFileId;
    if (activeFileId === id) {
      nextActive = nextOpen.length > 0 ? nextOpen[nextOpen.length - 1] : null;
    }
    set({ openFileIds: nextOpen, activeFileId: nextActive });
  },

  setActiveFile: (id) => set({ activeFileId: id }),

  updateFileContent: (id, content) => {
    const files = get().files.map(f => {
      if (f.id === id) {
        return { ...f, content, isUnsaved: true };
      }
      return f;
    });
    localStorage.setItem('kronex_code_files_v1', JSON.stringify(files));
    set({ files });
  },

  saveActiveFile: () => {
    const { activeFileId, files } = get();
    if (!activeFileId) return;
    const nextFiles = files.map(f => f.id === activeFileId ? { ...f, isUnsaved: false } : f);
    localStorage.setItem('kronex_code_files_v1', JSON.stringify(nextFiles));
    set({ files: nextFiles });
  },

  createFile: (name, isFolder, parentId) => {
    const { files } = get();
    const parent = files.find(f => f.id === parentId);
    const parentPath = parent ? parent.path : '';
    const newPath = parentPath ? `${parentPath}/${name}` : name;

    let language = 'plaintext';
    if (!isFolder) {
      if (name.endsWith('.ts') || name.endsWith('.tsx')) language = 'typescript';
      else if (name.endsWith('.js') || name.endsWith('.jsx')) language = 'javascript';
      else if (name.endsWith('.py')) language = 'python';
      else if (name.endsWith('.sql')) language = 'sql';
      else if (name.endsWith('.html')) language = 'html';
      else if (name.endsWith('.css')) language = 'css';
      else if (name.endsWith('.json')) language = 'json';
      else if (name.endsWith('.md')) language = 'markdown';
      else if (name.endsWith('.rs')) language = 'rust';
    }

    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name,
      path: newPath,
      content: isFolder ? '' : `// New file: ${name}\n`,
      language,
      isFolder,
      parentId,
      isOpen: isFolder ? true : undefined
    };

    const nextFiles = [...files, newFile];
    localStorage.setItem('kronex_code_files_v1', JSON.stringify(nextFiles));
    
    if (!isFolder) {
      set({ 
        files: nextFiles, 
        openFileIds: [...get().openFileIds, newFile.id], 
        activeFileId: newFile.id 
      });
    } else {
      set({ files: nextFiles });
    }
  },

  deleteFile: (id) => {
    const { files, openFileIds, activeFileId } = get();
    const nextFiles = files.filter(f => f.id !== id && f.parentId !== id);
    const nextOpen = openFileIds.filter(fId => fId !== id);
    let nextActive = activeFileId;
    if (activeFileId === id) {
      nextActive = nextOpen.length > 0 ? nextOpen[0] : null;
    }
    localStorage.setItem('kronex_code_files_v1', JSON.stringify(nextFiles));
    set({ files: nextFiles, openFileIds: nextOpen, activeFileId: nextActive });
  },

  renameFile: (id, newName) => {
    const files = get().files.map(f => {
      if (f.id === id) {
        return { ...f, name: newName };
      }
      return f;
    });
    localStorage.setItem('kronex_code_files_v1', JSON.stringify(files));
    set({ files });
  },

  toggleFolder: (id) => {
    const files = get().files.map(f => {
      if (f.id === id) {
        return { ...f, isOpen: !f.isOpen };
      }
      return f;
    });
    set({ files });
  },

  setActiveActivityTab: (tab) => {
    if (tab === null) {
      set({ isSidebarOpen: false, activeActivityTab: null });
    } else if (get().activeActivityTab === tab && get().isSidebarOpen) {
      set({ isSidebarOpen: false });
    } else {
      set({ isSidebarOpen: true, activeActivityTab: tab });
    }
  },

  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarWidth: (width) => set({ sidebarWidth: Math.max(160, Math.min(600, width)) }),

  setActiveBottomTab: (tab) => set({ activeBottomTab: tab, isBottomPanelOpen: true }),

  toggleBottomPanel: () => set(state => ({ isBottomPanelOpen: !state.isBottomPanelOpen })),

  setBottomPanelHeight: (height) => set({ bottomPanelHeight: Math.max(100, Math.min(600, height)) }),

  toggleZenMode: () => set(state => ({ isZenMode: !state.isZenMode })),

  toggleFullscreen: () => {
    const nextVal = !get().isFullscreen;
    if (nextVal) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
    set({ isFullscreen: nextVal });
  },

  toggleSplitView: () => set(state => ({ isSplitView: !state.isSplitView })),

  setSplitFileId: (id) => set({ splitFileId: id }),

  updateSettings: (newSettings) => set(state => ({ settings: { ...state.settings, ...newSettings } })),

  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),

  toggleExtensionInstall: (id) => set(state => ({
    extensions: state.extensions.map(ext => ext.id === id ? { ...ext, installed: !ext.installed } : ext)
  })),

  updateRestRequest: (req) => set(state => ({
    restRequests: state.restRequests.map(r => r.id === req.id ? req : r)
  })),

  setActiveRestRequestId: (id) => set({ activeRestRequestId: id }),

  commitChanges: (message) => set(state => ({
    commits: [
      { id: `c-${Date.now()}`, message, timestamp: 'Just now' },
      ...state.commits
    ],
    stagedFiles: []
  })),

  setGitBranch: (branch) => set({ gitBranch: branch }),

  resetToDefaults: () => {
    localStorage.removeItem('kronex_code_files_v1');
    set({
      files: INITIAL_FILES,
      openFileIds: ['file-app-tsx', 'file-server-py', 'file-readme-md'],
      activeFileId: 'file-app-tsx',
      splitFileId: 'file-readme-md',
      isSplitView: false,
      activeActivityTab: 'explorer',
      isSidebarOpen: true,
      isBottomPanelOpen: true,
      isZenMode: false
    });
  }
}));
