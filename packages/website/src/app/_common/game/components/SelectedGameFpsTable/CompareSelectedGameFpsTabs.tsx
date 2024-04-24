'use client';

import {
  formatGameFps,
  formatProductName,
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
import { Tab } from '../../../components/Tabs/Tab';
import { Tabs } from '../../../components/Tabs/Tabs';
import { classNames } from '../../../utils/classNames';
import { gameListingImagePath } from '../../../utils/gameListingImagePath';
import { useGameSelection } from '../../contexts/GameSelectionProvider';
import { GameSelectionDialog } from '../GameSelection/GameSelectionDialog';

interface CompareSelectedGameFpsTabsProps {
  products: Partial<Product>[];
  games?: Partial<Game>[];
  credit?: boolean;
  className?: string;
}

export const CompareSelectedGameFpsTabs: FunctionComponent<
  CompareSelectedGameFpsTabsProps
> = (props) => {
  const { products, games } = props;
  const { selectedGame } = useGameSelection();

  const hasFps = useMemo(
    () =>
      products.some((p) => {
        const productGames = getProductGame(p, selectedGame?.id);
        return productGames?.fps?.some((fps) => fps.fps != null);
      }),
    [products, selectedGame?.id],
  );
  const hasCpf = useMemo(
    () =>
      products.some((p) => {
        const productGames = getProductGame(p, selectedGame?.id);
        return productGames?.fps?.some((fps) => fps.dollarsPerFrame != null);
      }),
    [products, selectedGame?.id],
  );

  if (!hasFps && !hasCpf) {
    return <></>;
  }

  return (
    <div className="flex flex-col">
      <Tabs tabClassName="p-1">
        {hasFps ? (
          <Tab label="Frames Per Second">
            <SelectedGameFpsTable products={products} games={games} />
          </Tab>
        ) : (
          <></>
        )}
        {hasCpf ? (
          <Tab label="Cost Per Frame">
            <SelectedGameCpfTable products={products} games={games} />
          </Tab>
        ) : (
          <></>
        )}
      </Tabs>
      {!!props.credit && (
        <GameFpsCredit
          sourceName="Notebookcheck"
          sourceUrl="https://notebookcheck.net"
        />
      )}
    </div>
  );
};

interface SelectedGameFpsTableProps {
  products: Partial<Product>[];
  games?: Partial<Game>[];
  className?: string;
}

export const SelectedGameFpsTable: FunctionComponent<
  SelectedGameFpsTableProps
> = (props) => {
  const { products, games } = props;
  const { selectedGame, setSelectedGame } = useGameSelection();

  const productName1 = useMemo(
    () => formatProductName(products[0], { company: false }),
    [products],
  );
  const productName2 = useMemo(
    () => formatProductName(products[1], { company: false }),
    [products],
  );

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
    <Table border responsive className="flex-1">
      <THead>
        <Tr>
          <Th>
            <div className="flex flex-row gap-4">
              <img
                src={gameListingImagePath(selectedGame)}
                className="h-12 sm:hidden"
              />

              <div className="flex flex-col gap-0.5">
                <Button
                  variant={ButtonVariant.Link}
                  className="hidden sm:block font-medium"
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
                  (change game)
                </Button>
              </div>
            </div>
          </Th>
          <Th className="text-left">{productName1}</Th>
          <Th className="text-left">{productName2}</Th>
        </Tr>
      </THead>
      <TBody>
        {SETTINGS_PRESETS_ORDER.map((presetKey) => {
          return selectedGame?.gameSettings?.presets?.[presetKey] != null ? (
            <SelectedGameFpsTableRow
              key={presetKey}
              products={products}
              game={selectedGame}
              presetKey={presetKey}
            />
          ) : (
            <React.Fragment key={presetKey}></React.Fragment>
          );
        })}
      </TBody>
    </Table>
  );
};

interface SelectedGameFpsTableRowProps {
  products?: Partial<Product>[];
  game: Partial<Game>;
  presetKey: SettingsPresetKey;
}

export const SelectedGameFpsTableRow: FunctionComponent<
  SelectedGameFpsTableRowProps
