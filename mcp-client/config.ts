/**
 * Configuration constants for the MCP client
 */

export const MCP_SERVER_PATH = '../mcp-server/server.ts';
export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Validate required environment variables
if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable not set');
  process.exit(1);
}
