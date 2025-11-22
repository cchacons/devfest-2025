/**
 * Conversation handling utilities
 * Manages the interaction loop between Gemini and MCP tools
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { executeToolCalls, getMCPPrompt } from './mcp-client.ts';
import { displayResponse } from './gemini-client.ts';

/**
 * Processes a conversation turn with Gemini, handling function calls in a loop
 */
export async function processConversationTurn(chat: any, client: Client, initialResponse: any) {
  let response = initialResponse;

  // Keep processing until there are no more function calls
  while (true) {
    const functionCalls = response.functionCalls;

    // If no function calls, we're done - display the final response
    if (!functionCalls || functionCalls.length === 0) {
      displayResponse(response);
      break;
    }

    // Execute all requested function calls
    const functionResponses = await executeToolCalls(functionCalls, client);

    // Send function results back to Gemini
    response = await chat.sendMessage({
      message: functionResponses,
    } as any);
  }
}

/**
 * Handles MCP prompt commands (/prompt:name)
 */
export async function handlePromptCommand(promptName: string, client: Client, chat: any) {
  console.log(`\n💬 Fetching prompt: ${promptName}...`);

  try {
    // Get prompt from MCP server
    const promptMessage = await getMCPPrompt(promptName, client);

    console.log(`\n📝 Using prompt:\n${promptMessage}\n`);

    // Send prompt to Gemini and process the conversation
    const response = await chat.sendMessage({ message: promptMessage });
    await processConversationTurn(chat, client, response);
  } catch (promptError) {
    console.error(`❌ Prompt error: ${promptError}`);
  }
}
