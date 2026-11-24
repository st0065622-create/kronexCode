import React from 'react';
import { Sparkles, X, Bot, FileText, Code, Phone, Database, ArrowRight, Layers } from 'lucide-react';
import { WorkflowTemplate } from './workflowTypes';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: WorkflowTemplate) => void;
}

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Autonomous RAG Document Knowledge Base',
    description: 'Parses PDF & Word uploads, generates vector embeddings into Pinecone, and retrieves context for Gemini 2.5 Pro synthesis.',
    category: 'RAG & Knowledge',
    difficulty: 'Enterprise',
    icon: 'Layers',
    tags: ['PDF Upload', 'Vector DB', 'Gemini 2.5', 'Pinecone'],
    nodes: [
      { id: '1', type: 'workflowNode', position: { x: 100, y: 150 }, data: { label: 'File Upload Trigger', category: 'triggers', nodeType: 'trigger_file', color: '#00D4FF', iconName: 'FileUp' } },
      { id: '2', type: 'workflowNode', position: { x: 450, y: 150 }, data: { label: 'Document Loader & Chunking', category: 'rag', nodeType: 'rag_doc_loader', color: '#A855F7', iconName: 'FileText', chunkSize: 1000 } },
      { id: '3', type: 'workflowNode', position: { x: 800, y: 150 }, data: { label: 'Vector DB (Pinecone)', category: 'rag', nodeType: 'rag_vector_db', color: '#A855F7', iconName: 'Database', vectorIndex: 'enterprise-kb' } },
      { id: '4', type: 'workflowNode', position: { x: 1150, y: 150 }, data: { label: 'Gemini 2.5 Pro Synthesis', category: 'ai_models', nodeType: 'model_gemini', color: '#7C5CFF', iconName: 'Sparkles', model: 'gemini-2.5-pro' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#00D4FF', strokeWidth: 2 } },
      { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#A855F7', strokeWidth: 2 } },
      { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#7C5CFF', strokeWidth: 2 } }
    ]
  },
  {
    id: 'tmpl-2',
    title: 'Customer Support Auto-Resolver & Escalation',
    description: 'Monitors incoming Webhook/Email tickets, queries Knowledge Base, routes high priority issues for human approval.',
    category: 'Support & Sales',
    difficulty: 'Intermediate',
    icon: 'Bot',
    tags: ['Webhook', 'Claude 3.7', 'Human Approval', 'Slack'],
    nodes: [
      { id: '1', type: 'workflowNode', position: { x: 100, y: 200 }, data: { label: 'Webhook Trigger', category: 'triggers', nodeType: 'trigger_webhook', color: '#00D4FF', iconName: 'Webhook' } },
      { id: '2', type: 'workflowNode', position: { x: 450, y: 200 }, data: { label: 'Customer Support Agent', category: 'agents', nodeType: 'agent_support', color: '#10B981', iconName: 'Headphones', agentRole: 'Tier 1 Resolution Agent' } },
      { id: '3', type: 'workflowNode', position: { x: 800, y: 200 }, data: { label: 'IF High Urgency', category: 'logic', nodeType: 'logic_if_else', color: '#EAB308', iconName: 'GitFork', conditionIf: 'urgency === "HIGH"' } },
      { id: '4', type: 'workflowNode', position: { x: 1150, y: 200 }, data: { label: 'Slack Alert', category: 'communication', nodeType: 'comm_slack_discord', color: '#E11D48', iconName: 'Send' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#00D4FF', strokeWidth: 2 } },
      { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
      { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#EAB308', strokeWidth: 2 } }
    ]
  },
  {
    id: 'tmpl-3',
    title: 'Autonomous Code Reviewer & Docker Sandbox Test',
    description: 'Triggers on GitHub PR webhooks, runs Code Interpreter Python/TS tests inside Docker, posts review feedback.',
    category: 'Engineering & DevOps',
    difficulty: 'Enterprise',
    icon: 'Code',
    tags: ['GitHub', 'Docker Sandbox', 'Python', 'DeepSeek R1'],
    nodes: [
      { id: '1', type: 'workflowNode', position: { x: 100, y: 180 }, data: { label: 'GitHub Trigger', category: 'triggers', nodeType: 'trigger_webhook', color: '#00D4FF', iconName: 'Webhook' } },
      { id: '2', type: 'workflowNode', position: { x: 450, y: 180 }, data: { label: 'Coding Agent', category: 'agents', nodeType: 'agent_coding', color: '#3B82F6', iconName: 'Code', agentRole: 'DevSecOps Auditor' } },
      { id: '3', type: 'workflowNode', position: { x: 800, y: 180 }, data: { label: 'Docker Sandbox Exec', category: 'tools', nodeType: 'tool_docker_sandbox', color: '#3B82F6', iconName: 'Box', image: 'node:20-alpine' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#00D4FF', strokeWidth: 2 } },
      { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } }
    ]
  }
];

export default function TemplatesModal({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#0B1020] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Enterprise Workflow Templates</h3>
              <p className="text-xs text-[#94A3B8]">Deploy production-ready multi-agent architectures in seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                onSelectTemplate(tmpl);
                onClose();
              }}
              className="p-5 rounded-2xl bg-[#131A2E]/80 border border-white/[0.08] hover:border-[#00D4FF]/60 hover:shadow-[0_10px_30px_rgba(0,212,255,0.2)] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 text-[10px] font-mono font-bold text-[#00D4FF]">
                    {tmpl.difficulty}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono">{tmpl.category}</span>
                </div>

                <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#00D4FF] transition-colors leading-snug">
                  {tmpl.title}
                </h4>

                <p className="text-xs text-[#94A3B8] line-clamp-3">
                  {tmpl.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-2">
                  {tmpl.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-mono text-[#CBD5E1]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] mt-4 flex items-center justify-between text-xs font-bold text-[#00D4FF]">
                <span>Load Template</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
