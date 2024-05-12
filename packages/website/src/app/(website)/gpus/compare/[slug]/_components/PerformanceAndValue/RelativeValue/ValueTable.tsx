'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getViewGpuPath,
  GpuProduct,
  percentDifference,
  productBenchmarkValuePerMsrp,
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

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const viewModel = useViewModel<CompareGpusViewModel>();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { comparison } = viewModel;
  const gpu1 = comparison[0];
  const gpu2 = comparison[1];
  const { loading } = useRelativeDataProducts();

  const [baselineGpu, setBaselineGpu] = useState(() => {
    return productBenchmarkValuePerMsrp(gpu1, preferredBenchmark) != null
      ? gpu1
      : gpu2;
  });
  const [secondaryGpu, setSecondaryGpu] = useState(() => {
    if (
      gpu1.id === gpu2.id ||
      productBenchmarkValuePerMsrp(gpu1, preferredBenchmark) == null ||
      productBenchmarkValuePerMsrp(gpu2, preferredBenchmark) == null
    ) {
      return null;
    } else {
      return gpu2;
    }
  });

  const relativeGpus = viewModel.relativeDataProducts
    ?.benchmarkPerformancePerDollar as Partial<GpuProduct>[];
  const hasRelativeValueGpus = relativeGpus != null && relativeGpus.length > 1;

  useEffect(() => {
    setBaselineGpu(
      productBenchmarkValuePerMsrp(gpu1, preferredBenchmark) != null
        ? gpu1
        : gpu2,
    );

    if (
      gpu1.id === gpu2.id ||
      productBenchmarkValuePerMsrp(gpu1, preferredBenchmark) == null ||
      productBenchmarkValuePerMsrp(gpu2, preferredBenchmark) == null
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
      <div className="mb-1 text-right">
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
      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th>GPU</Th>
            <Th colSpan={2} className="text-right">
              Performance Per Dollar
            </Th>
          </Tr>
        </THead>
        <TBody>
          {!loading &&
            hasRelativeValueGpus &&
            relativeGpus.map((relativeGpu, i) =>
              relativeGpu != null ? (
                <ValueTableRow
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
          {!loading && !hasRelativeValueGpus && (
            <Tr>
              <Td colSpan={4} className="text-center p-8">
                Our database does not have enough data to compare the benchmark
                performance per dollar with other GPUs.
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
    </>
  );
};

interface ValueTableRowProps {
  relativeGpu: Partial<GpuProduct>;
  baselineGpu: GpuProduct;
  secondaryGpu?: GpuProduct;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineGpu, secondaryGpu, relativeGpu } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const relativeValuePct = useMemo(() => {
    const baseline = productBenchmarkValuePerMsrp(
      baselineGpu,
      preferredBenchmark,
    );
    const relatedValue = productBenchmarkValuePerMsrp(
      relativeGpu,
      preferredBenchmark,
    );

    let pct = Number(
      (percentDifference(baseline, relatedValue) * 100).toFixed(0),
    ).toLocaleString();
    if (relatedValue > baseline) {
      pct = `+${pct}`;
    }
    return pct;
  }, [baselineGpu, preferredBenchmark, relativeGpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValuePerMsrp(
        relativeGpu,
        preferredBenchmark,
      )?.toLocaleString('en-US', { maximumFractionDigits: 2 }),
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
        {baselineGpu.id === relativeGpu.id ? '' : `${relativeValuePct}%`}
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
  const { gpu, active, onClick } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const gpuName = useMemo(
    () => formatProductName(gpu, { company: false }),
    [gpu],
  );

  if (productBenchmarkValuePerMsrp(gpu, preferredBenchmark) == null) {
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
