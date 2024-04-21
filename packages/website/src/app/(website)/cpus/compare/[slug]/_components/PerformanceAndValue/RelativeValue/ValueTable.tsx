'use client';

import {
  CompareCpusViewModel,
  CpuProduct,
  formatProductName,
  getProductValueRank,
  getViewCpuPath,
  percentDifference,
  productBenchmarkValuePerMsrp,
  ProductType,
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
  const viewModel = useViewModel<CompareCpusViewModel>();
  const { comparison } = viewModel;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const [cpu1, cpu2] = comparison;
  const { loading } = useRelativeDataProducts();

  const [baselineCpu, setBaselineCpu] = useState(() => {
    return productBenchmarkValuePerMsrp(cpu1, preferredBenchmark) != null
      ? cpu1
      : cpu2;
  });
  const [secondaryCpu, setSecondaryCpu] = useState(() => {
    if (
      !productBenchmarkValuePerMsrp(cpu1, preferredBenchmark) != null ||
      !productBenchmarkValuePerMsrp(cpu2, preferredBenchmark) != null
    ) {
      return null;
    } else {
      return cpu2;
    }
  });

  const cpus = viewModel.relativeDataProducts
    ?.benchmarkPerformancePerDollar as Partial<CpuProduct>[];

  const hasRelativeValueCpus = cpus != null && cpus.length > 1;

  useEffect(() => {
    setBaselineCpu(
      productBenchmarkValuePerMsrp(cpu1, preferredBenchmark) != null
        ? cpu1
        : cpu2,
    );

    if (
      cpu1.id === cpu2.id ||
      productBenchmarkValuePerMsrp(cpu1, preferredBenchmark) == null ||
      productBenchmarkValuePerMsrp(cpu2, preferredBenchmark) == null
    ) {
      // Same cpu, or one performance is missing.
      setSecondaryCpu(null);
    } else {
      setSecondaryCpu(cpu2);
    }
  }, [cpu1, cpu2, preferredBenchmark]);

  const toggleBaselineCpu = useCallback(
    (cpu: CpuProduct) => {
      setSecondaryCpu(baselineCpu);
      setBaselineCpu(cpu);
    },
    [baselineCpu],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-end">
        <div className="mb-1">
          Baseline:{' '}
          <BaselineToggle
            cpu={cpu1}
            active={baselineCpu?.id === cpu1.id}
            onClick={() => toggleBaselineCpu(cpu1)}
          />{' '}
          {cpu1.id !== cpu2.id && (
            <>
              or{' '}
              <BaselineToggle
                cpu={cpu2}
                active={baselineCpu?.id === cpu2.id}
                onClick={() => toggleBaselineCpu(cpu2)}
              />
            </>
          )}
        </div>
      </div>

      <Table border responsive className={className}>
        <THead>
          <Tr>
            <Th className="text-center">Rank</Th>
            <Th>CPU</Th>
            <Th colSpan={2} className="text-right">
              Performance Per Dollar
            </Th>
          </Tr>
        </THead>
        <TBody>
          {!loading &&
            hasRelativeValueCpus &&
            cpus.map((relativeCpu, i) =>
              relativeCpu != null ? (
                <ValueTableRow
                  key={relativeCpu.id}
                  baselineCpu={baselineCpu}
                  secondaryCpu={secondaryCpu}
                  relativeCpu={relativeCpu}
                />
              ) : (
                <Tr key={`idx-${i}`}>
                  <Td colSpan={4} className="text-center">
                    &#8230;
                  </Td>
                </Tr>
              ),
            )}

          {!loading && !hasRelativeValueCpus && (
            <Tr>
              <Td colSpan={4} className="text-center p-8">
                Our database does not have enough data to compare the benchmark
                performance per dollar with other CPUs.
              </Td>
            </Tr>
          )}

          {loading &&
            [...new Array(3)].map((_, i) => (
              <Tr key={i} className="animate-pulse">
                <Td className="py-4">
                  <div className="bg-loading w-8 h-3 rounded" />
                </Td>
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
  relativeCpu: Partial<CpuProduct>;
  baselineCpu: Partial<CpuProduct>;
  secondaryCpu?: Partial<CpuProduct>;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineCpu, secondaryCpu, relativeCpu } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const relativeValuePct = useMemo(() => {
    const baseline = productBenchmarkValuePerMsrp(
      baselineCpu,
      preferredBenchmark,
    );
    const relatedValue = productBenchmarkValuePerMsrp(
      relativeCpu,
      preferredBenchmark,
    );

    let pct = Number(
      (percentDifference(baseline, relatedValue) * 100).toFixed(0),
    ).toLocaleString();
    if (relatedValue > baseline) {
      pct = `+${pct}`;
    }
    return pct;
  }, [baselineCpu, preferredBenchmark, relativeCpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValuePerMsrp(
        relativeCpu,
        preferredBenchmark,
      )?.toLocaleString('en-US', { maximumFractionDigits: 2 }),
    [relativeCpu, preferredBenchmark],
  );

  const rank = useMemo(
    () =>
      getProductValueRank(relativeCpu, preferredBenchmark)?.toLocaleString(),
    [preferredBenchmark, relativeCpu],
  );

  const href = useMemo(() => getViewCpuPath(relativeCpu), [relativeCpu]);
  const cpuName = useMemo(
    () => formatProductName(relativeCpu, { company: false }),
    [relativeCpu],
  );

  if (rating == null) {
    return <></>;
  }

  return (
    <Tr
      className={classNames(
        baselineCpu.id === relativeCpu.id ? 'font-bold !bg-indigo-100' : '',
        secondaryCpu?.id === relativeCpu.id ? 'font-bold !bg-fuchsia-100' : '',
      )}
    >
      <Td className="text-center">{rank ?? '--'}</Td>
      <Td className="text-left">
        <a href={href}>{cpuName}</a>
      </Td>
      <Td className="text-right">{rating}</Td>
      <Td className="text-right">
        {baselineCpu.id === relativeCpu.id ? '' : `${relativeValuePct}%`}
      </Td>
    </Tr>
  );
};

interface BaselineToggleProps {
  cpu: CpuProduct;
  active: boolean;
  onClick: () => void;
}

export const BaselineToggle: FunctionComponent<BaselineToggleProps> = (
  props,
) => {
  const { cpu, active, onClick } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const cpuName = useMemo(
    () => formatProductName(cpu, { company: false }),
    [cpu],
  );

  if (productBenchmarkValuePerMsrp(cpu, preferredBenchmark) == null) {
    return <span className="text-dimmed cursor-not-allowed">{cpuName}</span>;
  }

  if (active) {
    return <span className="font-bold">{cpuName}</span>;
  } else {
    return (
      <Button
        variant={ButtonVariant.Link}
        className="cursor-pointer"
        onClick={onClick}
      >
        {cpuName}
      </Button>
    );
  }
};
