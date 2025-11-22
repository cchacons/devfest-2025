import { z } from 'zod';

export const characterTimelinePrompt = {
  name: 'character-timeline',
  description: 'Show a character\'s film appearances in chronological order',
  argsSchema: {
    characterName: z.string().describe('Character name (e.g., "Obi-Wan Kenobi")'),
  },
  handler: async (args: { characterName?: string }, _extra: any) => ({
    messages: [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `Create a chronological timeline for ${args.characterName || '[CHARACTER NAME]'}.

Use the getCharacter tool to fetch the character, then use getFilm for each film they appear in.

Present a timeline showing:
- Films in episode order (Episode I → VI)
- Character's role/significance in each film
- Character development across the saga

Format as a clear chronological narrative.`,
        },
      },
    ],
  }),
};
