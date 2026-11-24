import { NodeDefinition } from './workflowTypes';

export const NODE_CATALOG: NodeDefinition[] = [
  // --- TRIGGERS ---
  {
    type: 'trigger_start',
    category: 'triggers',
    label: 'Start Trigger',
    description: 'Manual button or root entry point for workflow',
    iconName: 'Play',
    color: '#00D4FF',
    defaultData: { label: 'Start Trigger' }
  },
  {
    type: 'trigger_chat',
    category: 'triggers',
    label: 'Chat Trigger',
    description: 'Triggers on incoming chat message prompt',
    iconName: 'MessageSquare',
    color: '#00D4FF',
    defaultData: { label: 'Chat Trigger', welcomeMessage: 'How can I assist you today?' }
  },
  {
    type: 'trigger_voice',
    category: 'triggers',
    label: 'Voice Trigger',
    description: 'Activates on voice wake-word or audio stream',
    iconName: 'Mic',
    color: '#00D4FF',
    defaultData: { label: 'Voice Trigger', wakeWord: 'Hey Kronex' }
  },
  {
    type: 'trigger_file',
    category: 'triggers',
    label: 'File Upload Trigger',
    description: 'Fires when new documents or files are uploaded',
    iconName: 'FileUp',
    color: '#00D4FF',
    defaultData: { label: 'File Upload Trigger', allowedTypes: ['pdf', 'docx', 'xlsx', 'csv', 'zip'] }
  },
  {
    type: 'trigger_webhook',
    category: 'triggers',
    label: 'Webhook Trigger',
    description: 'Listens for incoming HTTP POST/GET webhooks',
    iconName: 'Webhook',
    color: '#00D4FF',
    defaultData: { label: 'Webhook Trigger', webhookPath: '/api/v1/webhook/incoming', method: 'POST' }
  },
  {
    type: 'trigger_schedule',
    category: 'triggers',
    label: 'Schedule Trigger',
    description: 'Cron timer or interval recurring execution',
    iconName: 'Clock',
    color: '#00D4FF',
    defaultData: { label: 'Schedule Trigger', cronSchedule: '0 9 * * 1-5', timezone: 'UTC' }
  },
  {
    type: 'trigger_email',
    category: 'triggers',
    label: 'Email Trigger',
    description: 'Triggers when a new email arrives in inbox',
    iconName: 'Mail',
    color: '#00D4FF',
    defaultData: { label: 'Email Trigger', mailbox: 'inbox@kronex.ai' }
  },
  {
    type: 'trigger_whatsapp',
    category: 'triggers',
    label: 'WhatsApp Trigger',
    description: 'Fires on incoming WhatsApp Cloud API messages',
    iconName: 'MessageCircle',
    color: '#00D4FF',
    defaultData: { label: 'WhatsApp Trigger', phoneNumberId: 'WA-882103' }
  },
  {
    type: 'trigger_telegram',
    category: 'triggers',
    label: 'Telegram Trigger',
    description: 'Telegram Bot webhook event listener',
    iconName: 'Send',
    color: '#00D4FF',
    defaultData: { label: 'Telegram Trigger', botName: '@KronexAIBot' }
  },
  {
    type: 'trigger_slack',
    category: 'triggers',
    label: 'Slack Trigger',
    description: 'Slack channel event or slash command',
    iconName: 'Slack',
    color: '#00D4FF',
    defaultData: { label: 'Slack Trigger', channel: '#general' }
  },

  // --- AI MODELS ---
  {
    type: 'model_gemini',
    category: 'ai_models',
    label: 'Google Gemini 2.5',
    description: 'Multimodal reasoning with native Gemini API',
    iconName: 'Sparkles',
    color: '#7C5CFF',
    defaultData: { label: 'Gemini 2.5 Flash', model: 'gemini-2.5-flash', temperature: 0.7, systemPrompt: 'You are a helpful enterprise AI assistant.' }
  },
  {
    type: 'model_openai',
    category: 'ai_models',
    label: 'OpenAI GPT-4o',
    description: 'High intelligence reasoning and function calling',
    iconName: 'Cpu',
    color: '#10B981',
    defaultData: { label: 'OpenAI GPT-4o', model: 'gpt-4o', temperature: 0.5, systemPrompt: 'You are an AI agent analyzing enterprise data.' }
  },
  {
    type: 'model_claude',
    category: 'ai_models',
    label: 'Claude 3.7 Sonnet',
    description: 'Anthropic reasoning and precise artifact creation',
    iconName: 'Brain',
    color: '#D97706',
    defaultData: { label: 'Claude 3.7 Sonnet', model: 'claude-3-7-sonnet', temperature: 0.4 }
  },
  {
    type: 'model_deepseek',
    category: 'ai_models',
    label: 'DeepSeek R1',
    description: 'Open-weights reasoning and math/code specialist',
    iconName: 'Compass',
    color: '#3B82F6',
    defaultData: { label: 'DeepSeek R1', model: 'deepseek-reasoner', temperature: 0.2 }
  },
  {
    type: 'model_grok',
    category: 'ai_models',
    label: 'xAI Grok 3',
    description: 'Realtime knowledge and unfiltered reasoning',
    iconName: 'Zap',
    color: '#EC4899',
    defaultData: { label: 'xAI Grok 3', model: 'grok-3-beta', temperature: 0.7 }
  },
  {
    type: 'model_ollama',
    category: 'ai_models',
    label: 'Ollama / Local LLM',
    description: 'Self-hosted Llama 3, Mistral, or Qwen instance',
    iconName: 'Server',
    color: '#8B5CF6',
    defaultData: { label: 'Ollama Local', model: 'llama3:8b', baseUrl: 'http://localhost:11434' }
  },

  // --- AGENTS ---
  {
    type: 'agent_research',
    category: 'agents',
    label: 'Research Agent',
    description: 'Autonomous web synthesis and source citation',
    iconName: 'Search',
    color: '#06B6D4',
    defaultData: { label: 'Research Agent', agentRole: 'Deep Web Researcher', maxSteps: 5 }
  },
  {
    type: 'agent_coding',
    category: 'agents',
    label: 'Coding Agent',
    description: 'Writes, refactors, and tests code in sandbox',
    iconName: 'Code',
    color: '#3B82F6',
    defaultData: { label: 'Coding Agent', agentRole: 'Senior Full Stack Engineer', language: 'typescript' }
  },
  {
    type: 'agent_support',
    category: 'agents',
    label: 'Customer Support Agent',
    description: 'Ticket resolution with Knowledge Base lookup',
    iconName: 'Headphones',
    color: '#10B981',
    defaultData: { label: 'Customer Support Agent', autoEscalate: true }
  },
  {
    type: 'agent_analyst',
    category: 'agents',
    label: 'Data Analyst Agent',
    description: 'SQL queries, CSV chart generation, and metrics',
    iconName: 'BarChart2',
    color: '#8B5CF6',
    defaultData: { label: 'Data Analyst Agent', exportFormat: 'pdf' }
  },
  {
    type: 'agent_custom',
    category: 'agents',
    label: 'Custom Agent Builder',
    description: 'Configure bespoke autonomous agent personality',
    iconName: 'Bot',
    color: '#F59E0B',
    defaultData: { label: 'Custom Agent', agentRole: 'Sovereign Protocol Agent', memoryType: 'Vector + Window' }
  },

  // --- TOOLS ---
  {
    type: 'tool_web_search',
    category: 'tools',
    label: 'Web Search',
    description: 'Real-time Google / Tavily search grounding',
    iconName: 'Globe',
    color: '#00D4FF',
    defaultData: { label: 'Web Search', maxResults: 5 }
  },
  {
    type: 'tool_code_interpreter',
    category: 'tools',
    label: 'Code Interpreter',
    description: 'Executes Python, JavaScript, or SQL code',
    iconName: 'Terminal',
    color: '#10B981',
    defaultData: { label: 'Code Interpreter', codeLanguage: 'python', codeSnippet: 'def main(input):\n    return {"processed": True, "data": input}' }
  },
  {
    type: 'tool_docker_sandbox',
    category: 'tools',
    label: 'Docker Sandbox',
    description: 'Isolated container environment execution',
    iconName: 'Box',
    color: '#3B82F6',
    defaultData: { label: 'Docker Sandbox', image: 'python:3.11-slim' }
  },
  {
    type: 'tool_image_gen',
    category: 'tools',
    label: 'Image Generation',
    description: 'Imagen 3 / DALL-E 3 visual creation',
    iconName: 'Image',
    color: '#EC4899',
    defaultData: { label: 'Image Generation', style: 'Photorealistic', aspectRatio: '16:9' }
  },
  {
    type: 'tool_ocr_speech',
    category: 'tools',
    label: 'OCR & Speech Engine',
    description: 'Extract text from image/PDF or Whisper STT',
    iconName: 'ScanText',
    color: '#F59E0B',
    defaultData: { label: 'OCR & STT Engine', mode: 'Whisper + Tesseract' }
  },

  // --- RAG SYSTEM ---
  {
    type: 'rag_vector_db',
    category: 'rag',
    label: 'Vector DB (Pinecone/Qdrant)',
    description: 'Embeddings storage and cosine similarity search',
    iconName: 'Database',
    color: '#A855F7',
    defaultData: { label: 'Vector Database', vectorIndex: 'enterprise-knowledge', topK: 4 }
  },
  {
    type: 'rag_doc_loader',
    category: 'rag',
    label: 'Document Loader & Chunking',
    description: 'Parses PDF, Word, Excel, CSV into text chunks',
    iconName: 'FileText',
    color: '#A855F7',
    defaultData: { label: 'Document Loader', chunkSize: 1000, chunkOverlap: 200 }
  },
  {
    type: 'rag_knowledge_base',
    category: 'rag',
    label: 'Knowledge Base Retriever',
    description: 'Retrieves relevant context for prompt augmentation',
    iconName: 'BookOpen',
    color: '#A855F7',
    defaultData: { label: 'Knowledge Base', minRelevanceScore: 0.78 }
  },

  // --- DATABASES & CLOUD STORAGE ---
  {
    type: 'db_firebase',
    category: 'databases',
    label: 'Firebase Firestore',
    description: 'Real-time document collection queries and persistence',
    iconName: 'Flame',
    color: '#FFCA28',
    defaultData: { label: 'Firebase Firestore', collection: 'workflows' }
  },
  {
    type: 'db_supabase',
    category: 'databases',
    label: 'Supabase Postgres',
    description: 'Relational SQL queries and row-level security',
    iconName: 'Layers',
    color: '#3ECF8E',
    defaultData: { label: 'Supabase DB', dbTable: 'agent_logs' }
  },
  {
    type: 'db_redis',
    category: 'databases',
    label: 'Redis Cache',
    description: 'Ultra-low latency key-value memory store',
    iconName: 'Zap',
    color: '#DC2626',
    defaultData: { label: 'Redis Cache', ttlSeconds: 3600 }
  },
  {
    type: 'storage_s3_drive',
    category: 'cloud_storage',
    label: 'Cloud Storage (S3/Drive)',
    description: 'Upload/Download files from Google Drive or AWS S3',
    iconName: 'Cloud',
    color: '#0284C7',
    defaultData: { label: 'AWS S3 / Google Drive', bucket: 'kronex-assets' }
  },

  // --- COMMUNICATION ---
  {
    type: 'comm_slack_discord',
    category: 'communication',
    label: 'Slack & Discord Bot',
    description: 'Post rich formatted notifications and alerts',
    iconName: 'Send',
    color: '#E11D48',
    defaultData: { label: 'Slack / Discord Notify', channel: '#ai-workflow-alerts' }
  },
  {
    type: 'comm_gmail_outlook',
    category: 'communication',
    label: 'Gmail / Email Sender',
    description: 'Send automated HTML emails and attachments',
    iconName: 'Mail',
    color: '#EA4335',
    defaultData: { label: 'Email Sender', recipient: '{{input.userEmail}}' }
  },
  {
    type: 'comm_whatsapp_twilio',
    category: 'communication',
    label: 'WhatsApp / SMS (Twilio)',
    description: 'Send instant SMS or WhatsApp template text',
    iconName: 'Phone',
    color: '#25D366',
    defaultData: { label: 'Twilio WhatsApp/SMS', template: 'Workflow Alert' }
  },

  // --- AUTOMATION & INTEGRATIONS ---
  {
    type: 'auto_webhook_call',
    category: 'automation',
    label: 'HTTP Request / API Call',
    description: 'REST API call with OAuth2 / Bearer authorization',
    iconName: 'Globe',
    color: '#2563EB',
    defaultData: { label: 'HTTP REST Request', method: 'POST', endpoint: 'https://api.kronex.ai/v1/trigger' }
  },
  {
    type: 'auto_zapier_n8n',
    category: 'automation',
    label: 'n8n & Zapier Bridge',
    description: 'Trigger external automated workflow pipelines',
    iconName: 'Workflow',
    color: '#FF6D00',
    defaultData: { label: 'n8n Pipeline', workflowId: 'wf_kronex_991' }
  },

  // --- LOGIC & SECURITY ---
  {
    type: 'logic_if_else',
    category: 'logic',
    label: 'IF / ELSE Branch',
    description: 'Conditional routing based on output evaluation',
    iconName: 'GitFork',
    color: '#EAB308',
    defaultData: { label: 'IF / ELSE Logic', conditionIf: 'input.confidence > 0.8' }
  },
  {
    type: 'logic_loop',
    category: 'logic',
    label: 'Loop / For-Each',
    description: 'Iterate over arrays or list items concurrently',
    iconName: 'Repeat',
    color: '#EAB308',
    defaultData: { label: 'Loop Iterator', batchSize: 5 }
  },
  {
    type: 'logic_human_approval',
    category: 'logic',
    label: 'Human-in-the-Loop Approval',
    description: 'Pause workflow execution until admin approves',
    iconName: 'ShieldAlert',
    color: '#F43F5E',
    defaultData: { label: 'Human Approval', timeoutMinutes: 60 }
  },
  {
    type: 'security_jwt_rbac',
    category: 'security',
    label: 'JWT & RBAC Security Guard',
    description: 'Enforce enterprise authentication and encryption',
    iconName: 'Lock',
    color: '#64748B',
    defaultData: { label: 'Security Guard', requiredRole: 'Enterprise Admin' }
  }
];
