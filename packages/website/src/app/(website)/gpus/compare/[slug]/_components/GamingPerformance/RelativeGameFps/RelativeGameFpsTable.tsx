'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getGameSettingsPreset,
  getProductGame,
  getProductGameFpsValue,
  getViewGpuPath,
  GpuProduct,
  percentDifference,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
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
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const gpu1 = comparison[0];
  const gpu2 = comparison[1];
  const { loading, relativeDataProducts } = useRelativeDataProducts();

  const { selectedGame } = useGameSelection();
  const { settingsPreset, nextSettingsPreset } = useSettingsPresetSelection();

  const gameSettingsPreset = getGameSettingsPreset(
    selectedGame,
    settingsPreset,
  );
  const relativePerformanceGpus = useMemo(() => {
    let gpus = (relativeDataProducts?.gameFps as Partial<GpuProduct>[]) ?? [];
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
  }, [selectedGame?.id, settingsPreset, relativeDataProducts?.gameFps]);

  const [baselineGpu, setBaselineGpu] = useState(() => {
    const productGame = getProductGame(gpu1, selectedGame?.id);
    return getProductGameFpsValue(productGame, settingsPreset) ? gpu1 : gpu2;
  });
  const [secondaryGpu, setSecondaryGpu] = useState(() => {
    const productGame1 = getProductGame(gpu1, selectedGame?.id);
    const productGame2 = getProductGame(gpu2, selectedGame?.id);
    if (
      getProductGameFpsValue(productGame1, settingsPreset) == null ||
      getProductGameFpsValue(productGame2, settingsPreset) == null
    ) {
      return null;
    } else {
      return gpu2;
    }
  });

  useEffect(() => {
    const productGame1 = getProductGame(gpu1, selectedGame?.id);
    const productGame2 = getProductGame(gpu2, selectedGame?.id);
    setBaselineGpu(
      getProductGameFpsValue(productGame1, settingsPreset) != null
        ? gpu1
        : gpu2,
    );

    if (
      gpu1.id === gpu2.id ||
      getProductGameFpsValue(productGame1, settingsPreset) == null ||
      getProductGameFpsValue(productGame2, settingsPreset) == null
    ) {
      // Same gpu, or one performance is missing.
      setSecondaryGpu(null);
    } else {
      setSecondaryGpu(gpu2);
    }
  }, [gpu1, gpu2, selectedGame?.id, settingsPreset]);

  const toggleBaselineGpu = useCallback(
    (gpu: GpuProduct) => {
      setSecondaryGpu(baselineGpu);
      setBaselineGpu(gpu);
    },
    [baselineGpu],
  );

  const toggleSettingsPreset = useCallback(() => {
    nextSettingsPreset();
  }, [nextSettingsPreset]);

  const hasRelativePerformanceGpus =
    relativePerformanceGpus != null && relativePerformanceGpus.length > 1;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="w-full mb-1 flex sm:flex-col justify-between gap-3 sm:gap-1 items-center sm:items-start">
          <span className="sm:underline">Choose Baseline GPU:</span>
          <BaselineToggle
            gpu={gpu1}
            active={baselineGpu?.id === gpu1.id}
            onClick={() => toggleBaselineGpu(gpu1)}
          />{' '}
          <span className="sm:hidden">or</span>
          {gpu1.id !== gpu2.id && (
            <BaselineToggle
              gpu={gpu2}
              active={baselineGpu?.id === gpu2.id}
              onClick={() => toggleBaselineGpu(gpu2)}
            />
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
                baselineGpu={baselineGpu}
                relativeGpu={relativeGpu}
                secondaryGpu={secondaryGpu}
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
            [...new Array(10)].map((_, i) => (
              <Tr key={i}>
                <Td className="py-4">
                  <Skeleton className="w-35 h-3" pulse />
                </Td>
                <Td className="py-4">
                  <Skeleton className="w-12 h-3" pulse right />
                </Td>
                <Td className="py-4">
                  <Skeleton className="w-12 h-3" pulse right />
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
  gpu: GpuProduct;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const { selectedGame } = useGameSelection();
  const { settingsPreset } = useSettingsPresetSelection();
  const { gpu, active, onClick } = props;

  const gpuName = useMemo(
    () => formatProductName(gpu, { company: false }),
    [gpu],
  );

  const productGame = getProductGame(gpu, selectedGame?.id);
  if (getProductGameFpsValue(productGame, settingsPreset) == null) {
    return (
      <span
        className={classNames(
          'text-dimmed cursor-not-allowed line-through text-center font-normal',
          props.className,
        )}
      >
        {gpuName}
      </span>
    );
  }

  if (active) {
    return (
      <span
        className={classNames('font-semibold text-center', props.className)}
      >
        {gpuName}
      </span>
    );
  } else {
    return (
      <Button
        variant={ButtonVariant.Link}
        className={classNames(
          'cursor-pointer text-center font-normal',
          props.className,
        )}
        onClick={onClick}
      >
        {gpuName}
      </Button>
    );
  }
};
