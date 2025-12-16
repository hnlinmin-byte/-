import React from 'react';
import { MoodType, MOODS, Language, MOOD_LABELS, Theme, THEMES, TEXT_COLORS } from '../types';
import { SparklesIcon, LanguageIcon, PaintBrushIcon, AdjustmentsHorizontalIcon, ArrowsRightLeftIcon, SwatchIcon } from '@heroicons/react/24/solid';

interface ControlsProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onGenerate: () => void;
  isLoading: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  overlayOpacity: number;
  onOverlayOpacityChange: (opacity: number) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  currentMood, 
  onMoodChange, 
  currentTheme,
  onThemeChange,
  onGenerate, 
  isLoading,
  language,
  onLanguageChange,
  overlayOpacity,
  onOverlayOpacityChange,
  textColor,
  onTextColorChange
}) => {
  
  const t = {
    selectVibe: language === 'zh' ? '选择心情' : 'Select Vibe',
    selectTheme: language === 'zh' ? '选择背景' : 'Select Theme',
    random: language === 'zh' ? '随机' : 'Shuffle',
    opacity: language === 'zh' ? '背景遮罩浓度' : 'Overlay Intensity',
    textColor: language === 'zh' ? '字体颜色' : 'Text Color',
    button: language === 'zh' ? (isLoading ? '正在生成...' : '生成新的问候') : (isLoading ? 'Creating Magic...' : 'Generate New Greeting'),
  };

  const handleRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * THEMES.length);
    onThemeChange(THEMES[randomIndex]);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      
      {/* Top Bar: Language Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
          className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/90 text-xs font-medium transition-colors backdrop-blur-sm"
        >
          <LanguageIcon className="w-4 h-4" />
          <span>{language === 'zh' ? 'EN / 中文' : '中文 / EN'}</span>
        </button>
      </div>

      {/* Mood Selector */}
      <div className="space-y-3">
        <label className="text-white/80 text-sm font-medium tracking-wide uppercase ml-1 flex items-center space-x-1">
          <SparklesIcon className="w-4 h-4 opacity-70" />
          <span>{t.selectVibe}</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => onMoodChange(mood)}
              disabled={isLoading}
              className={`
                py-2 px-1 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
                ${currentMood === mood
                  ? 'bg-white text-orange-600 shadow-lg scale-105 ring-2 ring-orange-300/50'
                  : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {MOOD_LABELS[language][mood]}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selector */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <label className="text-white/80 text-sm font-medium tracking-wide uppercase flex items-center space-x-1">
            <PaintBrushIcon className="w-4 h-4 opacity-70" />
            <span>{t.selectTheme}</span>
          </label>
          <button
            onClick={handleRandomTheme}
            disabled={isLoading}
            className="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 text-xs font-medium transition-colors"
          >
            <ArrowsRightLeftIcon className="w-3 h-3" />
            <span>{t.random}</span>
          </button>
        </div>
        
        {/* Changed from scrollable flex to grid layout for 2 rows (5 cols + 4 cols) */}
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme)}
              disabled={isLoading}
              title={theme.label[language]}
              className={`
                px-1 py-2 rounded-xl text-[10px] sm:text-xs font-medium transition-all duration-200 border truncate
                ${currentTheme.id === theme.id
                  ? 'bg-white text-purple-600 border-white shadow-lg scale-105'
                  : 'bg-white/10 text-white border-transparent hover:bg-white/20'
                }
              `}
            >
              {theme.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Style Controls (Opacity + Text Color) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text Color Control */}
        <div className="space-y-3">
          <label className="text-white/80 text-sm font-medium tracking-wide uppercase ml-1 flex items-center space-x-1">
            <SwatchIcon className="w-4 h-4 opacity-70" />
            <span>{t.textColor}</span>
          </label>
          <div className="flex items-center space-x-3 px-1">
            {TEXT_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => onTextColorChange(color.value)}
                title={color.label[language]}
                className={`
                  w-6 h-6 rounded-full shadow-sm ring-2 transition-all duration-200
                  ${color.twClass}
                  ${textColor === color.value 
                    ? 'ring-white scale-125 shadow-lg' 
                    : 'ring-transparent hover:scale-110 opacity-80 hover:opacity-100'
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* Opacity Control */}
        <div className="space-y-3">
          <label className="text-white/80 text-sm font-medium tracking-wide uppercase ml-1 flex items-center space-x-1">
            <AdjustmentsHorizontalIcon className="w-4 h-4 opacity-70" />
            <span>{t.opacity}</span>
          </label>
          <div className="px-1">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={overlayOpacity * 100} 
              onChange={(e) => onOverlayOpacityChange(parseInt(e.target.value) / 100)}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-400 hover:accent-orange-300 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className={`
          w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center space-x-2
          transition-all duration-300 transform active:scale-95
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
            : 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white hover:shadow-2xl ring-4 ring-orange-500/20'
          }
        `}
      >
        <SparklesIcon className={`w-6 h-6 ${isLoading ? 'animate-pulse' : ''}`} />
        <span>{t.button}</span>
      </button>
    </div>
  );
};

export default Controls;