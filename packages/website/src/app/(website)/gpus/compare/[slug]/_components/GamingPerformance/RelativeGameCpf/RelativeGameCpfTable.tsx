'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getGameSettingsPreset,
  getProductGame,
  getProductGameCpfValue,
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

interface RelativeGameCpfTableProps {
  className?: string;
}

export const RelativeGameCpfTable: FunctionComponent<
  RelativeGameCpfTableProps
> = (props) => {
  const { className } = props;
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const gpu1 = comparison[0];
  const gpu2 = comparison[1];
  const { relativeDataProducts, loading } = useRelativeDataProducts();

  const { selectedGame } = useGameSelection();
  const { settingsPreset, nextSettingsPreset } = useSettingsPresetSelection();

  const gameSettingsPreset = getGameSettingsPreset(
    selectedGame,
    settingsPreset,
  );

  const relativeValueGpus = useMemo(() => {
    let gpus = (relativeDataProducts?.gameCpf as Partial<GpuProduct>[]) ?? [];
    gpus = gpus.filter((gpu) =>
      getProductGameCpfValue(
        getProductGame(gpu, selectedGame?.id),
        settingsPreset,
      ),
    );
    gpus = gpus.sort((gpu1, gpu2) => {
      const pg1 = getProductGame(gpu1, selectedGame?.id);
      const pg2 = getProductGame(gpu2, selectedGame?.id);
      return (
        getProductGameCpfValue(pg1, settingsPreset) -
        getProductGameCpfValue(pg2, settingsPreset)
      );
    });
    return gpus;
  }, [selectedGame?.id, settingsPreset, relativeDataProducts?.gameCpf]);

  const [baselineGpu, setBaselineGpu] = useState(() => {
    const productGame = getProductGame(gpu1, selectedGame?.id);
    return getProductGameCpfValue(productGame, settingsPreset) ? gpu1 : gpu2;
  });
  const [secondaryGpu, setSecondaryGpu] = useState(() => {
    const productGame1 = getProductGame(gpu1, selectedGame?.id);
    const productGame2 = getProductGame(gpu2, selectedGame?.id);
    if (
      getProductGameCpfValue(productGame1, settingsPreset) == null ||
      getProductGameCpfValue(productGame2, settingsPreset) == null
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
      getProductGameCpfValue(productGame1, settingsPreset) != null
        ? gpu1
        : gpu2,
    );

    if (
      gpu1.id === gpu2.id ||
      getProductGameCpfValue(productGame1, settingsPreset) == null ||
      getProductGameCpfValue(productGame2, settingsPreset) == null
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

  const hasRelativeValueGpus =
    relativeValueGpus != null && relativeValueGpus.length > 1;

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-end">
        <div className="mb-1">
          Baseline:{' '}
          <BaselineToggle
            gpu={gpu1}
            active={baselineGpu?.id === gpu1.id}
            onClick={() => toggleBaselineGpu(gpu1)}
          />{' '}
          {gpu1.id !== gpu2.id && (
            <>
              or{' '}
              <BaselineToggle
                gpu={gpu2}
                active={baselineGpu?.id === gpu2.id}
                onClick={() => toggleBaselineGpu(gpu2)}
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
              Cost Per Frame
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
            hasRelativeValueGpus &&
            relativeValueGpus.map((relativeGpu) => (
              <ValueTableRow
                key={relativeGpu.id}
                baselineGpu={baselineGpu}
                relativeGpu={relativeGpu}
                secondaryGpu={secondaryGpu}
              />
            ))}

          {!loading && !hasRelativeValueGpus && (
            <Tr>
              <Td colSpan={3} className="text-center p-8">
                Our database does not have enough data to compare the FPS per
                dollar with other GPUs.
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

interface ValueTableRowProps {
  relativeGpu: Partial<GpuProduct>;
  baselineGpu: GpuProduct;
  secondaryGpu?: GpuProduct;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineGpu, relativeGpu, secondaryGpu } = props;
  const { selectedGame } = useGameSelection();
  const { settingsPreset } = useSettingsPresetSelection();

  const relativeCpfPct = useMemo(() => {
    if (baselineGpu.id === relativeGpu.id) {
      return '';
    }

    const baselineProductGame = getProductGame(baselineGpu, selectedGame?.id);
    const baselineCpf = getProductGameCpfValue(
      baselineProductGame,
      settingsPreset,
    );
    const relatedProductGame = getProductGame(relativeGpu, selectedGame?.id);
    const relatedCpf = getProductGameCpfValue(
      relatedProductGame,
      settingsPreset,
    );

    const pctDiff = Number(
      (percentDifference(baselineCpf, relatedCpf) * 100).toFixed(0),
    );
    return `${pctDiff >= 0 ? '+' : ''}${pctDiff.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}%`;
  }, [baselineGpu, relativeGpu, selectedGame?.id, settingsPreset]);

  const cpf = useMemo(() => {
    const relatedProductGame = getProductGame(relativeGpu, selectedGame?.id);
    return getProductGameCpfValue(
      relatedProductGame,
      settingsPreset,
    )?.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }, [relativeGpu, selectedGame?.id, settingsPreset]);

  const href = useMemo(() => getViewGpuPath(relativeGpu), [relativeGpu]);
  const gpuName = useMemo(
    () => formatProductName(relativeGpu, { company: false }),
    [relativeGpu],
  );

  if (cpf == null) {
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
      <Td className="text-right">{cpf}</Td>
      <Td className="text-right">{relativeCpfPct}</Td>
    </Tr>
  );
};

interface BaselineToggleProps {
  gpu: GpuProduct;
  active: boolean;
  onClick: () => void;
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
  if (getProductGameCpfValue(productGame, settingsPreset) == null) {
    return <span className="text-dimmed cursor-not-allowed">{gpuName}</span>;
  }

  if (active) {
    return <span className="font-bold">{gpuName}</span>;
  } else {
    return (
      <Button
        variant={ButtonVariant.Link}
        className="cursor-pointer"
        onClick={onClick}
      >
        {gpuName}
      </Button>
    );
  }
};
