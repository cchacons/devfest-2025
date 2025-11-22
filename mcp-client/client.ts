/**
 * MCP Client with Gemini SDK integration
 * Main entry point that orchestrates the MCP-Gemini conversation flow
 */

import {
  setupMCPClient,
  displayAvailableTools,
  displayAvailablePrompts,
  convertToolsToGeminiFormat,
} from './mcp-client.ts';
import { setupGeminiChat } from './gemini-client.ts';
import { setupCLI, displayWelcome } from './cli.ts';
import { processConversationTurn, handlePromptCommand } from './conversation.ts';

async function main() {
  // 1. Set up MCP client connection
  const client = await setupMCPClient();

  // 2. Display available tools and prompts
  const mcpTools = await displayAvailableTools(client);
  await displayAvailablePrompts(client);

  // 3. Convert MCP tools to Gemini format
  const geminiTools = convertToolsToGeminiFormat(mcpTools);

  // 4. Initialize Gemini chat
  const chat = setupGeminiChat(geminiTools);

  // 5. Set up command line interface
  const { rl, askUser } = setupCLI();
  displayWelcome();

  // 6. Main conversation loop
  while (true) {
    const userInput = await askUser('You: ');

    // Handle exit command
    if (userInput.toLowerCase() === 'exit') {
      console.log('Goodbye! 👋');
      rl.close();
      await client.close();
      process.exit(0);
    }

    // Skip empty input
    if (!userInput.trim()) continue;

    try {
      // Handle prompt commands (/prompt:name)
      if (userInput.startsWith('/prompt:')) {
        const promptName = userInput.slice(8).trim();
        await handlePromptCommand(promptName, client, chat);
        continue;
      }

      // Handle normal user messages
      const response = await chat.sendMessage({ message: userInput });
      await processConversationTurn(chat, client, response);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

// Start the application
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