> = (props) => {
  const { products, game, presetKey } = props;

  const productGames = useMemo(
    () => products.map((product) => getProductGame(product, game?.id)),
    [game?.id, products],
  );

  const gameFps = useMemo(
    () =>
      productGames.map((pg) =>
        pg?.fps?.find((pgf) => pgf.settingsPresetKey === presetKey),
      ),
    [productGames, presetKey],
  );

  let diffs: string[] = [null, null];
  const score1 = gameFps[0]?.fps;
  const score2 = gameFps[1]?.fps;

  if (!score1 || !score2) {
    diffs = [null, null];
  }

  if (score1 > score2) {
    diffs = [
      (((score1 - score2) / score2) * 100).toLocaleString('en-US', {
        maximumFractionDigits: 2,
      }),
      null,
    ];
  } else if (score2 > score1) {
    diffs = [
      null,
      (((score2 - score1) / score1) * 100).toLocaleString('en-US', {
        maximumFractionDigits: 2,
      }),
    ];
  }

  const label = game.gameSettings?.presets?.[presetKey]?.name;
  if (!label) {
    return <></>;
  }

  return (
    <Tr>
      <Td className="whitespace-nowrap w-[33%]">{label}</Td>
      {gameFps.map((gf, i) => (
        <Td key={i} className="whitespace-nowrap text-left w-[33%]">
          <div className={classNames('flex gap-2 items-center')}>
            <span>{formatGameFps(gf, { fps: true }) || '--'}</span>
            <span className="text-sm">{diffs[i] && <>(+{diffs[i]}%)</>}</span>
          </div>
        </Td>
      ))}
    </Tr>
  );
};

interface SelectedGameCpfTableProps {
  products: Partial<Product>[];
  games?: Partial<Game>[];
  className?: string;
}

export const SelectedGameCpfTable: FunctionComponent<
  SelectedGameCpfTableProps
> = (props) => {
  const { products, games } = props;
  const { selectedGame, setSelectedGame } = useGameSelection();

  const productName1 = useMemo(
    () => formatProductName(products[0], { company: false }),
    [products],
  );
  const productName2 = useMemo(
    () => formatProductName(products[1], { company: false }),
    [products],
  );

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
    <Table border responsive className="flex-1">
      <THead>
        <Tr>
          <Th>
            <div className="flex flex-row gap-4">
              <img
                src={gameListingImagePath(selectedGame)}
                className="h-12 sm:hidden"
              />

              <div className="flex flex-col gap-0.5">
                <Button
                  variant={ButtonVariant.Link}
                  className="hidden sm:block font-medium"
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
                  (change game)
                </Button>
              </div>
            </div>
          </Th>
          <Th className="text-left">{productName1}</Th>
          <Th className="text-left">{productName2}</Th>
        </Tr>
      </THead>
      <TBody>
        {SETTINGS_PRESETS_ORDER.map((presetKey) => {
          return selectedGame?.gameSettings?.presets?.[presetKey] != null ? (
            <SelectedGameCpfTableRow
              key={presetKey}
              products={products}
              game={selectedGame}
              presetKey={presetKey}
            />
          ) : (
            <React.Fragment key={presetKey}></React.Fragment>
          );
        })}
      </TBody>
    </Table>
  );
};

interface SelectedGameCpfTableRowProps {
  products?: Partial<Product>[];
  game: Partial<Game>;
  presetKey: SettingsPresetKey;
}

export const SelectedGameCpfTableRow: FunctionComponent<
  SelectedGameCpfTableRowProps
> = (props) => {
  const { products, game, presetKey } = props;

  const productGames = useMemo(
    () => products.map((product) => getProductGame(product, game?.id)),
    [game?.id, products],
  );

  const gameFps = useMemo(
    () =>
      productGames.map((pg) =>
        pg?.fps?.find((pgf) => pgf.settingsPresetKey === presetKey),
      ),
    [productGames, presetKey],
  );

  let diffs: string[] = [null, null];
  const score1 = gameFps[0]?.dollarsPerFrame;
  const score2 = gameFps[1]?.dollarsPerFrame;

  if (!score1 || !score2) {
    diffs = [null, null];
  }

  if (score1 > score2) {
    diffs = [
      null,
      (((score1 - score2) / score1) * 100).toLocaleString('en-US', {
        maximumFractionDigits: 2,
      }),
    ];
  } else if (score2 > score1) {
    diffs = [
      (((score2 - score1) / score2) * 100).toLocaleString('en-US', {
        maximumFractionDigits: 2,
      }),
      null,
    ];
  }

  const label = game.gameSettings?.presets?.[presetKey]?.name;
  if (!label) {
    return <></>;
  }

  return (
    <Tr>
      <Td className="whitespace-nowrap w-[33%]">{label}</Td>
      {gameFps.map((gf, i) => (
        <Td key={i} className="whitespace-nowrap text-left w-[33%]">
          <div className={classNames('flex gap-2 items-center')}>
            <span>{formatGameFps(gf, { cpf: true }) || '--'}</span>
            <span className="text-sm">{diffs[i] && <>(-{diffs[i]}%)</>}</span>
          </div>
        </Td>
      ))}
    </Tr>
  );
};
