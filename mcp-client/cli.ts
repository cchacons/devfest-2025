/**
 * Command line interface utilities
 */

import { createInterface } from 'node:readline';

/**
 * Sets up readline interface for user input
 */
export function setupCLI() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askUser = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };

  return { rl, askUser };
}

/**
 * Displays welcome message
 */
export function displayWelcome() {
  console.log('🤖 MCP Client with Gemini ready!');
  console.log(
    'Type your questions or use "/prompt:name" to trigger a prompt (or "exit" to quit)\n',
  );
}
