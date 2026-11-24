import React, { useState } from 'react';
import { 
  Search, ChevronRight, Sparkles, Play, Cpu, Bot, Terminal, Database, 
  Cloud, MessageSquare, Workflow, Lock, Layers, Mic, HardDrive, Filter, X
} from 'lucide-react';
import { NODE_CATALOG } from './nodeCatalog';
import { NodeCategory, NodeDefinition } from './workflowTypes';

interface NodePaletteProps {
  onAddNode: (def: NodeDefinition) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const CATEGORY_LABELS: Record<NodeCategory, { label: string; icon: React.ElementType; color: string }> = {
  triggers: { label: 'Triggers & Inputs', icon: Play, color: '#00D4FF' },
  ai_models: { label: 'AI Models', icon: Sparkles, color: '#7C5CFF' },
  agents: { label: 'Autonomous Agents', icon: Bot, color: '#F59E0B' },
  tools: { label: 'Tools & Code', icon: Terminal, color: '#10B981' },
  rag: { label: 'RAG & Knowledge', icon: Layers, color: '#A855F7' },
  databases: { label: 'Databases', icon: Database, color: '#FFCA28' },
  cloud_storage: { label: 'Cloud Storage', icon: Cloud, color: '#0284C7' },
  communication: { label: 'Communication', icon: MessageSquare, color: '#E11D48' },
  automation: { label: 'Automation & Webhooks', icon: Workflow, color: '#2563EB' },
  integrations: { label: 'OAuth & Integrations', icon: HardDrive, color: '#3ECF8E' },
  voice: { label: 'Voice & Speech', icon: Mic, color: '#EC4899' },
  memory: { label: 'Agent Memory', icon: Cpu, color: '#8B5CF6' },
  logic: { label: 'Logic & Flow', icon: Filter, color: '#EAB308' },
  security: { label: 'Security & Auth', icon: Lock, color: '#64748B' },
};

export default function NodePalette({ onAddNode, isOpen, onClose }: NodePaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NodeCategory | 'all'>('all');

  const filteredNodes = NODE_CATALOG.filter((node) => {
    const matchesSearch = node.label.toLowerCase().includes(search.toLowerCase()) ||
                          node.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <aside className="w-80 h-full bg-[#0B1020]/95 border-r border-white/[0.08] backdrop-blur-2xl flex flex-col z-20 shrink-0 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Node Library</h3>
            <p className="text-[10px] text-[#94A3B8]">Drag & Drop or Click to Add</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-white/[0.06] space-y-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search triggers, AI, RAG, DBs..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131A2E]/80 border border-white/[0.08] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:border-[#00D4FF] focus:outline-none"
          />
        </div>

        {/* Category Pills Slider */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-medium ${
              selectedCategory === 'all'
                ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40'
                : 'bg-white/5 text-[#94A3B8] border border-transparent hover:bg-white/10'
            }`}
          >
            All ({NODE_CATALOG.length})
          </button>

          {(Object.keys(CATEGORY_LABELS) as NodeCategory[]).map((cat) => {
            const meta = CATEGORY_LABELS[cat];
            const count = NODE_CATALOG.filter((n) => n.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-medium flex items-center space-x-1 ${
                  selectedCategory === cat
                    ? 'bg-[#7C5CFF]/25 text-[#F8FAFC] border border-[#7C5CFF]/50'
                    : 'bg-white/5 text-[#94A3B8] border border-transparent hover:bg-white/10'
                }`}
              >
                <span>{meta.label}</span>
                <span className="text-[9px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Node Catalog Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {filteredNodes.length > 0 ? (
          filteredNodes.map((def) => {
            const catMeta = CATEGORY_LABELS[def.category];
            return (
              <div
                key={def.type}
                onClick={() => onAddNode(def)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', JSON.stringify(def));
                  e.dataTransfer.effectAllowed = 'move';
                }}
                className="p-3 rounded-2xl bg-[#131A2E]/60 hover:bg-[#131A2E] border border-white/[0.08] hover:border-[#00D4FF]/40 transition-all cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-inner"
                      style={{ 
                        backgroundColor: `${def.color}20`, 
                        borderColor: `${def.color}50` 
                      }}
                    >
                      {React.createElement(catMeta.icon as any, { className: 'w-4 h-4', style: { color: def.color } })}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#00D4FF] transition-colors">
                        {def.label}
                      </h4>
                      <p className="text-[10px] text-[#94A3B8] line-clamp-1">
                        {def.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 space-y-2">
            <p className="text-xs text-[#94A3B8]">No node types match your filter.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); }}
              className="text-xs text-[#00D4FF] hover:underline"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
