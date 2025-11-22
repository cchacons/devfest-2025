import { z } from 'zod';
import { fetchFirst } from '../api.ts';

export const filmTool = {
  name: 'getFilm',
  config: {
    title: 'Get Star Wars Film',
    description: 'Fetch a film by title',
    inputSchema: {
      title: z.string().describe("Film title, e.g. 'A New Hope'"),
    },
  },
  handler: async (args: { title: string }, _extra: any) => {
    const data = await fetchFirst('films', 'title', args.title);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    };
  },
};
