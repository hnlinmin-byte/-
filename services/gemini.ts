import { MoodType, Language } from "../types";

export const generateMorningGreeting = async (mood: MoodType, lang: Language): Promise<string> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mood, lang }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to generate greeting. Please try again.');
  }

  if (!payload?.content) {
    throw new Error('No greeting content returned from cloud API.');
  }

  return payload.content;
};
