import { z } from 'zod';
import { fetchFirst } from '../api.ts';

export const vehicleTool = {
  name: 'getVehicle',
  config: {
    title: 'Get Star Wars Vehicle',
    description: 'Fetch a vehicle by name',
    inputSchema: {
      name: z.string().describe("Vehicle name, e.g. 'Sand Crawler'"),
    },
  },
  handler: async (args: { name: string }, _extra: any) => {
    const data = await fetchFirst('vehicles', 'name', args.name);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    };
  },
};
