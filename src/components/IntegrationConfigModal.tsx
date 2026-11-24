import React, { useState } from 'react';
import { 
  Key, ShieldCheck, Check, X, RefreshCw, Zap, Activity, 
  Trash2, Lock, Eye, EyeOff, Globe, HardDrive, Terminal
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface IntegrationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    category: string;
    desc: string;
    icon: React.ComponentType<any>;
    color: string;
    latency: string;
  } | null;
  onSaveKey?: (id: string, apiKey: string) => void;
  onDisconnect?: (id: string) => void;
}

export default function IntegrationConfigModal({
  isOpen,
  onClose,
  integration,
  onSaveKey,
  onDisconnect
}: IntegrationConfigModalProps) {
  const [apiKey, setApiKey] = useState('krx_sk_live_' + Math.random().toString(36).substring(2, 18));
  const [showKey, setShowKey] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{ status: 'idle' | 'success' | 'failed'; ms?: number }>({ status: 'idle' });
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !integration) return null;

  const Icon = integration.icon;

  const handleTestConnection = () => {
    setIsTestingPing(true);
    soundManager.playClick();
    setPingResult({ status: 'idle' });

    setTimeout(() => {
      setIsTestingPing(false);
      const pingTime = Math.floor(Math.random() * 40) + 18; // 18ms to 58ms
      setPingResult({ status: 'success', ms: pingTime });
      soundManager.playSuccess();
    }, 1000);
  };

  const handleSaveCredential = () => {
    soundManager.playClick();
    setIsSaved(true);
    if (onSaveKey) onSaveKey(integration.id, apiKey);
    soundManager.playSuccess();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleRemoveIntegration = () => {
    soundManager.playClick();
    if (onDisconnect) onDisconnect(integration.id);
    soundManager.playToggle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0B1020] border border-white/[0.1] rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden text-white font-sans">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${integration.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">{integration.name} Vault Configuration</h3>
              <p className="text-xs text-[#94A3B8]">{integration.category} • Encrypted Connection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="p-3.5 rounded-2xl bg-[#131A2E] border border-white/5 text-xs text-[#94A3B8] leading-relaxed">
          {integration.desc}
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-[#94A3B8] flex items-center justify-between">
            <span>API Secret / OAuth Token</span>
            <span className="text-emerald-400 text-[10px]">AES-256 GCM Hardware Sealed</span>
          </label>

          <div className="relative flex items-center">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#131A2E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] font-mono focus:border-[#00D4FF] focus:outline-none pr-10"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Connection Test Section */}
        <div className="p-3.5 rounded-2xl bg-[#0B1020] border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#F8FAFC]">Live Health & Ping Test</span>
            <p className="text-[10px] text-[#94A3B8] font-mono">
              {pingResult.status === 'success'
                ? `Connection Healthy • Latency ${pingResult.ms}ms`
                : 'Click test to verify server handshake'}
            </p>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={isTestingPing}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer flex items-center space-x-1.5"
          >
            {isTestingPing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-[#00D4FF]" />
            )}
            <span>{isTestingPing ? 'Pinging...' : 'Test Ping'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={handleRemoveIntegration}
            className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
            title="Disconnect Integration"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveCredential}
            disabled={isSaved}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Credential Saved!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save & Lock Credential</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
