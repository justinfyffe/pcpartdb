import { Game } from '@pcpartdb/shared';
import { gameService } from 'packages/website/src/client/game/services/gameService';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import React, { FunctionComponent, useCallback, useState } from 'react';

interface ScrapeGamesUrlInputProps {
  onGamesScraped?: (games: Partial<Game>[]) => void;
}

export const ScrapeGamesUrlInput: FunctionComponent<
  ScrapeGamesUrlInputProps
> = (props) => {
  const { onGamesScraped } = props;
  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState<string>(null);
  const handleScrapeClick = useCallback(async () => {
    setLoading(true);
    const response = await gameService.scrape({
      externalUrl: url,
      newGamesOnly: true,
    });
    onGamesScraped?.(response.games);
    setLoading(false);
  }, [onGamesScraped, url]);

  return (
    <div className="flex flex-col mb-4 gap-4 flex-wrap">
      <div className="flex flex-col gap-1">
        <span className="font-medium">External URL</span>
        <div className="flex flex-1 flex-row gap-4">
          <TextInput
            placeholder="External URL to scrape"
            value={url}
            onChange={setUrl}
          />
          <PrimaryButton onClick={handleScrapeClick} disabled={loading}>
            Scrape
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
