import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { GoogleGenAI } from '@google/genai';
import * as readline from 'readline';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY required');
  process.exit(1);
}

async function main() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: [
      '--experimental-strip-types',
      '--no-warnings',
      '--env-file=.env',
      '../mcp-server/simple-mcp-server.ts',
    ],
  });

  const client = new Client(
    {
      name: 'simple-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    },
  );

  await client.connect(transport);
  console.log('✅ Connected to simple MCP server\n');

  const toolsList = await client.listTools();
  console.log(`📦 Found ${toolsList.tools.length} tool(s):`);
  toolsList.tools.forEach((tool) => {
    console.log(`  - ${tool.name}: ${tool.description}`);
  });
  console.log();

  const promptsList = await client.listPrompts();
  console.log(`💬 Found ${promptsList.prompts.length} prompt(s):`);
  promptsList.prompts.forEach((prompt) => {
    console.log(`  - ${prompt.name}: ${prompt.description}`);
  });
  console.log();

  const geminiTools = toolsList.tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema as any,
  }));

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      tools: [{ functionDeclarations: geminiTools }],
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askUser = (question: string): Promise<string> => {
    return new Promise((resolve) => rl.question(question, resolve));
  };

  console.log('💬 Chat started. Type "exit" to quit, or use "/prompt:name" to use MCP prompts.\n');

  while (true) {
    const userInput = await askUser('You: ');

    if (userInput.toLowerCase() === 'exit') {
      console.log('Goodbye! 👋');
      rl.close();
      await client.close();
      process.exit(0);
    }

    if (!userInput.trim()) continue;

    try {
      let message = userInput;

      if (userInput.startsWith('/prompt:')) {
        const input = userInput.slice(8).trim();
        const promptArgs: Record<string, string> = {};

        const spaceIndex = input.indexOf(' ');
        const equalsIndex = input.indexOf('=');
        const splitIndex =
          spaceIndex === -1
            ? equalsIndex
            : equalsIndex === -1
              ? spaceIndex
              : Math.min(spaceIndex, equalsIndex);

        const promptName = splitIndex === -1 ? input : input.substring(0, splitIndex);
        const argsString = splitIndex === -1 ? '' : input.substring(splitIndex);

        const argMatches = argsString.matchAll(/(\w+)=([^\s]+)/g);
        for (const match of argMatches) {
          promptArgs[match[1]] = match[2];
        }

        console.log(`\n💬 Fetching prompt: ${promptName}...`);

        const promptResult = await client.getPrompt({
          name: promptName,
          arguments: promptArgs,
        });

        message = promptResult.messages.map((msg: any) => msg.content.text).join('\n\n');
        console.log(`\n📝 Using prompt:\n${message}\n`);
      }

      let response = await chat.sendMessage({ message });

      while (true) {
        const functionCalls = response.functionCalls;

        if (!functionCalls || functionCalls.length === 0) {
          if (response.text) {
            console.log(`\nGemini: ${response.text}\n`);
          }
          break;
        }

        console.log(`\n🔧 Executing ${functionCalls.length} tool(s)...`);
        const functionResponses = await Promise.all(
          functionCalls.map(async (call) => {
            console.log(`  - ${call.name}(${JSON.stringify(call.args)})`);
            const mcpResult = await client.callTool({
              name: call.name!,
              arguments: call.args || {},
            });

            const content = mcpResult.content as any;
            const resultText =
              content[0]?.type === 'text' ? content[0].text : JSON.stringify(content);

            return {
              functionResponse: {
                name: call.name!,
                response: { type: 'text', text: resultText },
              },
            };
          }),
        );

        response = await chat.sendMessage({ message: functionResponses } as any);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

main().catch(console.error);
