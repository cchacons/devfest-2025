import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'simple-server',
  version: '1.0.0',
  capabilities: {
    tools: {},
    prompts: {},
  },
});

server.registerTool(
  'greet',
  {
    title: 'Greet User',
    description: 'Returns a greeting message',
    inputSchema: {
      name: z.string().describe('Name to greet'),
    },
  },
  async (args: { name: string }) => ({
    content: [{ type: 'text' as const, text: `Hello, ${args.name}!` }],
  })
);

server.registerPrompt(
  'explain-like-im-five',
  {
    description: 'Explain technical concepts using silly analogies a 5-year-old would understand',
    argsSchema: {
      concept: z.string().describe('The technical concept to explain'),
    },
  },
  async (args: { concept: string }) => ({
    messages: [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `Explain "${args.concept}" like I'm five years old. Use simple words, funny analogies, and maybe references to toys, cookies, or playground activities. Avoid any actual technical jargon. Think: rubber ducks, sandboxes, and snack time.`,
        },
      },
    ],
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Simple MCP server running');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
