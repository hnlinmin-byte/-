import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY.' });
  }

  const { mood = 'Motivated', lang = 'zh' } = req.body || {};
  const footer = '#广西安防哥---道早安。';
  const isZh = lang === 'zh';
  const ai = new GoogleGenAI({ apiKey });

  const weekday = new Date().toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
    timeZone: 'Asia/Shanghai',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const prompt = isZh
    ? `请生成一条适合朋友圈发布的中文早安正能量文案。日期：${weekday}。风格：${mood}。要求：有emoji，有文学感，有一句金句和简短解读，最后必须以 ${footer} 结尾。不要使用Markdown。`
    : `Create one positive English morning greeting for social media. Date: ${weekday}. Style: ${mood}. Include emoji, one uplifting quote, a short interpretation, and end with ${footer}. Do not use Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 1.1,
        topK: 40,
      },
    });

    let content = response.text || '';
    if (!content.includes(footer)) {
      content += `\n\n${footer}`;
    }

    return res.status(200).json({ content });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to generate greeting.' });
  }
}
