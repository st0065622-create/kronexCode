import React from 'react';
import { Settings, Moon, Sun, Type, Eye, Sliders } from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { ThemeMode } from './types';
import { soundManager } from '../../utils/sound';

export default function SidebarSettings() {
  const { settings, updateSettings } = useKronexStore();

  const themeOptions: { id: ThemeMode; label: string; previewColor: string }[] = [
    { id: 'kronex-dark', label: 'Kronex Dark (Default)', previewColor: 'bg-[#080d1a]' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', previewColor: 'bg-[#120024]' },
    { id: 'amoled', label: 'AMOLED Pure Black', previewColor: 'bg-[#000000]' },
    { id: 'light-glass', label: 'Light Glass', previewColor: 'bg-[#f1f5f9]' },
  ];

  return (
    <div className="p-3 space-y-4 text-xs font-sans text-white select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-mono text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
          IDE Preferences
        </span>
      </div>

      {/* Theme Picker */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold">
          Color Theme
        </span>

        <div className="space-y-1.5">
          {themeOptions.map(t => (
            <button
              key={t.id}
              onClick={() => {
                soundManager.playClick();
                updateSettings({ theme: t.id });
              }}
              className={`w-full p-2.5 rounded-xl flex items-center justify-between border text-xs font-mono transition-all cursor-pointer ${
                settings.theme === t.id
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <span>{t.label}</span>
              <span className={`w-3.5 h-3.5 rounded-full border border-white/20 ${t.previewColor}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Font Size & Tab Size */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-zinc-300">Font Size ({settings.fontSize}px)</span>
          <input
            type="range"
            min="12"
            max="20"
            value={settings.fontSize}
            onChange={e => updateSettings({ fontSize: Number(e.target.value) })}
            className="w-24 accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-zinc-300">Tab Size</span>
          <select
            value={settings.tabSize}
            onChange={e => updateSettings({ tabSize: Number(e.target.value) })}
            className="bg-black border border-white/20 rounded-lg px-2 py-1 text-xs text-cyan-400 font-mono outline-none cursor-pointer"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-zinc-300">Minimap Display</span>
          <input
            type="checkbox"
            checked={settings.minimap}
            onChange={e => updateSettings({ minimap: e.target.checked })}
            className="w-4 h-4 accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-zinc-300">Word Wrap</span>
          <input
            type="checkbox"
            checked={settings.wordWrap === 'on'}
            onChange={e => updateSettings({ wordWrap: e.target.checked ? 'on' : 'off' })}
            className="w-4 h-4 accent-cyan-400 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-zinc-300">Auto Save Changes</span>
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={e => updateSettings({ autoSave: e.target.checked })}
            className="w-4 h-4 accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
