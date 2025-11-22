import { z } from 'zod';
import { fetchFirst } from '../api.ts';

export const characterTool = {
  name: 'getCharacter',
  config: {
    title: 'Get Star Wars Character',
    description: 'Fetch a character by name',
    inputSchema: {
      name: z.string().describe("Character name, e.g. 'Han Solo'"),
    },
  },
  handler: async (args: { name: string }, _extra: any) => {
    const data = await fetchFirst('people', 'name', args.name);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    };
  },
};
