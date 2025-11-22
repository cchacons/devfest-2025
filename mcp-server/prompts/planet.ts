import { z } from 'zod';

export const planetOverviewPrompt = {
  name: 'planet-overview',
  description: 'Complete overview of a Star Wars planet with residents and films',
  argsSchema: {
    planetName: z.string().describe('Planet name (e.g., "Tatooine")'),
  },
  handler: async (args: { planetName?: string }, _extra: any) => ({
    messages: [
      {
        role: 'user' as const,
        content: {
          type: 'text' as const,
          text: `Provide a comprehensive overview of the planet ${args.planetName || '[PLANET NAME]'}.

Use the getPlanet tool to fetch planet details, then explore:
- Physical characteristics (climate, terrain, population)
- Notable residents/characters from this planet
- Films where this planet appears
- Significance in the Star Wars universe

Create an engaging, informative guide about this planet.`,
        },
      },
    ],
  }),
};
