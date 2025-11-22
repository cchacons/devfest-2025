import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const DATA_DIR = '.mcp-data';
const FAVOURITES_FILE = join(DATA_DIR, 'favourites.json');

export interface Favourites {
  characters: string[];
  planets: string[];
  films: string[];
  species: string[];
  starships: string[];
  vehicles: string[];
}

async function ensureDataDir(): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
  }
}

export async function readFavourites(): Promise<Favourites> {
  await ensureDataDir();

  try {
    const data = await readFile(FAVOURITES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {
      characters: [],
      planets: [],
      films: [],
      species: [],
      starships: [],
      vehicles: [],
    };
  }
}

export async function writeFavourites(favourites: Favourites): Promise<void> {
  await ensureDataDir();
  await writeFile(FAVOURITES_FILE, JSON.stringify(favourites, null, 2), 'utf-8');
}
