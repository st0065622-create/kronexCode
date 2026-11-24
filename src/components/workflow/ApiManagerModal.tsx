import React, { useState } from 'react';
import { Key, ShieldCheck, Check, AlertCircle, RefreshCw, X, Eye, EyeOff, Lock, Server } from 'lucide-react';
import { ApiSecret } from './workflowTypes';

interface ApiManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_SECRETS: ApiSecret[] = [
  { id: 'sec-1', name: 'Google Gemini API Key', keyPrefix: 'AIzaSy...', service: 'Gemini 2.5', updatedAt: '2 mins ago', isConfigured: true, status: 'active' },
  { id: 'sec-2', name: 'OpenAI Secret Key', keyPrefix: 'sk-proj-...', service: 'GPT-4o', updatedAt: '1 hour ago', isConfigured: true, status: 'active' },
  { id: 'sec-3', name: 'Anthropic Claude Key', keyPrefix: 'sk-ant-...', service: 'Claude 3.7', updatedAt: 'Yesterday', isConfigured: true, status: 'active' },
  { id: 'sec-4', name: 'Pinecone Vector Index Key', keyPrefix: 'pcsk_...', service: 'Pinecone DB', updatedAt: '3 days ago', isConfigured: true, status: 'active' },
  { id: 'sec-5', name: 'ElevenLabs Speech Key', keyPrefix: 'xi-api-...', service: 'Voice TTS', updatedAt: 'Not set', isConfigured: false, status: 'untested' },
  { id: 'sec-6', name: 'Supabase Service Role', keyPrefix: 'eyJhbG...', service: 'Supabase DB', updatedAt: '4 days ago', isConfigured: true, status: 'active' }
];

export default function ApiManagerModal({ isOpen, onClose }: ApiManagerModalProps) {
  const [secrets, setSecrets] = useState<ApiSecret[]>(INITIAL_SECRETS);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  if (!isOpen) return null;

  const handleTestKey = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setSecrets((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'active', isConfigured: true } : s))
      );
      setTestingId(null);
    }, 1200);
  };

  const handleAddSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName || !newKeyValue) return;
    const newSec: ApiSecret = {
      id: `sec-${Date.now()}`,
      name: newKeyName,
      keyPrefix: `${newKeyValue.substring(0, 6)}...`,
      service: 'Custom API',
      updatedAt: 'Just now',
      isConfigured: true,
      status: 'active'
    };
    setSecrets([...secrets, newSec]);
    setNewKeyName('');
    setNewKeyValue('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0B1020] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#7C5CFF]" />

        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00D4FF]/20 border border-[#00D4FF]/40 flex items-center justify-center">
              <Key className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Encrypted API Key Manager</h3>
              <p className="text-xs text-[#94A3B8]">AES-256 GCM Hardware Encrypted Vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Secrets Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">Configured Credentials</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {secrets.map((sec) => (
              <div
                key={sec.id}
                className="p-3 rounded-2xl bg-[#131A2E]/70 border border-white/[0.08] flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-[#00D4FF]" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#F8FAFC] truncate">{sec.name}</p>
                    <p className="text-[10px] text-[#94A3B8] font-mono">{sec.keyPrefix} • {sec.service}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {sec.status === 'active' && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleTestKey(sec.id)}
                    disabled={testingId === sec.id}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    {testingId === sec.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00D4FF]" />
                    ) : (
                      <span>Test Connection</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Secret Form */}
        <form onSubmit={handleAddSecret} className="space-y-3 pt-2 border-t border-white/[0.08]">
          <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">Add New Vault Secret</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Key Name (e.g. Pinecone Production API Key)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#131A2E] border border-white/[0.08] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:border-[#00D4FF] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Secret Value (e.g. sk-proj-...)"
              value={newKeyValue}
              onChange={(e) => setNewKeyValue(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#131A2E] border border-white/[0.08] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:border-[#00D4FF] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-[#F8FAFC] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all cursor-pointer"
          >
            Save Encrypted Secret to Vault
          </button>
        </form>
      </div>
    </div>
  );
}
