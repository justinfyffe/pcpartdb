import { ScrapeGamesResponse } from '@pcpartdb/shared';
import { ScraperContext } from '../types';
import { scrapeNotebookCheckGames } from './notebookcheck';

export interface ScrapeGamesOptions {
  externalUrl: string;
}

export async function scrapeGames(options: ScrapeGamesOptions) {
  const { externalUrl } = options;

  const ctx: ScraperContext = { memoizedFields: {} };

  const games = await scrapeNotebookCheckGames({ url: externalUrl, ctx });

  return { games } as ScrapeGamesResponse;
}
