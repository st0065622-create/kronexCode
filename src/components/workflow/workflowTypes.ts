export type NodeCategory = 
  | 'triggers'
  | 'ai_models'
  | 'tools'
  | 'rag'
  | 'databases'
  | 'cloud_storage'
  | 'communication'
  | 'automation'
  | 'integrations'
  | 'voice'
  | 'memory'
  | 'agents'
  | 'logic'
  | 'security';

export interface NodeDefinition {
  type: string;
  category: NodeCategory;
  label: string;
  description: string;
  iconName: string;
  color: string; // Tailwind color or hex
  defaultData: Record<string, any>;
  inputsCount?: number;
  outputsCount?: number;
}

export interface WorkflowNodeData {
  label: string;
  nodeType: string;
  category: NodeCategory;
  description?: string;
  status?: 'idle' | 'running' | 'success' | 'error' | 'waiting';
  iconName?: string;
  color?: string;
  
  // Specific properties
  model?: string;
  provider?: string;
  temperature?: number;
  systemPrompt?: string;
  promptTemplate?: string;
  
  codeLanguage?: 'python' | 'javascript' | 'sql' | 'bash';
  codeSnippet?: string;
  
  apiKeyName?: string;
  webhookUrl?: string;
  cronSchedule?: string;
  
  dbTable?: string;
  vectorIndex?: string;
  chunkSize?: number;
  
  conditionIf?: string;
  delayMs?: number;
  maxRetries?: number;
  
  agentRole?: string;
  agentMemoryType?: string;
  
  attachments?: WorkflowAttachment[];
  executionTimeMs?: number;
  tokensUsed?: number;
  lastOutput?: any;
  lastError?: string;
  
  // Callbacks
  onOpenInspector?: (id: string) => void;
  onRunSingleNode?: (id: string) => void;
  [key: string]: any;
}

export interface WorkflowAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'csv' | 'image' | 'video' | 'audio' | 'zip' | 'code';
  url?: string;
  uploadedAt: string;
  syncStatus: 'synced' | 'uploading' | 'error';
}

export interface ExecutionLog {
  id: string;
  nodeId: string;
  nodeName: string;
  timestamp: string;
  status: 'info' | 'running' | 'success' | 'error' | 'warning';
  message: string;
  input?: any;
  output?: any;
  tokens?: number;
  costEstimate?: number;
  durationMs?: number;
}

export interface ApiSecret {
  id: string;
  name: string;
  keyPrefix: string;
  service: string;
  updatedAt: string;
  isConfigured: boolean;
  status: 'active' | 'untested' | 'failed';
}

export interface WorkflowVersion {
  id: string;
  versionNumber: number;
  label: string;
  description: string;
  timestamp: string;
  author: string;
  nodesCount: number;
  edgesCount: number;
  snapshot: {
    nodes: any[];
    edges: any[];
  };
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Enterprise';
  icon: string;
  tags: string[];
  nodes: any[];
  edges: any[];
}
