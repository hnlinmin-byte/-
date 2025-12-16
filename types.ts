
export type Language = 'en' | 'zh';

export interface GreetingState {
  content: string;
  isLoading: boolean;
  error: string | null;
}

// Added 4 new cultural/literary moods
export type MoodType = 'Peaceful' | 'Motivated' | 'Grateful' | 'Wisdom' | 'Energetic' | 'Healing' | 'Confident' | 'Relaxed' | 'ChineseLit' | 'BritishLit' | 'FrenchLit' | 'JapaneseLit';

export const MOODS: MoodType[] = [
  'Peaceful', 'Motivated', 'Grateful', 'Wisdom', 
  'Energetic', 'Healing', 'Confident', 'Relaxed',
  'ChineseLit', 'BritishLit', 'FrenchLit', 'JapaneseLit'
];

export const MOOD_LABELS: Record<Language, Record<MoodType, string>> = {
  en: {
    Peaceful: 'Peaceful',
    Motivated: 'Motivated',
    Grateful: 'Grateful',
    Wisdom: 'Wisdom',
    Energetic: 'Energetic',
    Healing: 'Healing',
    Confident: 'Confident',
    Relaxed: 'Relaxed',
    ChineseLit: 'Oriental',
    BritishLit: 'British',
    FrenchLit: 'French',
    JapaneseLit: 'Japanese',
  },
  zh: {
    Peaceful: '宁静',
    Motivated: '进取',
    Grateful: '感恩',
    Wisdom: '智慧',
    Energetic: '活力',
    Healing: '治愈',
    Confident: '自信',
    Relaxed: '松弛',
    ChineseLit: '国学',
    BritishLit: '英伦',
    FrenchLit: '法式',
    JapaneseLit: '日系',
  }
};

export interface TextColor {
  id: string;
  value: string;
  label: Record<Language, string>;
  twClass: string; 
}

export const TEXT_COLORS: TextColor[] = [
  { id: 'gray', value: '#1f2937', label: { zh: '墨灰', en: 'Gray' }, twClass: 'bg-gray-800' },
  { id: 'navy', value: '#1e3a8a', label: { zh: '深蓝', en: 'Navy' }, twClass: 'bg-blue-900' },
  { id: 'forest', value: '#064e3b', label: { zh: '森绿', en: 'Forest' }, twClass: 'bg-emerald-900' },
  { id: 'wine', value: '#881337', label: { zh: '酒红', en: 'Wine' }, twClass: 'bg-rose-900' },
  { id: 'coffee', value: '#451a03', label: { zh: '咖啡', en: 'Coffee' }, twClass: 'bg-amber-950' },
  { id: 'purple', value: '#581c87', label: { zh: '深紫', en: 'Purple' }, twClass: 'bg-purple-900' },
  { id: 'black', value: '#000000', label: { zh: '纯黑', en: 'Black' }, twClass: 'bg-black' },
];

export type ThemeId = 'guangxi' | 'sunrise' | 'zen' | 'nature' | 'lifestyle' | 'ocean' | 'coffee' | 'books' | 'flowers';

export interface Theme {
  id: ThemeId;
  label: Record<Language, string>;
  backgroundImage?: string;
  backgroundColor?: string;
  overlayClassName: string;
  // Gradient overlay class to ensure text readability
  gradientClassName: string;
}

export const THEMES: Theme[] = [
  {
    id: 'guangxi',
    label: { zh: '漓江山水', en: 'Li River' },
    backgroundImage: 'https://images.unsplash.com/photo-1599571237733-d85295c5240f?q=80&w=800&auto=format&fit=crop',
    overlayClassName: 'bg-white/85',
    gradientClassName: 'bg-gradient-to-b from-white/90 via-white/80 to-white/90',
  },
  {
    id: 'sunrise',
    label: { zh: '金色晨曦', en: 'Sunrise' },
    backgroundImage: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=800&auto=format&fit=crop',
    overlayClassName: 'bg-white/60',
    gradientClassName: 'bg-gradient-to-b from-orange-50/80 via-white/60 to-orange-50/90',
  },
  {
    id: 'zen',
    label: { zh: '清茶雅韵', en: 'Zen Tea' },
    backgroundImage: 'https://images.unsplash.com/photo-1544253101-52b3699c22b1?q=80&w=800&auto=format&fit=crop',
    overlayClassName: 'bg-white/80',
    gradientClassName: 'bg-gradient-to-b from-stone-50/90 via-stone-50/70 to-stone-50/90',
  },
  {
    id: 'nature',
    label: { zh: '清新绿意', en: 'Nature' },
    backgroundImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop',
    overlayClassName: 'bg-white/85',
    gradientClassName: 'bg-gradient-to-b from-white/80 via-green-50/30 to-white/90',
  },
  {
    id: 'lifestyle',
    label: { zh: '素雅生活', en: 'Lifestyle' },
    backgroundImage: 'https://images.unsplash.com/photo-1499750310159-5298019773dd?q=80&w=800&auto=format&fit=crop',
    overlayClassName: 'bg-white/70',
    gradientClassName: 'bg-gradient-to-b from-white/60 via-white/50 to-white/80',
  },
  {
    id: 'ocean',
    label: { zh: '蔚蓝大海', en: 'Ocean' },
    backgroundImage: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=800&auto=format&fit=crop',
    overlayClassName: 'bg-white/60',
    gradientClassName: 'bg-gradient-to-b from-sky-50/80 via-white/40 to-sky-100/80',
  },
  {
    id: 'coffee',
    label: { zh: '晨间咖啡', en: 'Coffee' },
    backgroundImage: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop',
    overlayClassName: 'bg-white/70',
    gradientClassName: 'bg-gradient-to-b from-orange-50/80 via-white/50 to-orange-100/80',
  },
  {
    id: 'books',
    label: { zh: '书香静谧', en: 'Books' },
    backgroundImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop',
    overlayClassName: 'bg-white/80',
    gradientClassName: 'bg-gradient-to-b from-stone-50/90 via-stone-50/60 to-stone-100/90',
  },
  {
    id: 'flowers',
    label: { zh: '繁花似锦', en: 'Bloom' },
    backgroundImage: 'https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=800&auto=format&fit=crop',
    overlayClassName: 'bg-white/70',
    gradientClassName: 'bg-gradient-to-b from-pink-50/80 via-white/50 to-pink-100/80',
  }
];
