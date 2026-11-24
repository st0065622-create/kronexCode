import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Play, MessageSquare, Mic, FileUp, Webhook, Clock, Mail, MessageCircle, Send, Slack,
  Sparkles, Cpu, Brain, Compass, Zap, Server, Search, Code, Headphones, BarChart2,
  Bot, Globe, Terminal, Box, Image as ImageIcon, ScanText, Database, FileText, BookOpen,
  Flame, Layers, Cloud, Phone, Workflow, GitFork, Repeat, ShieldAlert, Lock,
  CheckCircle2, AlertCircle, Loader2, Paperclip, Settings, PlayCircle
} from 'lucide-react';
import { WorkflowNodeData } from './workflowTypes';

const ICON_MAP: Record<string, React.ElementType> = {
  Play, MessageSquare, Mic, FileUp, Webhook, Clock, Mail, MessageCircle, Send, Slack,
  Sparkles, Cpu, Brain, Compass, Zap, Server, Search, Code, Headphones, BarChart2,
  Bot, Globe, Terminal, Box, Image: ImageIcon, ScanText, Database, FileText, BookOpen,
  Flame, Layers, Cloud, Phone, Workflow, GitFork, Repeat, ShieldAlert, Lock
};

function getIcon(iconName?: string) {
  if (!iconName) return Bot;
  return ICON_MAP[iconName] || Bot;
}

export const WorkflowNodeComponent = memo(({ id, data, selected }: NodeProps<any>) => {
  const nodeData = data as WorkflowNodeData;
  const Icon = getIcon(nodeData.iconName);
  const color = nodeData.color || '#7C5CFF';

  const isTrigger = nodeData.category === 'triggers';
  const isLogic = nodeData.category === 'logic';

  return (
    <div 
      className={`relative min-w-[260px] max-w-[320px] rounded-[18px] bg-[#0B1020]/90 backdrop-blur-xl border transition-all duration-200 shadow-2xl group ${
        selected 
          ? 'border-[#00D4FF] shadow-[0_0_25px_rgba(0,212,255,0.4)] scale-[1.02]' 
          : nodeData.status === 'running'
            ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse'
            : nodeData.status === 'success'
              ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : nodeData.status === 'error'
                ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'border-white/[0.12] hover:border-white/25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Top Accent Line */}
      <div 
        className="h-[3px] w-full rounded-t-[18px]"
        style={{ backgroundColor: color }}
      />

      {/* Target Handle (Left or Top for Non-Triggers) */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3.5 !h-3.5 !bg-[#131A2E] !border-2 !border-[#00D4FF] hover:!scale-125 transition-transform !-left-2"
        />
      )}

      {/* Node Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md"
            style={{ backgroundColor: `${color}20`, border: `1px solid ${color}50` }}
          >
            {React.createElement(Icon as any, { className: 'w-4 h-4', style: { color } })}
          </div>
          <div className="truncate">
            <h4 className="text-xs font-bold text-[#F8FAFC] truncate tracking-wide">
              {nodeData.label}
            </h4>
            <span className="text-[10px] text-[#94A3B8] font-mono capitalize block truncate">
              {nodeData.category.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Status indicator or Action button */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {nodeData.status === 'running' && (
            <div className="p-1 rounded-full bg-amber-500/20 text-amber-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
          )}
          {nodeData.status === 'success' && (
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
          {nodeData.status === 'error' && (
            <div className="p-1 rounded-full bg-rose-500/20 text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (nodeData.onRunSingleNode) nodeData.onRunSingleNode(id);
            }}
            title="Test / Run Node"
            className="p-1 rounded-lg bg-white/5 hover:bg-[#00D4FF]/20 text-[#94A3B8] hover:text-[#00D4FF] transition-colors cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (nodeData.onOpenInspector) nodeData.onOpenInspector(id);
            }}
            title="Configure Node"
            className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Node Body Details */}
      <div className="p-3 space-y-2 text-xs text-[#94A3B8]">
        {nodeData.model && (
          <div className="flex justify-between items-center bg-[#131A2E]/60 px-2.5 py-1.5 rounded-lg border border-white/[0.05]">
            <span className="text-[10px] font-mono text-[#94A3B8]">Model:</span>
            <span className="text-[10px] font-mono font-bold text-[#00D4FF]">{nodeData.model}</span>
          </div>
        )}

        {nodeData.codeLanguage && (
          <div className="flex justify-between items-center bg-[#131A2E]/60 px-2.5 py-1.5 rounded-lg border border-white/[0.05]">
            <span className="text-[10px] font-mono text-[#94A3B8]">Lang:</span>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">{nodeData.codeLanguage}</span>
          </div>
        )}

        {nodeData.cronSchedule && (
          <div className="flex justify-between items-center bg-[#131A2E]/60 px-2.5 py-1.5 rounded-lg border border-white/[0.05]">
            <span className="text-[10px] font-mono text-[#94A3B8]">Cron:</span>
            <span className="text-[10px] font-mono text-amber-300">{nodeData.cronSchedule}</span>
          </div>
        )}

        {nodeData.agentRole && (
          <p className="text-[11px] text-[#CBD5E1] line-clamp-1 italic">
            "{nodeData.agentRole}"
          </p>
        )}

        {nodeData.description && !nodeData.agentRole && (
          <p className="text-[11px] text-[#94A3B8] line-clamp-2">
            {nodeData.description}
          </p>
        )}

        {/* File Attachments Badge */}
        {nodeData.attachments && nodeData.attachments.length > 0 && (
          <div className="flex items-center space-x-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-1 rounded-md border border-cyan-500/20">
            <Paperclip className="w-3 h-3 text-[#00D4FF]" />
            <span>{nodeData.attachments.length} attachment(s) synced</span>
          </div>
        )}

        {/* Execution Output Preview */}
        {nodeData.lastOutput && (
          <div className="mt-1.5 p-2 rounded-lg bg-[#080C18] border border-white/[0.08] text-[10px] font-mono text-emerald-300 max-h-16 overflow-hidden text-ellipsis">
            <span className="text-[9px] text-[#94A3B8] block font-sans">Output:</span>
            {typeof nodeData.lastOutput === 'string' 
              ? nodeData.lastOutput 
              : JSON.stringify(nodeData.lastOutput)}
          </div>
        )}

        {/* Execution metrics */}
        {nodeData.executionTimeMs !== undefined && (
          <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8] pt-1">
            <span>Lat: {nodeData.executionTimeMs}ms</span>
            {nodeData.tokensUsed !== undefined && (
              <span>Tokens: {nodeData.tokensUsed}</span>
            )}
          </div>
        )}
      </div>

      {/* Source Handles (Right or Bottom for Connections) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3.5 !h-3.5 !bg-[#131A2E] !border-2 !border-[#7C5CFF] hover:!scale-125 transition-transform !-right-2"
      />

      {/* Second Source Handle for Logic Branching */}
      {isLogic && (
        <Handle
          type="source"
          id="branch-else"
          position={Position.Bottom}
          className="!w-3.5 !h-3.5 !bg-[#131A2E] !border-2 !border-rose-400 hover:!scale-125 transition-transform !-bottom-2"
        />
      )}
    </div>
  );
});

WorkflowNodeComponent.displayName = 'WorkflowNodeComponent';

export const nodeTypes = {
  workflowNode: WorkflowNodeComponent,
};
