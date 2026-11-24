export interface FileItem {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isFolder: boolean;
  parentId: string | null;
  isOpen?: boolean;
  isUnsaved?: boolean;
}

export type ActivityTab = 
  | 'explorer' 
  | 'search' 
  | 'git' 
  | 'extensions' 
  | 'rest' 
  | 'database' 
  | 'performance' 
  | 'copilot' 
  | 'settings';

export type BottomTab = 'terminal' | 'problems' | 'output' | 'debug' | 'preview' | 'ai-assistant';

export type ThemeMode = 'kronex-dark' | 'cyberpunk' | 'amoled' | 'light-glass';

export interface EditorSettings {
  theme: ThemeMode;
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  autoSave: boolean;
  formatOnSave: boolean;
  lineNumbers: 'on' | 'off';
  fontFamily: string;
}

export interface GitCommit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  branch: string;
}

export interface ExtensionItem {
  id: string;
  name: string;
  publisher: string;
  description: string;
  version: string;
  downloads: string;
  rating: number;
  installed: boolean;
  icon: string;
}

export interface RestRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: { key: string; value: string }[];
  body: string;
  response?: {
    status: number;
    statusText: string;
    time: number;
    size: string;
    data: any;
  };
}

export interface DbTable {
  name: string;
  rowCount: number;
  columns: { name: string; type: string; pk?: boolean }[];
  rows: any[];
}
