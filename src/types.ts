export interface Course {
  id: string;
  title: string;
  category: 'AI' | 'Prompting' | 'Python' | 'JavaScript' | 'Design' | 'Marketing' | 'Business';
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  students: number;
  image: string;
  description: string;
  curriculum: string[];
}

export interface Tutorial {
  id: string;
  title: string;
  category: 'Prompting' | 'Python' | 'JavaScript' | 'Machine Learning';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string;
  initialCode: string;
  expectedInput?: string; // For prompt engineering
  solutionTemplate: string;
  expectedOutputRegex: string; // regex pattern to validate output
  feedbackSuccess: string;
  feedbackFailure: string;
  hints: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'Guide' | 'Cheat Sheet' | 'Video' | 'Template';
  category: string;
  description: string;
  downloadUrl?: string;
  readingTime?: string;
}

export interface ForumComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  isMentor?: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: 'General' | 'Python' | 'Prompt Engineering' | 'UI/UX Design' | 'Job Hunt' | 'Showcase';
  likes: number;
  hasLiked?: boolean;
  replies: ForumComment[];
  createdAt: string;
  isPinned?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
  target: number;
  current: number;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  chunksCount: number;
}

export interface AgentMemoryItem {
  id: string;
  key: string;
  value: string;
  category: string;
  updatedAt: string;
}

export interface AgentTask {
  id: string;
  title: string;
  status: 'completed' | 'running' | 'scheduled' | 'failed';
  schedule?: string;
  lastRun?: string;
}

export interface AgentAutomation {
  id: string;
  name: string;
  trigger: string;
  target: string;
  status: 'active' | 'paused';
}

export interface AgentIntegration {
  id: string;
  name: string;
  provider: string;
  category: string;
  iconName: string;
  description: string;
  connected: boolean;
  apiKey: string;
  status: 'connected' | 'standby' | 'error' | 'disconnected';
  latencyMs: number;
  totalCalls: number;
  tokensUsed: number;
  lastTested?: string;
}

export interface AgentWorkflowRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  schedule: string;
  status: 'active' | 'paused';
  logs: Array<{ timestamp: string; status: 'success' | 'failed' | 'running'; message: string }>;
}

export interface MultiAgentTeam {
  id: string;
  name: string;
  description: string;
  agentIds: string[];
  roles: Record<string, string>; // agentId -> role description
  sharedMemory: AgentMemoryItem[];
  status: 'idle' | 'collaborating' | 'completed';
}

export interface AIAgent {
  id: string;
  name: string;
  avatar: string;
  coverBanner?: string;
  description: string;
  category: 'Coding' | 'Research' | 'Voice Tutor' | 'Automation' | 'Creative' | 'Data' | 'General';
  systemPrompt: string;
  personality: 'Professional' | 'Friendly' | 'Teacher' | 'Developer' | 'Assistant' | 'Sovereign' | 'Creative';
  model: 'OpenAI' | 'Gemini' | 'Claude' | 'Grok' | 'DeepSeek' | 'Mistral' | 'Perplexity' | 'OpenRouter';
  temperature: number;
  memoryEnabled: boolean;
  capabilities: {
    memory: boolean;
    webSearch: boolean;
    vision: boolean;
    voice: boolean;
    fileAnalysis: boolean;
    imageGen: boolean;
    codeExecution: boolean;
    automation: boolean;
    apiCalls: boolean;
  };
  voiceSettings: {
    wakeWord: string;
    voiceName: string;
    pushToTalk: boolean;
    speechRate: number;
    speechPitch: number;
  };
  knowledgeFiles: KnowledgeFile[];
  tools: Array<'web_search' | 'calculator' | 'image_gen' | 'code_interpreter' | 'browser' | 'n8n_webhook' | 'sql_database'>;
  apiKey?: string;
  status: 'active' | 'idle' | 'training';
  createdAt: string;
  memoryItems: AgentMemoryItem[];
  tasks: AgentTask[];
  automations: AgentAutomation[];
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  unlockedAchievements: string[];
  savedResources: string[];
  registeredCourses: string[];
}

