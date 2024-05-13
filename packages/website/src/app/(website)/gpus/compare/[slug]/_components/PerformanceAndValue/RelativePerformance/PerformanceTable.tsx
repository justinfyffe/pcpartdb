'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getViewGpuPath,
  GpuProduct,
  percentDifference,
  productBenchmarkValue,
  ProductType,
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
import { useRelativeDataProducts } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const viewModel = useViewModel<CompareGpusViewModel>();
  const { comparison } = viewModel;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const gpu1 = comparison[0];
  const gpu2 = comparison[1];
  const { loading } = useRelativeDataProducts();

  const [baselineGpu, setBaselineGpu] = useState(() => {
    return productBenchmarkValue(gpu1, preferredBenchmark) ? gpu1 : gpu2;
  });
  const [secondaryGpu, setSecondaryGpu] = useState(() => {
    if (
      productBenchmarkValue(gpu1, preferredBenchmark) == null ||
      productBenchmarkValue(gpu2, preferredBenchmark) == null
    ) {
      return null;
    } else {
      return gpu2;
    }
  });

  const gpus = viewModel.relativeDataProducts
    ?.benchmarkPerformance as Partial<GpuProduct>[];
  const hasRelativePerformanceGpus = gpus != null && gpus.length > 1;

  useEffect(() => {
    setBaselineGpu(
      productBenchmarkValue(gpu1, preferredBenchmark) != null ? gpu1 : gpu2,
    );

    if (
      gpu1.id === gpu2.id ||
      productBenchmarkValue(gpu1, preferredBenchmark) == null ||
      productBenchmarkValue(gpu2, preferredBenchmark) == null
    ) {
      // Same gpu, or one performance is missing.
      setSecondaryGpu(null);
    } else {
      setSecondaryGpu(gpu2);
    }
  }, [gpu1, gpu2, preferredBenchmark]);

  const toggleBaselineGpu = useCallback(
    (gpu: GpuProduct) => {
      setSecondaryGpu(baselineGpu);
      setBaselineGpu(gpu);
    },
    [baselineGpu],
  );

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
              Benchmark Performance
            </Th>
          </Tr>
        </THead>
        <TBody>
          {!loading &&
            hasRelativePerformanceGpus &&
            gpus.map((relativeGpu, i) =>
              relativeGpu != null ? (
                <PerformanceTableRow
                  key={relativeGpu.id}
                  baselineGpu={baselineGpu}
                  secondaryGpu={secondaryGpu}
                  relativeGpu={relativeGpu}
                />
              ) : (
                <Tr key={`idx-${i}`}>
                  <Td colSpan={4} className="text-center">
                    &#8230;
                  </Td>
                </Tr>
              ),
            )}

          {!loading && !hasRelativePerformanceGpus && (
            <Tr>
              <Td colSpan={4} className="text-center p-8">
                Our database does not have enough data to compare the benchmark
                performance with other GPUs.
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

interface PerformanceTableRowProps {
  relativeGpu: Partial<GpuProduct>;
  baselineGpu: GpuProduct;
  secondaryGpu?: GpuProduct;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const { baselineGpu, secondaryGpu, relativeGpu } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const relativePerformancePct = useMemo(() => {
    const baseline = productBenchmarkValue(baselineGpu, preferredBenchmark);
    const relatedPerformance = productBenchmarkValue(
      relativeGpu,
      preferredBenchmark,
    );

    let pct = Number(
      (percentDifference(baseline, relatedPerformance) * 100).toFixed(0),
    ).toLocaleString();
    if (relatedPerformance > baseline) {
      pct = `+${pct}`;
    }
    return pct;
  }, [baselineGpu, preferredBenchmark, relativeGpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValue(relativeGpu, preferredBenchmark)?.toLocaleString(
        'en-US',
      ),
    [relativeGpu, preferredBenchmark],
  );

  const href = useMemo(() => getViewGpuPath(relativeGpu), [relativeGpu]);
  const gpuName = useMemo(
    () => formatProductName(relativeGpu, { company: false }),
    [relativeGpu],
  );

  if (rating == null) {
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
      <Td className="text-right">{rating}</Td>
      <Td className="text-right">
        {baselineGpu.id === relativeGpu.id ? '' : `${relativePerformancePct}%`}
      </Td>
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
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { gpu, active, onClick } = props;

  const gpuName = useMemo(
    () => formatProductName(gpu, { company: false }),
    [gpu],
  );

  if (productBenchmarkValue(gpu, preferredBenchmark) == null) {
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
