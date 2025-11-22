/**
 * MCP Client utilities
 * Handles connection and communication with the MCP server
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { MCP_SERVER_PATH } from './config.ts';

/**
 * Creates and connects to the MCP server
 */
export async function setupMCPClient(): Promise<Client> {
  const client = new Client(
    {
      name: 'mcp-gemini-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    },
  );

  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['tsx', MCP_SERVER_PATH],
  });

  await client.connect(transport);
  console.log('✅ Connected to MCP server\n');

  return client;
}

/**
 * Lists and displays available MCP tools
 */
export async function displayAvailableTools(client: Client) {
  const toolsResponse = await client.listTools();
  console.log(`📦 Found ${toolsResponse.tools.length} tools:`);
  toolsResponse.tools.forEach((tool) => {
    console.log(`  - ${tool.name}: ${tool.description}`);
  });
  console.log();
  return toolsResponse.tools;
}

/**
 * Lists and displays available MCP prompts
 */
export async function displayAvailablePrompts(client: Client) {
  const promptsResponse = await client.listPrompts();
  console.log(`💬 Found ${promptsResponse.prompts.length} prompts:`);
  promptsResponse.prompts.forEach((prompt) => {
    console.log(`  - ${prompt.name}: ${prompt.description}`);
  });
  console.log();
}

/**
 * Converts MCP tools to Gemini function declaration format
 */
export function convertToolsToGeminiFormat(mcpTools: any[]) {
  return mcpTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema as any, // MCP uses JSON Schema, Gemini accepts it
  }));
}

/**
 * Executes MCP tool calls requested by Gemini
 * Returns formatted responses to send back to Gemini
 */
export async function executeToolCalls(functionCalls: any[], client: Client) {
  console.log(`\n🔧 Executing ${functionCalls.length} tool(s)...`);

  const functionResponses = await Promise.all(
    functionCalls.map(async (call) => {
      console.log(`  - ${call.name}(${JSON.stringify(call.args)})`);

      // Call the MCP server tool
      const mcpResult = await client.callTool({
        name: call.name!,
        arguments: call.args || {},
      });

      // Extract text result from MCP response
      const content = mcpResult.content as any;
      const resultText = content[0]?.type === 'text' ? content[0].text : JSON.stringify(content);

      // Format response for Gemini
      return {
        functionResponse: {
          name: call.name!,
          response: {
            type: 'text',
            text: resultText,
          },
        },
      };
    }),
  );

  return functionResponses;
}

/**
 * Fetches an MCP prompt by name
 */
export async function getMCPPrompt(promptName: string, client: Client) {
  const promptResult = await client.getPrompt({
    name: promptName,
    arguments: {},
  });

  // Extract the prompt message text
  const promptMessage = promptResult.messages.map((msg: any) => msg.content.text).join('\n\n');

  return promptMessage;
}
