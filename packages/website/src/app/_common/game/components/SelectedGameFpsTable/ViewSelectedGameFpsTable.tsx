'use client';

import {
  formatGameFps,
  Game,
  getProductGame,
  Product,
  SETTINGS_PRESETS_ORDER,
  SettingsPresetKey,
} from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Td } from 'packages/website/src/app/_common/components/Table/Td';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { GameFpsCredit } from 'packages/website/src/app/_common/product/components/GameFpsCredit/GameFpsCredit';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Button } from '../../../components/Button/Button';
import { ButtonVariant } from '../../../components/Button/types';
import { closeDialog, showDialog } from '../../../components/Dialog/dialog';
import { gameListingImagePath } from '../../../utils/gameListingImagePath';
import { useGameSelection } from '../../contexts/GameSelectionProvider';
import { GameSelectionDialog } from '../GameSelection/GameSelectionDialog';

interface ViewSelectedGameFpsTableProps {
  product: Partial<Product>;
  games?: Partial<Game>[];
  credit?: boolean;
  className?: string;
}

export const ViewSelectedGameFpsTable: FunctionComponent<
  ViewSelectedGameFpsTableProps
> = (props) => {
  const { product, games } = props;
  const { selectedGame, setSelectedGame } = useGameSelection();

  const showGamesDialog = useCallback(() => {
    showDialog(
      <GameSelectionDialog
        games={games}
        onSelection={(game) => {
          setSelectedGame(game);
          closeDialog();
        }}
      />,
    );
  }, [setSelectedGame, games]);

  return (
    <div className="flex flex-col">
      <Table border responsive className="flex-1">
        <THead>
          <Tr>
            <Th>
              <div className="flex flex-row gap-4">
                <img
                  loading="lazy"
                  src={gameListingImagePath(selectedGame)}
                  className="h-12 sm:hidden"
                />

                <div className="flex flex-col gap-0.5">
                  <Button
                    variant={ButtonVariant.Link}
                    className="hidden sm:block font-medium text-left"
                    onClick={showGamesDialog}
                  >
                    {selectedGame?.nameShort || selectedGame?.name}
                  </Button>
                  <span className="sm:hidden font-medium">
                    {selectedGame?.nameShort || selectedGame?.name}
                  </span>
                  <Button
                    variant={ButtonVariant.Link}
                    className="text-link text-xs sm:hidden text-left"
                    onClick={showGamesDialog}
                  >
                    change game
                  </Button>
                </div>
              </div>
            </Th>
            <Th className="text-left">
              <div className="flex flex-col">
                <span>Frames Per Second</span>
                <span className="text-sm font-normal sm:hidden">
                  Higher is better
                </span>
              </div>
            </Th>
            <Th className="text-left">
              <div className="flex flex-col">
                <span>Cost Per Frame</span>
                <span className="text-sm font-normal sm:hidden">
                  Lower is better
                </span>
              </div>
            </Th>
          </Tr>
        </THead>
        <TBody>
          {SETTINGS_PRESETS_ORDER.map((presetKey) => {
            return selectedGame?.gameSettings?.presets?.[presetKey] != null ? (
              <ViewSelectedGameFpsRow
                key={presetKey}
                product={product}
                game={selectedGame}
                presetKey={presetKey}
              />
            ) : (
              <React.Fragment key={presetKey}></React.Fragment>
            );
          })}
        </TBody>
      </Table>

      {!!props.credit && (
        <GameFpsCredit
          sourceName="Notebookcheck"
          sourceUrl="https://notebookcheck.net"
        />
      )}
    </div>
  );
};

interface ViewSelectedGameFpsRowProps {
  product?: Partial<Product>;
  game: Partial<Game>;
  presetKey: SettingsPresetKey;
}

export const ViewSelectedGameFpsRow: FunctionComponent<
  ViewSelectedGameFpsRowProps
> = (props) => {
  const { product, game, presetKey } = props;

  const productGame = useMemo(
    () => getProductGame(product, game?.id),
    [game?.id, product],
  );

  const gameFps = useMemo(
    () => productGame?.fps?.find((pgf) => pgf.settingsPresetKey === presetKey),
    [productGame, presetKey],
  );

  const label = game.gameSettings?.presets?.[presetKey]?.name;
  if (!label) {
    return <></>;
  }

  return (
    <Tr>
      <Td className="whitespace-nowrap w-[33%]">{label}</Td>
      <Td className="whitespace-nowrap text-left w-[33%]">
        {formatGameFps(gameFps, { fps: true }) || '--'}
      </Td>
      <Td className="whitespace-nowrap text-left w-[33%]">
        {formatGameFps(gameFps, { cpf: true }) || '--'}
      </Td>
    </Tr>
  );
};
