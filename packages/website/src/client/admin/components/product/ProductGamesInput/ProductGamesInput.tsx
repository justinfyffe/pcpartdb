import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Game,
  ProductGame,
  ProductGameFps,
  SETTINGS_PRESETS_ORDER,
  SettingsPresetKey,
} from '@pcpartdb/shared';
import { GameAutocomplete } from 'packages/website/src/client/game/components/GameAutocomplete/GameAutocomplete';
import { useGameCache } from 'packages/website/src/client/shared/cache/GameCache';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProductGameFpsInput } from './ProductGameFpsInput';

export interface ProductGamesInputProps {
  name: string;
  value: ProductGame[];

  onChange: (values: ProductGame[]) => void;

  ref?: unknown;
}

export const ProductGamesInput: FunctionComponent<ProductGamesInputProps> = (
  props,
) => {
  const { value, onChange } = props;

  // TODO: this could probably be made into a hook
  const [rowKeys] = useState(() => {
    const ret: string[] = [];
    value?.forEach(() => ret.push(uuidv4()));
    return ret;
  });

  const handleGameChange = useCallback(
    (i: number, data: ProductGame) => {
      const newValue = [...value];
      newValue[i] = data;
      onChange(newValue);
    },
    [value, onChange],
  );

  const handleAppendGame = useCallback(() => {
    const newList = [...value, null];
    rowKeys.push(uuidv4());
    onChange(newList);
  }, [value, onChange, rowKeys]);

  const handleRemoveGame = useCallback(
    (i: number) => {
      const newValue: ProductGame[] = [...value];
      newValue.splice(i, 1);
      rowKeys.splice(i, 1);
      onChange(newValue);
    },
    [value, onChange, rowKeys],
  );

  return (
    <div className="flex flex-col w-full mb-6 gap-4">
      {value.map((game, i) => (
        <ProductGameInput
          key={game?.gameId ?? rowKeys[i]}
          productGame={game}
          onChange={(game) => handleGameChange(i, game)}
          onClose={() => handleRemoveGame(i)}
        />
      ))}
      <WarningButton className="self-end" onClick={() => handleAppendGame()}>
        Add Game
      </WarningButton>
    </div>
  );
};

export interface ProductGameInputProps {
  productGame: ProductGame;

  onChange: (game: ProductGame) => void;
  onClose?: () => void;
}

function ProductGameInput(props: ProductGameInputProps) {
  const { productGame, onChange, onClose } = props;

  const gameCache = useGameCache();
  let game: Partial<Game>;
  if (productGame?.game) {
    game = productGame.game;
  } else if (productGame?.gameId) {
    game = gameCache.get(productGame?.gameId);
  } else {
    game = null;
  }

  const presetFps = useMemo(
    () =>
      productGame?.fps?.reduce((acc, gameFps) => {
        if (gameFps?.settingsPresetKey) {
          acc[gameFps.settingsPresetKey] = gameFps;
        }
        return acc;
      }, {} as Record<SettingsPresetKey, ProductGameFps>),
    [productGame?.fps],
  );

  const handleGameChange = useCallback(
    (gameId: number) => {
      const newProductGame: ProductGame = { gameId, fps: [] };
      onChange(newProductGame);
    },
    [onChange],
  );

  const handlePresetFpsChange = useCallback(
    (gameFps: ProductGameFps) => {
      const presetKey = gameFps.settingsPresetKey;
      presetFps[presetKey] = gameFps;
      const newGame: ProductGame = {
        ...productGame,
        fps: Object.values(presetFps),
      };
      onChange(newGame);
    },
    [onChange, presetFps, productGame],
  );

  return (
    <div className="flex flex-col border-px rounded p-4">
      <div className="flex justify-between gap-8 mb-8">
        <GameAutocomplete
          value={productGame?.gameId}
          onChange={handleGameChange}
        />
        <GenericButton onClick={onClose}>
          <XMarkIcon className="w-4" />
        </GenericButton>
      </div>

      {productGame?.gameId != null ? (
        <>
          <h3>FPS for Presets</h3>
          <div className="flex flex-wrap gap-4">
            {SETTINGS_PRESETS_ORDER.map((presetKey) => (
              <ProductGameFpsInput
                key={presetKey}
                game={game}
                value={
                  presetFps[presetKey] || {
                    gameId: productGame.gameId,
                    settingsPresetKey: presetKey,
                    fps: null,
                  }
                }
                onChange={handlePresetFpsChange}
              />
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
