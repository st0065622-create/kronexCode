import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  FileCode, X, Copy, Check, Split, Sparkles, 
  Play, Code2, ChevronRight, Save, Eye 
} from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { soundManager } from '../../utils/sound';

export default function EditorArea() {
  const { 
    files, 
    openFileIds, 
    activeFileId, 
    setActiveFile, 
    closeFile, 
    updateFileContent, 
    settings,
    isSplitView,
    splitFileId,
    setSplitFileId,
    setActiveBottomTab
  } = useKronexStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const splitEditorRef = useRef<any>(null);

  const openFiles = files.filter(f => openFileIds.includes(f.id));
  const activeFile = files.find(f => f.id === activeFileId);
  const splitFile = files.find(f => f.id === splitFileId) || openFiles[0];

  const [copied, setCopied] = React.useState(false);

  // ResizeObserver to trigger monaco layout automatically
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
      if (splitEditorRef.current) {
        splitEditorRef.current.layout();
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    setTimeout(() => editor.layout(), 50);
  };

  const handleSplitEditorMount: OnMount = (editor) => {
    splitEditorRef.current = editor;
    setTimeout(() => editor.layout(), 50);
  };

  const handleCopyCode = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    soundManager.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeFile) {
    return (
      <div className="flex-1 bg-[#080d1a] flex flex-col items-center justify-center text-center p-8 text-zinc-500 font-sans space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
          <Code2 className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">No File Open</h3>
          <p className="text-xs text-zinc-400 max-w-sm mt-1">
            Select a file from the explorer on the left or press <kbd className="px-1.5 py-0.5 rounded bg-black border border-white/10 text-cyan-400 font-mono">Ctrl+P</kbd> to search files.
          </p>
        </div>
      </div>
    );
  }

  // Map file language to Monaco language mode
  const getMonacoLanguage = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'typescript': return 'typescript';
      case 'javascript': return 'javascript';
      case 'python': return 'python';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'sql': return 'sql';
      case 'json': return 'json';
      case 'markdown': return 'markdown';
      case 'rust': return 'rust';
      default: return 'plaintext';
    }
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#080d1a] relative overflow-hidden">
      
      {/* Tab Bar Header */}
      <div className="h-9 bg-[#060a14] border-b border-white/10 flex items-center justify-between px-2 overflow-x-auto shrink-0 select-none no-scrollbar">
        
        {/* Active Open Tabs */}
        <div className="flex items-center space-x-1 min-w-0">
          {openFiles.map(file => {
            const isActive = file.id === activeFileId;
            return (
              <div
                key={file.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveFile(file.id);
                }}
                className={`group px-3 py-1.5 rounded-t-xl border-t border-x text-xs font-mono flex items-center space-x-2 cursor-pointer transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#080d1a] border-cyan-400/40 text-[#00D4FF] font-bold shadow-[0_-2px_10px_rgba(0,212,255,0.15)]'
                    : 'bg-black/40 border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-[#00D4FF]' : 'text-zinc-500'}`} />
                <span className="truncate max-w-[120px]">{file.name}</span>

                {file.isUnsaved ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unsaved" />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(file.id);
                    }}
                    className="p-0.5 rounded hover:bg-white/10 text-zinc-500 hover:text-white opacity-60 group-hover:opacity-100 transition-opacity"
                    title="Close Tab"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls Right */}
        <div className="flex items-center space-x-2 shrink-0 pl-2">
          <button
            onClick={() => handleCopyCode(activeFile.content)}
            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-mono flex items-center space-x-1"
            title="Copy File Content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveBottomTab('preview');
            }}
            className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-bold flex items-center space-x-1 hover:bg-cyan-500/20 cursor-pointer"
            title="Live Preview"
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Body Grid (Single or Split Pane) */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* Pane 1 (Primary Active File) */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
          <Editor
            height="100%"
            language={getMonacoLanguage(activeFile.language)}
            value={activeFile.content}
            theme="vs-dark"
            onMount={handleEditorMount}
            onChange={(val) => updateFileContent(activeFile.id, val || '')}
            options={{
              fontSize: settings.fontSize,
              tabSize: settings.tabSize,
              wordWrap: settings.wordWrap,
              minimap: { enabled: settings.minimap },
              fontFamily: settings.fontFamily,
              lineNumbers: settings.lineNumbers,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              padding: { top: 12 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Pane 2 (Split View if Enabled) */}
        {isSplitView && splitFile && (
          <div className="flex-1 flex flex-col min-w-0 min-h-0 border-l border-white/10 relative">
            {/* Split Header */}
            <div className="h-7 bg-[#050812] border-b border-white/10 px-3 flex items-center justify-between text-xs font-mono text-zinc-400 shrink-0">
              <div className="flex items-center space-x-2">
                <Split className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white font-bold">{splitFile.name}</span>
              </div>
              <select
                value={splitFile.id}
                onChange={e => setSplitFileId(e.target.value)}
                className="bg-black border border-white/20 rounded px-1.5 py-0.5 text-[10px] text-cyan-300 font-mono outline-none"
              >
                {files.filter(f => !f.isFolder).map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <Editor
              height="100%"
              language={getMonacoLanguage(splitFile.language)}
              value={splitFile.content}
              theme="vs-dark"
              onMount={handleSplitEditorMount}
              onChange={(val) => updateFileContent(splitFile.id, val || '')}
              options={{
                fontSize: settings.fontSize,
                tabSize: settings.tabSize,
                wordWrap: settings.wordWrap,
                minimap: { enabled: false },
                fontFamily: settings.fontFamily,
                lineNumbers: settings.lineNumbers,
                automaticLayout: true,
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
