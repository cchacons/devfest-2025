/**
 * Gemini AI client utilities
 * Handles Gemini chat setup and response processing
 */

import { GoogleGenAI } from '@google/genai';
import { GEMINI_MODEL, GEMINI_API_KEY } from './config.ts';
import { SYSTEM_INSTRUCTION } from './system-prompt.ts';

/**
 * Sets up Gemini chat with tools and system instruction
 */
export function setupGeminiChat(tools: any[]) {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const config = {
    tools: [
      {
        functionDeclarations: tools,
      },
    ],
    thinkingConfig: {
      thinkingBudget: 0,
    },
    systemInstruction: {
      parts: [
        {
          text: SYSTEM_INSTRUCTION,
        },
      ],
    },
  };

  return ai.chats.create({
    model: GEMINI_MODEL,
    config,
  });
}

/**
 * Displays Gemini's final text response (if available)
 */
export function displayResponse(response: any) {
  try {
    const text = response?.text;
    if (text) {
      console.log(`\nGemini: ${text}\n`);
    }
  } catch (e) {
    // No text content available (only function calls)
  }
}
