import { z } from 'zod';
import { fetchFirst } from '../api.ts';

export const planetTool = {
  name: 'getPlanet',
  config: {
    title: 'Get Star Wars Planet',
    description: 'Fetch a planet by name',
    inputSchema: {
      name: z.string().describe("Planet name, e.g. 'Tatooine'"),
    },
  },
  handler: async (args: { name: string }, _extra: any) => {
    const data = await fetchFirst('planets', 'name', args.name);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    };
  },
};
