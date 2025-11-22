import { z } from 'zod';
import { fetchFirst } from '../api.ts';

export const starshipTool = {
  name: 'getStarship',
  config: {
    title: 'Get Star Wars Starship',
    description: 'Fetch a starship by name',
    inputSchema: {
      name: z.string().describe("Starship name, e.g. 'Millennium Falcon'"),
    },
  },
  handler: async (args: { name: string }, _extra: any) => {
    const data = await fetchFirst('starships', 'name', args.name);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    };
  },
};
