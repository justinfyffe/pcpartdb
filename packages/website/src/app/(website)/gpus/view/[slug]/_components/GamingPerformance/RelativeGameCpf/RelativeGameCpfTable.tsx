'use client';

import {
  formatProductName,
  getGameSettingsPreset,
  getProductGame,
  getProductGameCpfValue,
  getViewGpuPath,
  GpuProduct,
  percentDifference,
  ViewGpuViewModel,
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
import React, { FunctionComponent, useCallback, useMemo } from 'react';

interface RelativeGameCpfTableProps {
  className?: string;
}

export const RelativeGameCpfTable: FunctionComponent<
  RelativeGameCpfTableProps
> = (props) => {
  const { className } = props;
  const viewModel = useViewModel<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const { loading } = useRelativeDataProducts();

  const { selectedGame } = useGameSelection();
  const { settingsPreset, nextSettingsPreset } = useSettingsPresetSelection();

  const gameSettingsPreset = getGameSettingsPreset(
    selectedGame,
    settingsPreset,
  );

  const relativeValueGpus = useMemo(() => {
    let gpus =
      (viewModel.relativeDataProducts?.gameCpf as Partial<GpuProduct>[]) ?? [];
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
  }, [
    selectedGame?.id,
    settingsPreset,
    viewModel.relativeDataProducts?.gameCpf,
  ]);

  const toggleSettingsPreset = useCallback(() => {
    nextSettingsPreset();
  }, [nextSettingsPreset]);

  const hasRelativeValueGpus =
    relativeValueGpus != null && relativeValueGpus.length > 1;

  return (
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
              baselineGpu={gpu}
              relativeGpu={relativeGpu}
            />
          ))}

        {!loading && !hasRelativeValueGpus && (
          <Tr>
            <Td colSpan={3} className="text-center p-8">
              Our database does not have enough data to compare the cost per
              frame with other GPUs.
            </Td>
          </Tr>
        )}

        {loading &&
          [...new Array(3)].map((_, i) => (
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
  );
};

interface ValueTableRowProps {
  baselineGpu: GpuProduct;
  relativeGpu: Partial<GpuProduct>;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineGpu, relativeGpu } = props;
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
