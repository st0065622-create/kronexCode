import React, { useState } from 'react';
import { 
  X, Play, Trash2, Copy, Sliders, Code, Terminal, Sparkles, 
  Paperclip, Key, ShieldCheck, Database, Check, RefreshCw
} from 'lucide-react';
import { WorkflowNodeData, WorkflowAttachment } from './workflowTypes';

interface NodeInspectorProps {
  nodeId: string;
  data: WorkflowNodeData;
  onUpdateData: (nodeId: string, newData: Partial<WorkflowNodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onRunSingleNode: (nodeId: string) => void;
  onClose: () => void;
  onOpenAttachmentModal: (nodeId: string) => void;
}

export default function NodeInspector({
  nodeId,
  data,
  onUpdateData,
  onDeleteNode,
  onDuplicateNode,
  onRunSingleNode,
  onClose,
  onOpenAttachmentModal
}: NodeInspectorProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'prompt' | 'code' | 'attachments' | 'output'>('config');

  return (
    <aside className="w-80 sm:w-96 h-full bg-[#0B1020]/95 border-l border-white/[0.08] backdrop-blur-2xl flex flex-col z-20 shrink-0 shadow-2xl">
      {/* Top Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-[#00D4FF]/20 border border-[#00D4FF]/40 flex items-center justify-center">
            <Sliders className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Node Inspector</h3>
            <p className="text-[10px] text-[#94A3B8] font-mono">ID: {nodeId}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onDuplicateNode(nodeId)}
            title="Duplicate Node"
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteNode(nodeId)}
            title="Delete Node"
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.08] bg-[#131A2E]/40 px-2 text-xs">
        <button
          onClick={() => setActiveTab('config')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all ${
            activeTab === 'config'
              ? 'border-[#00D4FF] text-[#00D4FF]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab('prompt')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all ${
            activeTab === 'prompt'
              ? 'border-[#00D4FF] text-[#00D4FF]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          Prompt / LLM
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all ${
            activeTab === 'code'
              ? 'border-[#00D4FF] text-[#00D4FF]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          Code / Tool
        </button>
        <button
          onClick={() => setActiveTab('attachments')}
          className={`py-2.5 px-3 font-medium border-b-2 transition-all relative ${
            activeTab === 'attachments'
              ? 'border-[#00D4FF] text-[#00D4FF]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          Files ({data.attachments?.length || 0})
        </button>
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
        {/* Node Name */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-[#94A3B8]">Node Label:</label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onUpdateData(nodeId, { label: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] text-xs text-[#F8FAFC] focus:border-[#00D4FF] focus:outline-none"
          />
        </div>

        {/* TAB 1: GENERAL CONFIG */}
        {activeTab === 'config' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#94A3B8]">Description:</label>
              <textarea
                rows={2}
                value={data.description || ''}
                onChange={(e) => onUpdateData(nodeId, { description: e.target.value })}
                placeholder="Explain the purpose of this node..."
                className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:border-[#00D4FF] focus:outline-none"
              />
            </div>

            {/* Webhook Path */}
            {data.category === 'triggers' && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-[#94A3B8]">Webhook Endpoint Path:</label>
                <input
                  type="text"
                  value={data.webhookUrl || '/api/v1/webhook/incoming'}
                  onChange={(e) => onUpdateData(nodeId, { webhookUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] font-mono text-xs text-[#00D4FF] focus:border-[#00D4FF] focus:outline-none"
                />
              </div>
            )}

            {/* Cron Schedule */}
            {data.type === 'trigger_schedule' && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-[#94A3B8]">Cron Timer Expression:</label>
                <input
                  type="text"
                  value={data.cronSchedule || '0 9 * * 1-5'}
                  onChange={(e) => onUpdateData(nodeId, { cronSchedule: e.target.value })}
                  placeholder="e.g. 0 9 * * 1-5"
                  className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] font-mono text-xs text-amber-300 focus:border-[#00D4FF] focus:outline-none"
                />
              </div>
            )}

            {/* Database Table */}
            {data.category === 'databases' && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-[#94A3B8]">Database Table / Collection:</label>
                <input
                  type="text"
                  value={data.dbTable || data.collection || 'records'}
                  onChange={(e) => onUpdateData(nodeId, { dbTable: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] text-xs text-[#F8FAFC] focus:border-[#00D4FF] focus:outline-none"
                />
              </div>
            )}

            {/* Vector DB Index */}
            {data.category === 'rag' && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-[#94A3B8]">Vector Index Name:</label>
                <input
                  type="text"
                  value={data.vectorIndex || 'enterprise-knowledge-base'}
                  onChange={(e) => onUpdateData(nodeId, { vectorIndex: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] text-xs text-[#F8FAFC] focus:border-[#00D4FF] focus:outline-none"
                />
              </div>
            )}

            {/* Logic Conditions */}
            {data.category === 'logic' && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-medium text-[#94A3B8]">Evaluation Expression (IF):</label>
                <input
                  type="text"
                  value={data.conditionIf || 'input.score > 0.8'}
                  onChange={(e) => onUpdateData(nodeId, { conditionIf: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] font-mono text-xs text-yellow-300 focus:border-[#00D4FF] focus:outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROMPT & LLM */}
        {activeTab === 'prompt' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#94A3B8]">LLM Model Provider:</label>
              <select
                value={data.model || 'gemini-2.5-flash'}
                onChange={(e) => onUpdateData(nodeId, { model: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] text-xs text-[#00D4FF] focus:border-[#00D4FF] focus:outline-none cursor-pointer"
              >
                <option value="gemini-2.5-flash">Google Gemini 2.5 Flash</option>
                <option value="gemini-2.5-pro">Google Gemini 2.5 Pro</option>
                <option value="gpt-4o">OpenAI GPT-4o</option>
                <option value="gpt-4o-mini">OpenAI GPT-4o Mini</option>
                <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                <option value="deepseek-reasoner">DeepSeek R1 Reasoner</option>
                <option value="grok-3-beta">xAI Grok 3</option>
                <option value="llama3:8b">Ollama / Local Llama 3</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#94A3B8] font-medium">Temperature:</span>
                <span className="text-[#00D4FF] font-mono">{data.temperature ?? 0.7}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={data.temperature ?? 0.7}
                onChange={(e) => onUpdateData(nodeId, { temperature: parseFloat(e.target.value) })}
                className="w-full accent-[#00D4FF] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#94A3B8]">System Instruction Prompt:</label>
              <textarea
                rows={3}
                value={data.systemPrompt || 'You are an autonomous enterprise AI agent assisting with automated workflow tasks.'}
                onChange={(e) => onUpdateData(nodeId, { systemPrompt: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] text-xs text-[#F8FAFC] focus:border-[#00D4FF] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#94A3B8]">User Prompt Template (Supports &#123;&#123;input&#125;&#125;):</label>
              <textarea
                rows={4}
                value={data.promptTemplate || 'Analyze the incoming input payload and generate structured JSON response:\n{{input}}'}
                onChange={(e) => onUpdateData(nodeId, { promptTemplate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] font-mono text-xs text-emerald-300 focus:border-[#00D4FF] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 3: CODE & TOOL */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#94A3B8]">Execution Language:</label>
              <select
                value={data.codeLanguage || 'python'}
                onChange={(e) => onUpdateData(nodeId, { codeLanguage: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-[#131A2E] border border-white/[0.08] text-xs text-[#F8FAFC] focus:border-[#00D4FF] focus:outline-none cursor-pointer"
              >
                <option value="python">Python 3.11</option>
                <option value="javascript">JavaScript / Node.js</option>
                <option value="sql">PostgreSQL / SQL Query</option>
                <option value="bash">Bash Script / Terminal</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-[#94A3B8]">Code Sandbox Script:</label>
              <textarea
                rows={8}
                value={data.codeSnippet || 'def execute_step(payload):\n    # Process input data\n    result = payload.get("data", "")\n    return {"status": "ok", "processed": result}'}
                onChange={(e) => onUpdateData(nodeId, { codeSnippet: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#080C18] border border-white/[0.1] font-mono text-xs text-emerald-300 focus:border-[#00D4FF] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 4: ATTACHMENTS */}
        {activeTab === 'attachments' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#94A3B8]">Attached Knowledge Files:</span>
              <button
                onClick={() => onOpenAttachmentModal(nodeId)}
                className="px-2.5 py-1 rounded-lg bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 text-xs font-medium hover:bg-[#00D4FF]/30 transition-all cursor-pointer flex items-center space-x-1"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Upload Files</span>
              </button>
            </div>

            {data.attachments && data.attachments.length > 0 ? (
              <div className="space-y-2">
                {data.attachments.map((file) => (
                  <div key={file.id} className="p-2.5 rounded-xl bg-[#131A2E] border border-white/[0.08] flex items-center justify-between">
                    <div className="truncate">
                      <p className="text-xs font-bold text-[#F8FAFC] truncate">{file.name}</p>
                      <p className="text-[10px] text-[#94A3B8] font-mono">{(file.size / 1024).toFixed(1)} KB • {file.fileType}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[9px] font-mono">Synced</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border-2 border-dashed border-white/[0.08] rounded-2xl space-y-2">
                <Paperclip className="w-6 h-6 text-[#94A3B8] mx-auto opacity-50" />
                <p className="text-xs text-[#94A3B8]">No files attached to this node.</p>
                <button
                  onClick={() => onOpenAttachmentModal(nodeId)}
                  className="text-xs text-[#00D4FF] hover:underline"
                >
                  Drag PDF, Word, Excel or CSV here
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-white/[0.08] bg-[#131A2E]/60 flex items-center space-x-2">
        <button
          onClick={() => onRunSingleNode(nodeId)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-[#F8FAFC] font-semibold text-xs shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Execute Node</span>
        </button>
      </div>
    </aside>
  );
}
