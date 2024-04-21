import { Game } from '@pcpartdb/shared';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { ScrapedGameForm } from '../ScrapedGameForm/ScrapedGameForm';
import { ScrapeGamesUrlInput } from '../ScrapeGamesUrlInput/ScrapeGamesUrlInput';

interface ScrapeGamesFormProps {
  //
}

export const ScrapeGamesForm: FunctionComponent<ScrapeGamesFormProps> = () => {
  const [scrapedGames, setScrapedGames] = useState<Partial<Game>[]>(null);
  const handleGamesScraped = useCallback((games: Partial<Game>[]) => {
    setScrapedGames(games);
  }, []);

  return (
    <div className="flex flex-col mb-4 gap-4">
      <ScrapeGamesUrlInput onGamesScraped={handleGamesScraped} />

      {scrapedGames == null && (
        <InfoAlert>Enter a URL to scrape games.</InfoAlert>
      )}

      {scrapedGames?.length === 0 && (
        <InfoAlert>There are no new games at that URL.</InfoAlert>
      )}

      {scrapedGames?.map((scrapedGame, i) => (
        <ScrapedGameForm key={i} game={scrapedGame} />
      ))}
    </div>
  );
};
