import React, { useState, useRef } from 'react';
import { GreetingState, Language, Theme } from '../types';
import { ClipboardDocumentIcon, CheckIcon, ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';

interface GreetingCardProps {
  data: GreetingState;
  onRegenerate: () => void;
  language: Language;
  theme: Theme;
  overlayOpacity: number;
  textColor: string;
}

const GreetingCard: React.FC<GreetingCardProps> = ({ data, onRegenerate, language, theme, overlayOpacity, textColor }) => {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const t = {
    dailyWisdom: language === 'zh' ? '每日智慧' : 'DAILY WISDOM',
    copy: language === 'zh' ? '复制' : 'Copy',
    copied: language === 'zh' ? '已复制' : 'Copied',
    save: language === 'zh' ? '保存' : 'Save',
    saving: language === 'zh' ? '保存中' : 'Saving',
    share: language === 'zh' ? '分享' : 'Share',
    sharing: language === 'zh' ? '分享中' : 'Sharing',
    error: language === 'zh' ? '出错了，请重试' : 'Error, try again',
    tryAgain: language === 'zh' ? '重试' : 'Try Again',
    loading: language === 'zh' ? '正在酝酿正能量...' : 'Brewing positive energy...',
    shareNotSupported: language === 'zh' ? '您的浏览器不支持分享，已为您复制文本。' : 'Sharing not supported, text copied to clipboard.',
  };

  const handleCopy = async () => {
    if (data.content) {
      await navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveImage = async () => {
    if (cardRef.current && !isSaving) {
      try {
        setIsSaving(true);
        // We create a canvas from the card element
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null, // Allow background image to show
          scale: 2, // Higher resolution for retina displays
          useCORS: true, // Handle cross-origin images
          allowTaint: true,
          logging: false,
        });

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `morning-greeting-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Failed to save image:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;

    setIsSharing(true);
    try {
      // Generate blob
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Failed to create image blob');

      const file = new File([blob], 'morning-greeting.png', { type: 'image/png' });

      const shareData = {
        title: language === 'zh' ? '早安分享' : 'Morning Greeting',
        text: data.content,
        files: [file],
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to text share if image share not supported
        const textShareData = {
          title: shareData.title,
          text: shareData.text,
        };
        if (navigator.share && navigator.canShare(textShareData)) {
           await navigator.share(textShareData);
        } else {
           // Final fallback to copy
           await handleCopy();
           alert(t.shareNotSupported);
        }
      }
    } catch (err) {
      console.error('Share failed:', err);
      // Ignore AbortError (user cancelled)
      if (err instanceof Error && err.name !== 'AbortError') {
        // Fallback to copy if something went wrong
        await handleCopy();
      }
    } finally {
      setIsSharing(false);
    }
  };

  if (data.error) {
    return (
      <div className="w-full max-w-md p-6 bg-red-50 rounded-2xl border border-red-100 text-center text-red-600 shadow-sm">
        <p>{data.error}</p>
        <button 
          onClick={onRegenerate}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
        >
          {t.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative group perspective">
      <div 
        ref={cardRef}
        className={`
        relative rounded-3xl shadow-2xl overflow-hidden
        border border-white/50 transition-all duration-500 transform bg-white
        ${data.isLoading ? 'scale-95 opacity-80 blur-sm' : 'scale-100 opacity-100'}
      `}>
        
        {/* Background Layer */}
        <div className={`absolute inset-0 z-0 ${theme.backgroundColor || 'bg-white'}`}>
          {theme.backgroundImage && (
             <img 
               src={theme.backgroundImage} 
               alt={theme.label.en}
               crossOrigin="anonymous"
               className="w-full h-full object-cover"
             />
          )}
          
          {/* Theme Overlays with dynamic opacity */}
          <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: overlayOpacity }}>
             <div className={`absolute inset-0 ${theme.overlayClassName}`}></div>
             <div className={`absolute inset-0 ${theme.gradientClassName}`}></div>
          </div>
        </div>

        {/* Content Container (z-10 to sit above background) */}
        <div className="relative z-10">
          {/* Decorative Header */}
          <div className="h-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 w-full" />

          <div className="p-8 md:p-10 flex flex-col items-center justify-center min-h-[360px]">
            {data.isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm animate-pulse">{t.loading}</p>
              </div>
            ) : (
              <div className="w-full">
                {/* Content Area - whitespace-pre-wrap preserves the line breaks from Gemini */}
                <div 
                  className="serif-text text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-center font-medium drop-shadow-sm transition-colors duration-300"
                  style={{ color: textColor }}
                >
                  {data.content}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {!data.isLoading && (
            <div 
              data-html2canvas-ignore="true"
              className="bg-white/40 backdrop-blur-sm px-4 py-4 border-t border-white/60"
            >
              <div className="flex w-full justify-between items-center gap-2">
                
                {/* Save Button */}
                <button
                  onClick={handleSaveImage}
                  disabled={isSaving}
                  className={`
                    flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300
                    ${isSaving 
                       ? 'bg-gray-100 text-gray-400 cursor-wait' 
                       : 'bg-white/80 text-gray-700 shadow-sm hover:shadow-md hover:bg-blue-50 hover:text-blue-600 ring-1 ring-gray-200 hover:ring-blue-200'
                    }
                  `}
                >
                  <ArrowDownTrayIcon className={`w-4 h-4 ${isSaving ? 'animate-bounce' : ''}`} />
                  <span className="truncate">{isSaving ? t.saving : t.save}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className={`
                    flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300
                    ${isSharing
                       ? 'bg-gray-100 text-gray-400 cursor-wait' 
                       : 'bg-white/80 text-gray-700 shadow-sm hover:shadow-md hover:bg-purple-50 hover:text-purple-600 ring-1 ring-gray-200 hover:ring-purple-200'
                    }
                  `}
                >
                  <ShareIcon className={`w-4 h-4 ${isSharing ? 'animate-pulse' : ''}`} />
                  <span className="truncate">{isSharing ? t.sharing : t.share}</span>
                </button>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={`
                    flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300
                    ${copied 
                      ? 'bg-green-100 text-green-700 shadow-none' 
                      : 'bg-white/80 text-gray-700 shadow-sm hover:shadow-md hover:bg-orange-50 hover:text-orange-600 ring-1 ring-gray-200 hover:ring-orange-200'
                    }
                  `}
                >
                  {copied ? (
                    <>
                      <CheckIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{t.copy}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Add a branding footer that ONLY shows up in the saved image */}
          <div className="hidden pb-6 text-center text-gray-500/80 text-xs tracking-widest uppercase">
             Morning Vibes · {theme.label.en}
          </div>
        </div>
      </div>
      
      {/* Decorative blurred background behind the card for glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-br from-orange-300 to-purple-400 rounded-[2.5rem] blur-xl opacity-30 -z-10 group-hover:opacity-40 transition-opacity duration-500"></div>
    </div>
  );
};

export default GreetingCard;