import { z } from 'zod';
import { fetchFirst } from '../api.ts';

export const speciesTool = {
  name: 'getSpecies',
  config: {
    title: 'Get Star Wars Species',
    description: 'Fetch a species by name',
    inputSchema: {
      name: z.string().describe("Species name, e.g. 'Wookiee'"),
    },
  },
  handler: async (args: { name: string }, _extra: any) => {
    const data = await fetchFirst('species', 'name', args.name);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    };
  },
};
