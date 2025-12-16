import { GoogleGenAI } from "@google/genai";
import { MoodType, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MANDATORY_FOOTER = "#广西安防哥---道早安。";

// Keywords to ensure high entropy and uniqueness (avoid repetition)
const KEYWORDS_ZH = [
  "坚韧", "微风", "阅读", "沉淀", "日出", "山川", "露珠", "微笑", "宽容", "自律", 
  "梦想", "远方", "清茶", "慢生活", "勇气", "接纳", "初心", "绽放", "静心", "当下", 
  "感恩", "自由", "星空", "大海", "森林", "治愈", "温暖", "善良", "独处", "思考", 
  "行动", "坚持", "希望", "遇见", "告别", "启程", "归零", "丰盈", "简单", "纯粹",
  "松弛感", "烟火气", "生命力", "豁达", "柔软", "光芒", "节奏", "缝隙", "滋养", "共鸣"
];

const KEYWORDS_EN = [
  "Resilience", "Breeze", "Reading", "Settling", "Sunrise", "Mountains", "Dewdrops", "Smile", 
  "Tolerance", "Discipline", "Dreams", "Distance", "Tea", "Slow Life", "Courage", "Acceptance", 
  "Beginnings", "Bloom", "Stillness", "Present", "Gratitude", "Freedom", "Stars", "Ocean", 
  "Forest", "Healing", "Warmth", "Kindness", "Solitude", "Thinking", "Action", "Persistence", 
  "Hope", "Meeting", "Farewell", "Journey", "Reset", "Abundance", "Simplicity", "Purity",
  "Relaxation", "Vitality", "Open-minded", "Softness", "Glow", "Rhythm", "Nourish", "Resonance"
];

// Helper to get Beijing Date and Weekday
const getBeijingDateInfo = (lang: Language) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Shanghai",
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const dateObj = new Date();
  // Format: "2023年10月27日 星期五" or "Friday, October 27, 2023"
  const fullDateStr = dateObj.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', options);
  
  // Get simple weekday for the greeting header
  const dayIndex = dateObj.getDay();
  let weekdayShort = '';
  if (lang === 'zh') {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    weekdayShort = days[dayIndex];
  } else {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    weekdayShort = days[dayIndex];
  }

  return { fullDateStr, weekdayShort };
};

const getRandomKeywords = (lang: Language, count: number = 2): string => {
  const source = lang === 'zh' ? KEYWORDS_ZH : KEYWORDS_EN;
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(lang === 'zh' ? '、' : ' and ');
};

const SYSTEM_INSTRUCTION_ZH = `
You are a warm, wise, and high-energy mentor who creates daily morning greetings for social media (WeChat Moments).
Your tone must be:
1. Positive and High Energy (正能量).
2. Encouraging and Healing (能鼓励到别人).
3. Literary and Cultured (有书卷气).

FORMAT RULES:
- Use Chinese.
- Include appropriate Emojis.
- The structure must be:
  Line 1: "早安朋友们，[Weekday][Random positive 2-char blessing] [Emoji]" (e.g., 周五吉祥 🧧)
  Line 2: (Empty)
  Line 3: [MANDATORY: A positive Golden Quote from a book or famous author matching the mood].
  Line 4: [Source of the quote]. Format MUST be: "—— [Author] 《[Book Name]》" (Book name optional if not applicable).
  Line 5: (Empty)
  Line 6: [Brief interpretation or encouragement based on the quote (1-2 sentences). Warm and empowering.]
  Line 7: (Empty)
  Line 8: "${MANDATORY_FOOTER}"

Do not output Markdown formatting (like **bold**). Just plain text with emojis.
`;

const SYSTEM_INSTRUCTION_EN = `
You are a warm, wise, and high-energy mentor who creates daily morning greetings for social media.
Your tone must be:
1. Positive and High Energy.
2. Encouraging and Healing.
3. Literary.

FORMAT RULES:
- Use English.
- Include appropriate Emojis.
- The structure must be:
  Line 1: "Good Morning Friends, Wishing you a [Positive Adjective] [Weekday] [Emoji]"
  Line 2: (Empty)
  Line 3: [MANDATORY: A positive Golden Quote from a book or famous author matching the mood].
  Line 4: [Source]. Format MUST be: "— [Author], '[Book Title]'"
  Line 5: (Empty)
  Line 6: [Brief interpretation or encouragement based on the quote (1-2 sentences).]
  Line 7: (Empty)
  Line 8: "${MANDATORY_FOOTER}" (Keep signature in Chinese).

Do not output Markdown formatting (like **bold**). Just plain text with emojis.
`;

const getCulturalInstruction = (mood: MoodType): string => {
  switch (mood) {
    case 'ChineseLit':
      return "Select a quote from Chinese Classics (e.g., The Analects, Tao Te Ching), Ancient Poetry, or Modern Chinese Literature (e.g., Lin Yutang, Yang Jiang, Shi Tiesheng). Tone: Zen, Wise, Peaceful.";
    case 'BritishLit':
      return "Select a quote from British Literature (e.g., Oscar Wilde, Virginia Woolf, Charles Dickens, Jane Austen) or modern British thinkers. Tone: Witty, Elegant, Resilient.";
    case 'FrenchLit':
      return "Select a quote from French Literature/Philosophy (e.g., Albert Camus, Antoine de Saint-Exupéry, Proust, Romain Rolland). Tone: Romantic, Existential, Courageous.";
    case 'JapaneseLit':
      return "Select a quote from Japanese Literature (e.g., Haruki Murakami, Natsume Soseki, Matsuura Yataro). Tone: Healing, Detail-oriented, 'Mono no aware' (Sensitivity to ephemera).";
    default:
      return "Select a general encouraging quote from world literature, philosophy, or psychology best sellers.";
  }
};

export const generateMorningGreeting = async (mood: MoodType, lang: Language): Promise<string> => {
  try {
    const { fullDateStr, weekdayShort } = getBeijingDateInfo(lang);
    const keywords = getRandomKeywords(lang, 2);
    const isChinese = lang === 'zh';
    const systemInstruction = isChinese ? SYSTEM_INSTRUCTION_ZH : SYSTEM_INSTRUCTION_EN;
    const culturalInstruction = getCulturalInstruction(mood);
    
    // Explicitly instructing the model about the date and keywords for uniqueness
    const prompt = `Task: Generate a unique morning greeting for ${fullDateStr}.
         Mood/Style: ${mood}.
         ${culturalInstruction}
         Mandatory Keywords to weave into the interpretation: "${keywords}".
         Constraint: The content must be unique to this specific date and keyword combination.
         Header Requirement: Use "${weekdayShort}" in the first line.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.15, // Slightly higher for diverse quotes
        topK: 40,
      }
    });

    let text = response.text || "";
    
    // Ensure the footer exists even if the model hallucinates
    if (!text.includes(MANDATORY_FOOTER)) {
       if (text.includes("#广西安防哥，道早安。")) {
         text = text.replace("#广西安防哥，道早安。", MANDATORY_FOOTER);
       } else {
         text += `\n\n${MANDATORY_FOOTER}`;
       }
    }

    return text;
  } catch (error) {
    console.error("Error generating greeting:", error);
    throw new Error("Failed to generate greeting. Please try again.");
  }
};
