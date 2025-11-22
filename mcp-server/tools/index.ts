import { characterTool } from './character.ts';
import { starshipTool } from './starship.ts';
import { planetTool } from './planet.ts';
import { filmTool } from './film.ts';
import { speciesTool } from './species.ts';
import { vehicleTool } from './vehicle.ts';
import { searchTool } from './search.ts';
import { addFavouriteTool, listFavouritesTool, removeFavouriteTool } from './favourites.ts';

export const allTools = [
  characterTool,
  starshipTool,
  planetTool,
  filmTool,
  speciesTool,
  vehicleTool,
  searchTool,
  addFavouriteTool,
  listFavouritesTool,
  removeFavouriteTool,
];
