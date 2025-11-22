import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SERVER_INFO } from './config.ts';
import { allTools } from './tools/index.ts';
import { allPrompts } from './prompts/index.ts';

async function main() {
  const server = new McpServer({
    name: SERVER_INFO.name,
    version: SERVER_INFO.version,
    capabilities: {
      tools: {},
      prompts: {},
    },
  });

  allTools.forEach((tool) => {
    server.registerTool(
      tool.name,
      {
        title: tool.config.title,
        description: tool.config.description,
        inputSchema: tool.config.inputSchema,
      },
      tool.handler,
    );
  });

  allPrompts.forEach((prompt) => {
    server.registerPrompt(
      prompt.name,
      {
        description: prompt.description,
        argsSchema: prompt.argsSchema,
      },
      prompt.handler,
    );
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('✅ SWAPI MCP server running on stdio');
  console.error(`📦 Registered ${allTools.length} tools and ${allPrompts.length} prompts`);
}

main().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
