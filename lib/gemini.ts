/**
 * Gemini AI Configuration via Google Generative AI SDK.
 * Using the recommended @google/generative-ai SDK to resolve deprecation 
 * warnings and build failures.
 */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

/**
 * Lazy initialization of the Gemini Model.
 * This prevents build-time errors when API keys or Project IDs are missing 
 * during the 'next build' static analysis phase.
 */
let genAI: GoogleGenerativeAI | null = null;

export function getGeminiModel() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
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
  });
}

/**
 * Safety settings — ensures neutral, factual election content.
 */
export const safetySettings = [
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

export const chatConfig = {
  maxOutputTokens: 800,
  temperature: 0.1,
  topP: 0.8,
  topK: 40,
};
