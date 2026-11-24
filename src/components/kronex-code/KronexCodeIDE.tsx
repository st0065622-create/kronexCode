import React, { useEffect, useState, useRef } from 'react';
import TitleBar from './TitleBar';
import ActivityBar from './ActivityBar';
import SidebarExplorer from './SidebarExplorer';
import SidebarSearch from './SidebarSearch';
import SidebarGit from './SidebarGit';
import SidebarExtensions from './SidebarExtensions';
import SidebarRestClient from './SidebarRestClient';
import SidebarDbExplorer from './SidebarDbExplorer';
import SidebarPerfMonitor from './SidebarPerfMonitor';
import SidebarSettings from './SidebarSettings';
import SidebarCopilot from './SidebarCopilot';
import EditorArea from './EditorArea';
import BottomPanel from './BottomPanel';
import StatusBar from './StatusBar';
import CommandPalette from './CommandPalette';
import { useKronexStore } from './useKronexStore';
import { X } from 'lucide-react';

export default function KronexCodeIDE() {
  const { 
    activeActivityTab, 
    isSidebarOpen, 
    sidebarWidth,
    setSidebarWidth,
    isBottomPanelOpen,
    bottomPanelHeight,
    setBottomPanelHeight,
    isZenMode, 
    isFullscreen,
    saveActiveFile, 
    setCommandPaletteOpen,
    toggleSidebar,
    toggleBottomPanel 
  } = useKronexStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingBottomPanel, setIsDraggingBottomPanel] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  // Mobile detection & resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse drag listeners for sidebar and bottom panel resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSidebar && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Activity bar width is 48px
        const newWidth = e.clientX - rect.left - 48;
        setSidebarWidth(newWidth);
      }
      if (isDraggingBottomPanel && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Status bar height is ~24px
        const newHeight = rect.bottom - 24 - e.clientY;
        setBottomPanelHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
      setIsDraggingBottomPanel(false);
      document.body.classList.remove('no-select');
    };

    if (isDraggingSidebar || isDraggingBottomPanel) {
      document.body.classList.add('no-select');
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.classList.remove('no-select');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSidebar, isDraggingBottomPanel, setSidebarWidth, setBottomPanelHeight]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveActiveFile();
      }
      // Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // Ctrl+B / Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      // Ctrl+`
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        toggleBottomPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveActiveFile, setCommandPaletteOpen, toggleSidebar, toggleBottomPanel]);

  // Render sidebar tab
  const renderSidebarContent = () => {
    switch (activeActivityTab) {
      case 'explorer': return <SidebarExplorer />;
      case 'search': return <SidebarSearch />;
      case 'git': return <SidebarGit />;
      case 'extensions': return <SidebarExtensions />;
      case 'rest': return <SidebarRestClient />;
      case 'database': return <SidebarDbExplorer />;
      case 'performance': return <SidebarPerfMonitor />;
      case 'copilot': return <SidebarCopilot />;
      case 'settings': return <SidebarSettings />;
      default: return <SidebarExplorer />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full flex-1 flex flex-col font-sans select-none overflow-hidden text-white bg-[#050812] ${
        isFullscreen ? 'fixed inset-0 z-[99999] w-screen h-screen' : 'relative'
      }`}
    >
      {/* Top Title Bar */}
      {!isZenMode && <TitleBar />}

      {/* IDE Main Middle Area */}
      <div className="flex-1 flex min-w-0 min-h-0 relative overflow-hidden">
        
        {/* Activity Bar */}
        {!isZenMode && <ActivityBar />}

        {/* Desktop Collapsible & Resizable Left Sidebar */}
        {!isZenMode && isSidebarOpen && !isMobile && (
          <>
            <div 
              style={{ width: `${sidebarWidth}px` }}
              className="bg-[#060a17] border-r border-white/10 flex flex-col shrink-0 overflow-y-auto no-scrollbar relative"
            >
              {renderSidebarContent()}
            </div>

            {/* Vertical Resize Handle */}
            <div 
              onMouseDown={(e) => { e.preventDefault(); setIsDraggingSidebar(true); }}
              className={`ide-resize-handle-h ${isDraggingSidebar ? 'active' : ''}`}
              title="Drag to resize sidebar"
            />
          </>
        )}

        {/* Mobile Slide-Over Sidebar Drawer */}
        {!isZenMode && isSidebarOpen && isMobile && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={toggleSidebar}
            />
            <div className="relative z-10 w-72 max-w-[80vw] bg-[#060a17] border-r border-white/10 flex flex-col h-full overflow-y-auto shadow-2xl">
              <div className="p-2 border-b border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">Navigation</span>
                <button 
                  onClick={toggleSidebar} 
                  className="p-1 rounded text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {renderSidebarContent()}
            </div>
          </div>
        )}

        {/* Center Editor & Bottom Panel Container */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 relative overflow-hidden">
          
          {/* Main Editor Canvas */}
          <EditorArea />

          {/* Horizontal Drag Handle for Bottom Panel */}
          {!isZenMode && isBottomPanelOpen && (
            <div 
              onMouseDown={(e) => { e.preventDefault(); setIsDraggingBottomPanel(true); }}
              className={`ide-resize-handle-v ${isDraggingBottomPanel ? 'active' : ''}`}
              title="Drag to resize bottom panel"
            />
          )}

          {/* Collapsible Terminal & Tools Panel */}
          {!isZenMode && <BottomPanel />}

        </div>

      </div>

      {/* Bottom Status Bar */}
      {!isZenMode && <StatusBar />}

      {/* Command Palette Overlay */}
      <CommandPalette />

    </div>
  );
}
