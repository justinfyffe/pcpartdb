import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Game } from '@pcpartdb/shared';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { getGameListingImage } from '../../../image/utils';
import { useGameCache } from '../../../shared/cache/GameCache';
import { Autocomplete } from '../../../shared/components/Autocomplete/Autocomplete';
import { Img } from '../../../shared/components/Img/Img';
import { classNames } from '../../../shared/ui/classNames';
import { gameService } from '../../services/gameService';
import { GameAutocompleteOption } from './GameAutocompleteOption';

interface GameAutocompleteProps {
  value?: number;
  onChange?: (value: number) => void;
  onChangeGame?: (value: Partial<Game>) => void;

  placeholder?: string;
  clearable?: boolean;
  className?: string;
}

export const GameAutocomplete = forwardRef<
  HTMLInputElement,
  GameAutocompleteProps
>((props, ref) => {
  const {
    value,
    onChange,
    onChangeGame,
    placeholder: propsPlaceholder,
    className,
  } = props;

  const inputRef = useRef<HTMLInputElement>();
  useImperativeHandle(ref, () => inputRef.current);

  const gameCache = useGameCache();

  const [results, setResults] = useState<Game[]>([]);
  const [game, setGame] = useState(() => {
    if (value == null) {
      return null;
    }

    return gameCache.get(value);
  });

  const label = game?.name ?? '';
  const prefixImage = getGameListingImage(game);

  useEffect(() => {
    async function fetchGame() {
      if (game != null && value != null) {
        return;
      }

      const result = gameCache.get(value);
      setGame(result);
    }

    if (value != null) {
      fetchGame();
    }
  }, [value, game, gameCache]);

  const handleQuery = useCallback(async (query: string) => {
    const results = await gameService.autocomplete(query);

    setResults(results);
    return results.length > 0;
  }, []);

  const handleChange = useCallback(
    async (value: unknown) => {
      if (value == null) {
        setGame(null);
        onChange?.(null);
        return;
      }

      const gameId = Number(value);
      const selectedGame = gameCache.get(gameId);
      setGame(selectedGame);
      onChange?.(gameId);
      onChangeGame?.(selectedGame);

      // Need to delay, otherwise it seems like forms sometimes re-focuses.
      setTimeout(() => {
        inputRef?.current?.blur();
      });
    },
    [onChange, onChangeGame, gameCache],
  );

  return (
    <Autocomplete
      prefix={
        prefixImage ? (
          <Img loading="lazy" src={prefixImage} alt={label} className="h-5" />
        ) : undefined
      }
      label={label || ''}
      value={value != null && value !== 0 ? `${value}` : ''}
      onQuery={handleQuery}
      onChange={handleChange}
      className={classNames('flex flex-1 items-center', className)}
      suffix={value == null ? <ChevronDownIcon className="w-4" /> : null}
      placeholder={propsPlaceholder || 'Search game...'}
      ref={inputRef}
    >
      {results.map((result, i) => (
        <GameAutocompleteOption key={result.id} index={i} game={result} />
      ))}
    </Autocomplete>
  );
});
GameAutocomplete.displayName = 'GameAutocomplete';
