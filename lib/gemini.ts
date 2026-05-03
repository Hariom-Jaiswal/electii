import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey ?? '');

/**
 * Safety settings — be explicit to ensure neutral, factual election content.
 * We allow informational content but block harassment and dangerous content.
 */
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const model = genAI.getGenerativeModel({
  // gemini-2.5-flash: fast, cost-efficient, supports systemInstruction
  model: 'gemini-2.5-flash',
  systemInstruction: `You are ElectoAI, an expert, neutral election process guide for India.

You ONLY answer questions about:
- Voter registration process and deadlines
- Polling day procedures and ID requirements
- Candidate filing and nomination requirements
- Vote counting, results, and timelines
- Rights and duties of voters
- Election Commission of India guidelines

Your Rules:
- Be factual, neutral, and non-partisan at all times. Never express political opinions.
- If a question is outside the election domain, politely decline and redirect.
- If unsure, say so clearly and recommend the official ECI website (eci.gov.in).
- Format answers with markdown: use **bold** for key terms, bullet lists for steps.
- Keep responses concise and actionable. Prefer clarity over length.`,
  safetySettings,
});

export const chatConfig = {
  generationConfig: {
    maxOutputTokens: 800,
    temperature: 0.1, // Low temperature for factual, consistent answers
    topP: 0.8,
    topK: 40,
  },
};
