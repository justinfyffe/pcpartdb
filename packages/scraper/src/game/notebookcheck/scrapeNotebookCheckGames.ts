import {
  Game,
  gameSchema,
  GameSettings,
  GameSettingsPreset,
  generateGameSlug,
  SettingsPresetKey,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions } from '../../types';

export interface ScrapeNotebookCheckGamesOptions extends CommonScraperOptions {
  url: string;
}

export async function scrapeNotebookCheckGames(
  options: ScrapeNotebookCheckGamesOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const gameNames = scrapeGameNames($);
  const games = gameNames.map((name) => generateGame($, name));

  return games as Partial<Game>[];
}

function scrapeGameNames($: cheerio.CheerioAPI) {
  const gameNames = $('.contenttable.fpstable tr > th:first-child')
    .map((_i, th) => $(th).text().trim())
    .toArray()
    .filter((value) => value.length > 0);

  if (!gameNames.length) {
    return null;
  }

  return gameNames;
}

function generateGame($: cheerio.CheerioAPI, gameName: string) {
  return {
    name: gameName,
    slug: generateGameSlug({ name: gameName }),
    gameSettings: scrapeGameSettings($, gameName),
    scraperOptions: {
      notebookCheckName: gameName,
    },
  } as Partial<Game>;
}

function scrapeGameSettings($: cheerio.CheerioAPI, gameName: string) {
  const headerEl = $('.gpugame_header').filter(
    (_i, el) => $(el).text().trim() === gameName,
  );
  const presetsEl = headerEl.closest('.gpugame_surrounding');
  const settingsNameEl = presetsEl.find('.gpugame_details acronym');

  const settings: GameSettings = {
    presets: {},
  };
  const settingsNames = settingsNameEl
    .map((_i, el) => $(el).text().toLowerCase())
    .toArray();
  for (const settingsName of settingsNames) {
    settings.presets = {
      ...settings.presets,
      ...generateSettingsPreset(settingsName),
    };
  }

  return settings;
}

function generateSettingsPreset(scrapedName: string) {
  const preset: GameSettingsPreset = {};
  let resolution: string;
  if (scrapedName.includes('1920x1080')) {
    resolution = '1080p';
  } else if (scrapedName.includes('1366x768')) {
    resolution = '768p';
  } else if (scrapedName.includes('2560x1440')) {
    resolution = '1440p';
  } else if (scrapedName.includes('3840x2160')) {
    resolution = '2160p';
  } else if (scrapedName.includes('1280x720')) {
    resolution = '720p';
  }

  let key: SettingsPresetKey;
  let name: string;
  if (scrapedName.startsWith('low')) {
    name = 'Low';
    key = SettingsPresetKey.Low;
  } else if (scrapedName.startsWith('med')) {
    name = 'Medium';
    key = SettingsPresetKey.Medium;
  } else if (scrapedName.startsWith('high')) {
    name = 'High';
    key = SettingsPresetKey.High;
  } else if (scrapedName.startsWith('ultra')) {
    name = 'Ultra';
    key = SettingsPresetKey.Ultra;
  } else if (scrapedName.startsWith('qhd')) {
    name = 'QHD';
    key = SettingsPresetKey.QHD;
  } else if (scrapedName.startsWith('4k')) {
    name = '4K UHD';
    key = SettingsPresetKey._4K_UHD;
  }

  if (!key) {
    return null;
  }

  preset.name = resolution ? `${name} - ${resolution}` : name;
  preset.nameShort = name;

  return { [key]: preset };
}
