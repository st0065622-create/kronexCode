import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Sun, Moon, Zap, Shield, RefreshCw, X, Sliders, Check, 
  Palette, Eye, Activity, BatteryCharging, Clock, Laptop, Gauge, 
  Layers, MousePointer, Cpu, Volume2, Radio
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import { 
  THEME_PRESETS, 
  ThemeSettings, 
  DEFAULT_THEME_SETTINGS, 
  applyThemeToDOM, 
  saveThemeSettings, 
  getSavedThemeSettings 
} from '../utils/themeEngine';

interface ThemeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChanged?: (presetId: string) => void;
}

export default function ThemeStudioModal({ isOpen, onClose, onThemeChanged }: ThemeStudioModalProps) {
  const [settings, setSettings] = useState<ThemeSettings>(getSavedThemeSettings());
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'effects' | 'smart'>('presets');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState<boolean | null>(null);
  const [systemDarkMode, setSystemDarkMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync settings with DOM on open/change
  useEffect(() => {
    applyThemeToDOM(settings);
    saveThemeSettings(settings);
    if (onThemeChanged) onThemeChanged(settings.presetId);
  }, [settings]);

  // Read Battery API and System Theme
  useEffect(() => {
    // System color scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDarkMode(mediaQuery.matches);
    const handleMediaChange = (e: MediaQueryListEvent) => setSystemDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    // Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        setBatteryLevel(Math.round(batt.level * 100));
        setBatteryCharging(batt.charging);

        batt.addEventListener('levelchange', () => setBatteryLevel(Math.round(batt.level * 100)));
        batt.addEventListener('chargingchange', () => setBatteryCharging(batt.charging));
      }).catch(() => {});
    }

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Handle Smart AI Auto Theme calculation
  useEffect(() => {
    if (!settings.smartAutoMode) return;

    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour < 6;

    let targetPreset = 'dark';
    if (batteryLevel !== null && batteryLevel < 20 && !batteryCharging) {
      targetPreset = 'amoled'; // Auto switch to AMOLED Black for power saving
    } else if (!isNight && !systemDarkMode) {
      targetPreset = 'light';
    } else if (isNight) {
      targetPreset = 'galaxy';
    }

    if (targetPreset !== settings.presetId) {
      updateSetting('presetId', targetPreset);
      showToast(`Smart AI switched theme to ${THEME_PRESETS[targetPreset].name}`);
    }
  }, [settings.smartAutoMode, batteryLevel, batteryCharging, systemDarkMode]);

  const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      applyThemeToDOM(next);
      saveThemeSettings(next);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectPreset = (presetId: string) => {
    soundManager.playClick();
    updateSetting('presetId', presetId);
    updateSetting('customAccent', null); // Reset custom accent on preset switch
    soundManager.playSuccess();
    showToast(`Applied ${THEME_PRESETS[presetId].name} Theme`);
  };

  const handleResetDefaults = () => {
    soundManager.playClick();
    setSettings(DEFAULT_THEME_SETTINGS);
    applyThemeToDOM(DEFAULT_THEME_SETTINGS);
    saveThemeSettings(DEFAULT_THEME_SETTINGS);
    soundManager.playToggle();
    showToast('Theme Settings Reset to Default');
  };

  if (!isOpen) return null;

  const currentPreset = THEME_PRESETS[settings.presetId] || THEME_PRESETS.dark;

  const accentSwatches = [
    { label: 'Cyan', color: '#00D4FF' },
    { label: 'Violet', color: '#7C5CFF' },
    { label: 'Emerald', color: '#00FFA3' },
    { label: 'Pink', color: '#FF007A' },
    { label: 'Gold', color: '#FACC15' },
    { label: 'Sapphire', color: '#3B82F6' },
  ];

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl bg-[#080D1A] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative overflow-hidden text-white font-sans my-auto max-h-[90vh] flex flex-col"
      >
        {/* Ambient Glow Gradient Header */}
        <div 
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-40 transition-colors duration-500"
          style={{ background: currentPreset.primary }}
        />
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-30 transition-colors duration-500"
          style={{ background: currentPreset.secondary }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5 shrink-0 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg relative overflow-hidden transition-all duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${currentPreset.primary}30, ${currentPreset.secondary}20)`,
                borderColor: `${currentPreset.primary}60`
              }}
            >
              <Sparkles className="w-6 h-6 animate-pulse" style={{ color: currentPreset.primary }} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-display font-extrabold text-white tracking-wide">
                  Theme Studio
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-400/10 border border-cyan-400/30 text-[#00D4FF]">
                  AI Engine 2.5
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Customize KRONEX AI look, glassmorphism, accent lighting, & smart auto-theme
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetDefaults}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-mono flex items-center space-x-1.5 border border-white/5"
              title="Reset all settings to default"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => { soundManager.playClick(); onClose(); }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-white/[0.08] py-3 overflow-x-auto no-scrollbar shrink-0 relative z-10">
          <button
            onClick={() => { soundManager.playClick(); setActiveTab('presets'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'presets' 
                ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white shadow-lg' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme Presets (10)</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('custom'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'custom' 
                ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white shadow-lg' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Visual Adjustments</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('effects'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'effects' 
                ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white shadow-lg' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>FX & Toggles</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('smart'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'smart' 
                ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white shadow-lg' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Smart AI Theme</span>
            {settings.smartAutoMode && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="py-5 overflow-y-auto flex-1 pr-1 space-y-6 relative z-10 custom-scrollbar">
          
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Select Theme Atmosphere
                </span>
                <span className="text-[11px] text-cyan-400 font-mono">
                  Active: {currentPreset.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {Object.values(THEME_PRESETS).map((preset) => {
                  const isSelected = settings.presetId === preset.id;
                  return (
                    <motion.div
                      key={preset.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected 
                          ? 'border-[#00D4FF] bg-white/[0.08] shadow-[0_0_25px_rgba(0,212,255,0.25)]' 
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                      }`}
                    >
                      {/* Top Bar Preview */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{preset.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                              {preset.name}
                            </h4>
                            <span className="text-[10px] font-mono text-zinc-400 block">
                              {preset.tag}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#00D4FF] text-black flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Color Palette Swatches Preview */}
                      <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                        <div className="w-5 h-5 rounded-lg border border-white/10 shadow-inner" style={{ background: preset.bg }} title="Background" />
                        <div className="w-5 h-5 rounded-lg border border-white/10 shadow-inner" style={{ background: preset.surface }} title="Surface" />
                        <div className="w-5 h-5 rounded-lg border border-white/10 shadow-inner" style={{ background: preset.primary }} title="Primary Accent" />
                        <div className="w-5 h-5 rounded-lg border border-white/10 shadow-inner" style={{ background: preset.secondary }} title="Secondary" />
                        <div className="w-5 h-5 rounded-lg border border-white/10 shadow-inner" style={{ background: preset.accent }} title="Glow Accent" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL ADJUSTMENTS */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              
              {/* Custom Accent Color Swatches */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-[#00D4FF]" />
                    <span>Accent Highlight Tint</span>
                  </label>
                  {settings.customAccent && (
                    <button
                      onClick={() => updateSetting('customAccent', null)}
                      className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                    >
                      Use Preset Accent
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {accentSwatches.map((swatch) => (
                    <button
                      key={swatch.color}
                      onClick={() => {
                        soundManager.playClick();
                        updateSetting('customAccent', swatch.color);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                        settings.customAccent === swatch.color 
                          ? 'border-white bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                          : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ background: swatch.color }} />
                      <span>{swatch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Brightness Slider */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Canvas Brightness</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">{settings.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    step="5"
                    value={settings.brightness}
                    onChange={(e) => updateSetting('brightness', parseInt(e.target.value))}
                    className="w-full accent-[#00D4FF] cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-500">Adjust overall display luminance filter</p>
                </div>

                {/* Glass Blur Slider */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>Backdrop Glass Blur</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400">{settings.glassBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="40"
                    step="2"
                    value={settings.glassBlur}
                    onChange={(e) => updateSetting('glassBlur', parseInt(e.target.value))}
                    className="w-full accent-[#00D4FF] cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-500">Frosted glass filter intensity across panels</p>
                </div>

                {/* Glow Intensity Slider */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span>Neon Glow Intensity</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-400">{settings.glowIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={settings.glowIntensity}
                    onChange={(e) => updateSetting('glowIntensity', parseInt(e.target.value))}
                    className="w-full accent-[#7C5CFF] cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-500">Ambient box shadow & lighting aura strength</p>
                </div>

                {/* Border Radius Slider */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Border Corner Radius</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{settings.borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={settings.borderRadius}
                    onChange={(e) => updateSetting('borderRadius', parseInt(e.target.value))}
                    className="w-full accent-[#00FFA3] cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-500">Global component curvature scale</p>
                </div>

                {/* Font Size Slider */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 flex items-center space-x-2">
                      <Gauge className="w-4 h-4 text-blue-400" />
                      <span>Typography Scaling</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-400">{settings.fontSize}%</span>
                  </div>
                  <input
                    type="range"
                    min="90"
                    max="110"
                    step="2"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-500">Interface text density scaling factor</p>
                </div>

                {/* Animation Speed Selector */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-rose-400" />
                      <span>Motion Speed Scale</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-400">{settings.animationSpeed}x</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => updateSetting('animationSpeed', speed)}
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                          settings.animationSpeed === speed 
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: FX & TOGGLES */}
          {activeTab === 'effects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Toggle: Particle Effects */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>ASMR Ambient Node Particles</span>
                  </h4>
                  <p className="text-[10px] text-zinc-400">Floating neural connections and star dust particles</p>
                </div>
                <button
                  onClick={() => {
                    soundManager.playToggle();
                    updateSetting('particleEffects', !settings.particleEffects);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.particleEffects ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.particleEffects ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle: Background Grid */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Perspective Grid Matrix</span>
                  </h4>
                  <p className="text-[10px] text-zinc-400">Futuristic cybernetic grid lines background</p>
                </div>
                <button
                  onClick={() => {
                    soundManager.playToggle();
                    updateSetting('backgroundGrid', !settings.backgroundGrid);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.backgroundGrid ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.backgroundGrid ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle: Cursor Follower */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                    <MousePointer className="w-4 h-4 text-emerald-400" />
                    <span>Mouse Cursor Glow Follower</span>
                  </h4>
                  <p className="text-[10px] text-zinc-400">Interactive radial neon lighting following cursor</p>
                </div>
                <button
                  onClick={() => {
                    soundManager.playToggle();
                    updateSetting('cursorEffects', !settings.cursorEffects);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.cursorEffects ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.cursorEffects ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle: Dynamic Lighting Orbs */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-amber-400" />
                    <span>Dynamic Ambient Lighting</span>
                  </h4>
                  <p className="text-[10px] text-zinc-400">Reactive aurora gradients glowing behind active windows</p>
                </div>
                <button
                  onClick={() => {
                    soundManager.playToggle();
                    updateSetting('dynamicLighting', !settings.dynamicLighting);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.dynamicLighting ? 'bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.dynamicLighting ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle: Reduce Motion */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between md:col-span-2">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-rose-400" />
                    <span>Accessibility: Reduce Motion & Low Power Mode</span>
                  </h4>
                  <p className="text-[10px] text-zinc-400">Disables heavy CSS keyframe animations for ultra-fast performance</p>
                </div>
                <button
                  onClick={() => {
                    soundManager.playToggle();
                    updateSetting('reduceMotion', !settings.reduceMotion);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.reduceMotion ? 'bg-rose-500' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.reduceMotion ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: SMART AI AUTO THEME */}
          {activeTab === 'smart' && (
            <div className="space-y-5">
              
              {/* Smart Mode Master Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Cpu className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Smart Environmental Auto-Theme</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Automatically morphs theme based on daylight, battery saver level, and system settings
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playToggle();
                    updateSetting('smartAutoMode', !settings.smartAutoMode);
                  }}
                  className={`w-14 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    settings.smartAutoMode ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/10'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.smartAutoMode ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Environmental Diagnostics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Time Check */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Time of Day</span>
                  </span>
                  <p className="text-sm font-bold text-white">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {new Date().getHours() >= 19 || new Date().getHours() < 6 ? 'Night Schedule (Dark Mode)' : 'Daylight Schedule (Light Mode)'}
                  </p>
                </div>

                {/* Battery Status */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center space-x-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Battery Status</span>
                  </span>
                  <p className="text-sm font-bold text-white">
                    {batteryLevel !== null ? `${batteryLevel}% ${batteryCharging ? '(Charging)' : ''}` : 'Hardware Unreadable'}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {batteryLevel !== null && batteryLevel < 20 ? 'Low Battery: AMOLED Black Triggered' : 'Normal Power Reserve'}
                  </p>
                </div>

                {/* System Preference */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase flex items-center space-x-1">
                    <Laptop className="w-3.5 h-3.5 text-purple-400" />
                    <span>System Sync</span>
                  </span>
                  <p className="text-sm font-bold text-white">
                    {systemDarkMode ? 'System Dark Mode' : 'System Light Mode'}
                  </p>
                  <p className="text-[10px] text-zinc-500">OS Level Appearance Preference</p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-[#00D4FF] text-black font-mono font-bold text-xs shadow-[0_0_20px_rgba(0,212,255,0.6)] flex items-center space-x-2 z-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between shrink-0 relative z-10 text-xs text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              Live Theme GPU Accelerated
            </span>
          </div>

          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all cursor-pointer"
          >
            Done & Apply
          </button>
        </div>

      </motion.div>
    </div>
  );
}
