import { z } from 'zod';

export const compareCharactersPrompt = {
  name: 'compare-characters',
  description: 'Compare two Star Wars characters side-by-side',
  argsSchema: {
    character1: z.string().describe('First character name (e.g., "Luke Skywalker")'),
    character2: z.string().describe('Second character name (e.g., "Darth Vader")'),
  },
  handler: async (args: { character1?: string; character2?: string }, _extra: any) => ({
    messages: [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `Compare these two Star Wars characters: ${args.character1 || '[CHARACTER 1]'} and ${args.character2 || '[CHARACTER 2]'}.

Use the getCharacter tool to fetch both characters, then provide a detailed comparison including:
- Physical characteristics (height, mass, appearance)
- Background and origin
- Key films they appear in
- Notable differences and similarities
- Their relationship (if any)

Present the comparison in a clear, structured format.`,
        },
      },
    ],
  }),
};
