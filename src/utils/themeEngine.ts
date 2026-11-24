export interface ThemePreset {
  id: string;
  name: string;
  icon: string;
  tag: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  surface: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  glow: string;
  isDark: boolean;
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  dark: {
    id: 'dark',
    name: 'Dark Void',
    icon: '🌙',
    tag: 'Default',
    primary: '#7C3AED',
    secondary: '#22D3EE',
    accent: '#00FFA3',
    bg: '#0B1020',
    surface: '#111827',
    card: 'rgba(17, 24, 39, 0.85)',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    border: 'rgba(255, 255, 255, 0.1)',
    glow: 'rgba(0, 212, 255, 0.3)',
    isDark: true
  },
  light: {
    id: 'light',
    name: 'Crisp Light',
    icon: '☀',
    tag: 'Clean',
    primary: '#6366F1',
    secondary: '#0284C7',
    accent: '#10B981',
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    border: 'rgba(15, 23, 42, 0.12)',
    glow: 'rgba(99, 102, 241, 0.2)',
    isDark: false
  },
  amoled: {
    id: 'amoled',
    name: 'AMOLED Black',
    icon: '⚡',
    tag: 'OLED Saver',
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    accent: '#10B981',
    bg: '#000000',
    surface: '#050505',
    card: 'rgba(10, 10, 10, 0.95)',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    border: 'rgba(255, 255, 255, 0.18)',
    glow: 'rgba(139, 92, 246, 0.45)',
    isDark: true
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    icon: '🤖',
    tag: 'High Voltage',
    primary: '#FF0055',
    secondary: '#00F0FF',
    accent: '#FFE600',
    bg: '#0A0A10',
    surface: '#12121C',
    card: 'rgba(24, 24, 38, 0.9)',
    textPrimary: '#FFFFFF',
    textSecondary: '#00F0FF',
    border: 'rgba(0, 240, 255, 0.35)',
    glow: 'rgba(255, 0, 85, 0.5)',
    isDark: true
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora Borealis',
    icon: '✨',
    tag: 'Teal & Emerald',
    primary: '#10B981',
    secondary: '#06B6D4',
    accent: '#A855F7',
    bg: '#031716',
    surface: '#082826',
    card: 'rgba(13, 56, 53, 0.85)',
    textPrimary: '#F0FDF4',
    textSecondary: '#A7F3D0',
    border: 'rgba(16, 185, 129, 0.25)',
    glow: 'rgba(16, 185, 129, 0.4)',
    isDark: true
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    icon: '🌌',
    tag: 'Deep Space',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#38BDF8',
    bg: '#070F26',
    surface: '#0D1B3E',
    card: 'rgba(19, 37, 84, 0.85)',
    textPrimary: '#F0F6FF',
    textSecondary: '#93C5FD',
    border: 'rgba(59, 130, 246, 0.2)',
    glow: 'rgba(59, 130, 246, 0.35)',
    isDark: true
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Abyss',
    icon: '🌊',
    tag: 'Aquamarine',
    primary: '#06B6D4',
    secondary: '#0284C7',
    accent: '#2DD4BF',
    bg: '#041C24',
    surface: '#0A2B36',
    card: 'rgba(16, 59, 74, 0.85)',
    textPrimary: '#ECFEFF',
    textSecondary: '#67E8F9',
    border: 'rgba(6, 182, 212, 0.25)',
    glow: 'rgba(6, 182, 212, 0.4)',
    isDark: true
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Twilight',
    icon: '🌆',
    tag: 'Crimson Amber',
    primary: '#F43F5E',
    secondary: '#F97316',
    accent: '#A855F7',
    bg: '#1A0910',
    surface: '#2B101D',
    card: 'rgba(61, 23, 43, 0.85)',
    textPrimary: '#FFF1F2',
    textSecondary: '#FECDD3',
    border: 'rgba(244, 63, 94, 0.25)',
    glow: 'rgba(244, 63, 94, 0.4)',
    isDark: true
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Terminal',
    icon: '🟢',
    tag: 'Phosphor',
    primary: '#22C55E',
    secondary: '#10B981',
    accent: '#A3E635',
    bg: '#030F08',
    surface: '#081C10',
    card: 'rgba(13, 43, 25, 0.88)',
    textPrimary: '#DCFCE7',
    textSecondary: '#86EFAC',
    border: 'rgba(34, 197, 94, 0.3)',
    glow: 'rgba(34, 197, 94, 0.5)',
    isDark: true
  },
  galaxy: {
    id: 'galaxy',
    name: 'Purple Galaxy',
    icon: '🔮',
    tag: 'Cosmic Nebula',
    primary: '#C084FC',
    secondary: '#E879F9',
    accent: '#38BDF8',
    bg: '#12091F',
    surface: '#1D1030',
    card: 'rgba(43, 23, 69, 0.85)',
    textPrimary: '#FAF5FF',
    textSecondary: '#E9D5FF',
    border: 'rgba(192, 132, 252, 0.25)',
    glow: 'rgba(192, 132, 252, 0.45)',
    isDark: true
  }
};

