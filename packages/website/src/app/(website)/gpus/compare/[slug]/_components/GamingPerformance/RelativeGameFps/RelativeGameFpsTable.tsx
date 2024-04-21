'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getGameSettingsPreset,
  getGpuChipset,
  getProductGame,
  getProductGameFpsValue,
  getViewGpuPath,
  GpuProduct,
  percentDifference,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Td } from 'packages/website/src/app/_common/components/Table/Td';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { useSettingsPresetSelection } from 'packages/website/src/app/_common/game/contexts/SettingsPresetSelectionProvider';
import { useRelativeDataProducts } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface RelativePerformanceTableProps {
  className?: string;
}

export const RelativeGameFpsTable: FunctionComponent<
  RelativePerformanceTableProps
> = (props) => {
  const { className } = props;
  const viewModel = useViewModel<CompareGpusViewModel>();
  const { comparison } = viewModel;
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);
  const { loading } = useRelativeDataProducts();

  const { selectedGame } = useGameSelection();
  const { settingsPreset, nextSettingsPreset } = useSettingsPresetSelection();

  const gameSettingsPreset = getGameSettingsPreset(
    selectedGame,
    settingsPreset,
  );
  const relativePerformanceGpus = useMemo(() => {
    let gpus =
      (viewModel.relativeDataProducts?.gameFps as Partial<GpuProduct>[]) ?? [];
    gpus = gpus.filter((gpu) =>
      getProductGameFpsValue(
        getProductGame(gpu, selectedGame?.id),
        settingsPreset,
      ),
    );
    gpus = gpus.sort((gpu1, gpu2) => {
      const pg1 = getProductGame(gpu1, selectedGame?.id);
      const pg2 = getProductGame(gpu2, selectedGame?.id);
      return (
        getProductGameFpsValue(pg2, settingsPreset) -
        getProductGameFpsValue(pg1, settingsPreset)
      );
    });
    return gpus as Partial<GpuProduct>[];
  }, [
    selectedGame?.id,
    settingsPreset,
    viewModel.relativeDataProducts?.gameFps,
  ]);

  const [baselineChipset, setBaselineChipset] = useState(() => {
    const productGame = getProductGame(chipset1, selectedGame?.id);
    return getProductGameFpsValue(productGame, settingsPreset)
      ? chipset1
      : chipset2;
  });
  const [secondaryChipset, setSecondaryChipset] = useState(() => {
    const productGame1 = getProductGame(chipset1, selectedGame?.id);
    const productGame2 = getProductGame(chipset2, selectedGame?.id);
    if (
      !getProductGameFpsValue(productGame1, settingsPreset) != null ||
      !getProductGameFpsValue(productGame2, settingsPreset) != null
    ) {
      return null;
    } else {
      return chipset2;
    }
  });

  useEffect(() => {
    const productGame1 = getProductGame(chipset1, selectedGame?.id);
    const productGame2 = getProductGame(chipset2, selectedGame?.id);
    setBaselineChipset(
      getProductGameFpsValue(productGame1, settingsPreset) != null
        ? chipset1
        : chipset2,
    );

    if (
      chipset1.id === chipset2.id ||
      getProductGameFpsValue(productGame1, settingsPreset) == null ||
      getProductGameFpsValue(productGame2, settingsPreset) == null
    ) {
      // Same chipset, or one performance is missing.
      setSecondaryChipset(null);
    } else {
      setSecondaryChipset(chipset2);
    }
  }, [chipset1, chipset2, selectedGame?.id, settingsPreset]);

  const toggleBaselineChipset = useCallback(
    (chipset: GpuProduct) => {
      setSecondaryChipset(baselineChipset);
      setBaselineChipset(chipset);
    },
    [baselineChipset],
  );

  const toggleSettingsPreset = useCallback(() => {
    nextSettingsPreset();
  }, [nextSettingsPreset]);

  const hasRelativePerformanceGpus =
    relativePerformanceGpus != null && relativePerformanceGpus.length > 1;

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-end">
        <div className="mb-1">
          Baseline:{' '}
          <BaselineToggle
            chipset={chipset1}
            active={baselineChipset?.id === chipset1.id}
            onClick={() => toggleBaselineChipset(chipset1)}
          />{' '}
          {chipset1.id !== chipset2.id && (
            <>
              or{' '}
              <BaselineToggle
                chipset={chipset2}
                active={baselineChipset?.id === chipset2.id}
                onClick={() => toggleBaselineChipset(chipset2)}
              />
            </>
          )}
        </div>
      </div>
      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th>GPU</Th>
            <Th colSpan={2} className="text-right">
              Frames Per Second
              <br />
              <Button
                variant={ButtonVariant.Link}
                className="text-sm"
                onClick={toggleSettingsPreset}
              >
                {gameSettingsPreset.name}
              </Button>
            </Th>
          </Tr>
        </THead>
        <TBody>
          {!loading &&
            hasRelativePerformanceGpus &&
            relativePerformanceGpus.map((relativeGpu) => (
              <GameFpsTableRow
                key={relativeGpu.id}
                baselineGpu={baselineChipset}
                relativeGpu={relativeGpu}
                secondaryGpu={secondaryChipset}
              />
            ))}

          {!loading && !hasRelativePerformanceGpus && (
            <Tr>
              <Td colSpan={3} className="text-center p-8">
                Our database does not have enough FPS data to compare with other
                GPUs.
              </Td>
            </Tr>
          )}

          {loading &&
            [...new Array(3)].map((_, i) => (
              <Tr key={i} className="animate-pulse">
                <Td className="py-4">
                  <div className="bg-loading w-35 h-3 rounded" />
                </Td>
                <Td className="py-4">
                  <div className="bg-loading w-12 h-3 rounded ml-auto" />
                </Td>
                <Td className="py-4">
                  <div className="bg-loading w-12 h-3 rounded ml-auto" />
                </Td>
              </Tr>
            ))}
        </TBody>
      </Table>
    </>
  );
};

