import { z } from 'zod';
import { searchAll } from '../api.ts';

export const searchTool = {
  name: 'searchResource',
  config: {
    title: 'Search SWAPI Resource',
    description: 'Generic search by resource type and query',
    inputSchema: {
      resource: z
        .enum(['people', 'starships', 'planets', 'films', 'species', 'vehicles'])
        .describe('One of: people, starships, planets, films, species, vehicles'),
      query: z.string().describe('Search term'),
    },
  },
  handler: async (args: { resource: string; query: string }, _extra: any) => {
    const result = await searchAll(args.resource, args.query);

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result.results || [], null, 2) }],
    };
  },
};
