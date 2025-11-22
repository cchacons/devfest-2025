import { z } from 'zod';
import { readFavourites, writeFavourites } from '../state/storage.ts';

const VALID_TYPES = ['character', 'planet', 'film', 'species', 'starship', 'vehicle'] as const;
type FavouriteType = typeof VALID_TYPES[number];

const typeToKey: Record<FavouriteType, keyof import('../state/storage.ts').Favourites> = {
  character: 'characters',
  planet: 'planets',
  film: 'films',
  species: 'species',
  starship: 'starships',
  vehicle: 'vehicles',
};

export const addFavouriteTool = {
  name: 'addFavourite',
  config: {
    title: 'Add Favourite',
    description: 'Save a Star Wars item to your favourites',
    inputSchema: {
      type: z.enum(VALID_TYPES).describe('Type of item (character, planet, film, species, starship, vehicle)'),
      name: z.string().describe('Name of the item to add to favourites'),
    },
  },
  handler: async (args: { type: FavouriteType; name: string }, _extra: any) => {
    const favourites = await readFavourites();
    const key = typeToKey[args.type];

    if (favourites[key].includes(args.name)) {
      return {
        content: [{
          type: 'text' as const,
          text: `"${args.name}" is already in your ${args.type} favourites`
        }],
      };
    }

    favourites[key].push(args.name);
    await writeFavourites(favourites);

    return {
      content: [{
        type: 'text' as const,
        text: `Added "${args.name}" to ${args.type} favourites`
      }],
    };
  },
};

export const listFavouritesTool = {
  name: 'listFavourites',
  config: {
    title: 'List Favourites',
    description: 'Show all favourites or filter by type',
    inputSchema: {
      type: z.enum(VALID_TYPES).optional().describe('Optional: filter by type (character, planet, film, species, starship, vehicle)'),
    },
  },
  handler: async (args: { type?: FavouriteType }, _extra: any) => {
    const favourites = await readFavourites();

    if (args.type) {
      const key = typeToKey[args.type];
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ [args.type]: favourites[key] }, null, 2)
        }],
      };
    }

    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(favourites, null, 2)
      }],
    };
  },
};

export const removeFavouriteTool = {
  name: 'removeFavourite',
  config: {
    title: 'Remove Favourite',
    description: 'Remove a Star Wars item from your favourites',
    inputSchema: {
      type: z.enum(VALID_TYPES).describe('Type of item (character, planet, film, species, starship, vehicle)'),
      name: z.string().describe('Name of the item to remove from favourites'),
    },
  },
  handler: async (args: { type: FavouriteType; name: string }, _extra: any) => {
    const favourites = await readFavourites();
    const key = typeToKey[args.type];

    const index = favourites[key].indexOf(args.name);
    if (index === -1) {
      return {
        content: [{
          type: 'text' as const,
          text: `"${args.name}" is not in your ${args.type} favourites`
        }],
      };
    }

    favourites[key].splice(index, 1);
    await writeFavourites(favourites);

    return {
      content: [{
        type: 'text' as const,
        text: `Removed "${args.name}" from ${args.type} favourites`
      }],
    };
  },
};
