import React, { useState, useEffect, useCallback } from 'react';
import { generateMorningGreeting } from './services/gemini';
import { GreetingState, MoodType, Language, THEMES, Theme, TEXT_COLORS } from './types';
import GreetingCard from './components/GreetingCard';
import Controls from './components/Controls';
import { SunIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [mood, setMood] = useState<MoodType>('Motivated');
  const [language, setLanguage] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.8);
  const [textColor, setTextColor] = useState<string>(TEXT_COLORS[0].value);
  const [state, setState] = useState<GreetingState>({
    content: '',
    isLoading: false,
    error: null,
  });

  const t = {
    title: language === 'zh' ? '早安·正能量' : 'Morning Energy',
    subtitle: language === 'zh' ? '生成暖心问候，传递正能量' : 'Create encouraging greetings to share with your friends.',
    footer: language === 'zh' ? '由 Gemini 2.5 Flash 提供支持' : 'Powered by Gemini 2.5 Flash',
  };

  // Core generation logic reused for manual click and auto-switch
  const performGeneration = async (targetMood: MoodType, targetLang: Language) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const content = await generateMorningGreeting(targetMood, targetLang);
      setState({
        content,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMsg = targetLang === 'zh' 
        ? '哎呀！正能量还在路上，请重试！' 
        : 'Oops! The positive vibes got stuck in traffic. Try again!';
        
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
    }
  };

  // Handler for manual "Generate" button click
  const handleGenerate = () => {
    performGeneration(mood, language);
  };

  // Handler for language toggle - updates state and triggers regeneration
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    performGeneration(mood, newLang);
  };

  // Generate an initial greeting on mount
  useEffect(() => {
    performGeneration('Motivated', 'zh');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-400 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <main className="w-full max-w-lg flex flex-col items-center space-y-8 z-10">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-full mb-2">
            <SunIcon className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
            {t.title}
          </h1>
          <p className="text-white/80 text-sm font-medium max-w-xs mx-auto">
            {t.subtitle}
          </p>
        </header>

        {/* Card Display */}
        <GreetingCard 
          data={state} 
          onRegenerate={handleGenerate}
          language={language}
          theme={theme}
          overlayOpacity={overlayOpacity}
          textColor={textColor}
        />

        {/* Controls */}
        <Controls 
          currentMood={mood} 
          onMoodChange={setMood} 
          currentTheme={theme}
          onThemeChange={setTheme}
          onGenerate={handleGenerate} 
          isLoading={state.isLoading}
          language={language}
          onLanguageChange={handleLanguageChange}
          overlayOpacity={overlayOpacity}
          onOverlayOpacityChange={setOverlayOpacity}
          textColor={textColor}
          onTextColorChange={setTextColor}
        />
        
        {/* Footer Credit */}
        <div className="text-white/40 text-xs mt-8">
           {t.footer}
        </div>

      </main>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default App;