export interface ThemeSettings {
  presetId: string;
  brightness: number; // 50 - 150
  customAccent: string | null; // Hex or null if preset
  glassBlur: number; // 8 - 40
  glowIntensity: number; // 0 - 100
  borderRadius: number; // 0 - 24
  fontSize: number; // 90 - 110
  animationSpeed: number; // 0.5 - 2.0
  reduceMotion: boolean;
  particleEffects: boolean;
  backgroundGrid: boolean;
  cursorEffects: boolean;
  dynamicLighting: boolean;
  smartAutoMode: boolean;
}

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  presetId: 'dark',
  brightness: 100,
  customAccent: null,
  glassBlur: 24,
  glowIntensity: 80,
  borderRadius: 16,
  fontSize: 100,
  animationSpeed: 1.0,
  reduceMotion: false,
  particleEffects: true,
  backgroundGrid: true,
  cursorEffects: true,
  dynamicLighting: true,
  smartAutoMode: false,
};

export function applyThemeToDOM(settings: ThemeSettings) {
  const root = document.documentElement;
  const body = document.body;
  const preset = THEME_PRESETS[settings.presetId] || THEME_PRESETS.dark;

  // Primary / Accent colors
  const primaryColor = settings.customAccent || preset.primary;

  // Apply CSS custom variables
  root.style.setProperty('--color-brand-primary', primaryColor);
  root.style.setProperty('--color-brand-secondary', preset.secondary);
  root.style.setProperty('--color-brand-accent', preset.accent);
  root.style.setProperty('--color-brand-background', preset.bg);
  root.style.setProperty('--color-brand-surface', preset.surface);
  root.style.setProperty('--color-brand-text-primary', preset.textPrimary);
  root.style.setProperty('--color-brand-text-secondary', preset.textSecondary);
  root.style.setProperty('--color-premium-border', preset.border);
  root.style.setProperty('--color-premium-card', preset.card);
  root.style.setProperty('--glass-blur', `${settings.glassBlur}px`);
  root.style.setProperty('--border-radius-custom', `${settings.borderRadius}px`);
  root.style.setProperty('--font-scale', `${settings.fontSize / 100}`);
  root.style.setProperty('--glow-opacity', `${settings.glowIntensity / 100}`);

  // Apply Filter Brightness on Root or Body
  root.style.filter = settings.brightness !== 100 ? `brightness(${settings.brightness}%)` : 'none';

  // Toggle class names for legacy styling compatibility
  if (!preset.isDark) {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme', 'amoled-theme');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    if (settings.presetId === 'amoled') {
      body.classList.add('amoled-theme');
    } else {
      body.classList.remove('amoled-theme');
    }
  }

  // Set dataset attributes for target selectors
  root.setAttribute('data-theme', settings.presetId);
  root.setAttribute('data-reduce-motion', settings.reduceMotion ? 'true' : 'false');

  // Background style application
  body.style.backgroundColor = preset.bg;
  body.style.color = preset.textPrimary;
}

export function getSavedThemeSettings(): ThemeSettings {
  try {
    const raw = localStorage.getItem('kronex_theme_settings_v2');
    if (raw) {
      return { ...DEFAULT_THEME_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse theme settings from localStorage:', e);
  }
  return DEFAULT_THEME_SETTINGS;
}

export function saveThemeSettings(settings: ThemeSettings) {
  try {
    localStorage.setItem('kronex_theme_settings_v2', JSON.stringify(settings));
    localStorage.setItem('kronex_theme', settings.presetId === 'light' ? 'light' : 'dark');
  } catch (e) {
    console.warn('Failed to save theme settings:', e);
  }
}
