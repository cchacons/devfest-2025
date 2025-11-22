import { z } from 'zod';

export const findConnectionsPrompt = {
  name: 'find-connections',
  description: 'Discover how two Star Wars characters are connected',
  argsSchema: {
    character1: z.string().describe('First character name (e.g., "Anakin Skywalker")'),
    character2: z.string().describe('Second character name (e.g., "Padmé Amidala")'),
  },
  handler: async (args: { character1?: string; character2?: string }, _extra: any) => ({
    messages: [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `Explore the connections between ${args.character1 || '[CHARACTER 1]'} and ${args.character2 || '[CHARACTER 2]'}.

Use the getCharacter tool for both characters and analyze their data to find:
- Shared films they appear in
- Common locations (homeworld, planets visited)
- Relationship nature (family, allies, enemies, etc.)
- How their stories intertwine
- Key moments they share

Present a narrative explaining their connection in the Star Wars saga.`,
        },
      },
    ],
  }),
};