interface GameFpsTableRowProps {
  relativeGpu: Partial<GpuProduct>;
  baselineGpu: GpuProduct;
  secondaryGpu?: GpuProduct;
}

const GameFpsTableRow: FunctionComponent<GameFpsTableRowProps> = (props) => {
  const { baselineGpu, relativeGpu, secondaryGpu } = props;
  const { selectedGame } = useGameSelection();
  const { settingsPreset } = useSettingsPresetSelection();

  const relativeFpsPct = useMemo(() => {
    if (baselineGpu.id === relativeGpu.id) {
      return '';
    }

    const baselineProductGame = getProductGame(baselineGpu, selectedGame?.id);
    const baselineFps = getProductGameFpsValue(
      baselineProductGame,
      settingsPreset,
    );
    const relatedProductGame = getProductGame(relativeGpu, selectedGame?.id);
    const relatedFps = getProductGameFpsValue(
      relatedProductGame,
      settingsPreset,
    );

    const pctDiff = Number(
      (percentDifference(baselineFps, relatedFps) * 100).toFixed(0),
    );
    return `${pctDiff >= 0 ? '+' : ''}${pctDiff.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}%`;
  }, [baselineGpu, relativeGpu, selectedGame?.id, settingsPreset]);

  const fps = useMemo(() => {
    const relatedProductGame = getProductGame(relativeGpu, selectedGame?.id);
    return getProductGameFpsValue(
      relatedProductGame,
      settingsPreset,
    )?.toLocaleString();
  }, [relativeGpu, selectedGame?.id, settingsPreset]);

  const href = useMemo(() => getViewGpuPath(relativeGpu), [relativeGpu]);
  const gpuName = useMemo(
    () => formatProductName(relativeGpu, { company: false }),
    [relativeGpu],
  );

  if (fps == null) {
    return <></>;
  }

  return (
    <Tr
      className={classNames(
        baselineGpu.id === relativeGpu.id ? 'font-bold !bg-indigo-100' : '',
        secondaryGpu?.id === relativeGpu.id ? 'font-bold !bg-fuchsia-100' : '',
      )}
    >
      <Td className="text-left">
        <a href={href}>{gpuName}</a>
      </Td>
      <Td className="text-right">{fps}</Td>
      <Td className="text-right">{relativeFpsPct}</Td>
    </Tr>
  );
};

interface BaselineToggleProps {
  chipset: GpuProduct;
  active: boolean;
  onClick: () => void;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const { selectedGame } = useGameSelection();
  const { settingsPreset } = useSettingsPresetSelection();
  const { chipset: chipset, active, onClick } = props;

  const chipsetName = useMemo(
    () => formatProductName(chipset, { company: false }),
    [chipset],
  );

  const productGame = getProductGame(chipset, selectedGame?.id);
  if (getProductGameFpsValue(productGame, settingsPreset) == null) {
    return (
      <span className="text-dimmed cursor-not-allowed">{chipsetName}</span>
    );
  }

  if (active) {
    return <span className="font-bold">{chipsetName}</span>;
  } else {
    return (
      <Button
        variant={ButtonVariant.Link}
        className="cursor-pointer"
        onClick={onClick}
      >
        {chipsetName}
      </Button>
    );
  }
};
