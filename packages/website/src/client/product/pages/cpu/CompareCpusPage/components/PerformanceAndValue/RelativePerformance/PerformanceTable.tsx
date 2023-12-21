import {
  CpuProduct,
  formatProductName,
  getProductPerformanceRank,
  getViewCpuPath,
  hasProductFieldValue,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, relativePerformanceCpus } =
    useContext(ComparePageContext);
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const [cpu1, cpu2] = comparison;

  const [baselineCpu, setBaselineCpu] = useState(() => {
    return productBenchmarkValue(cpu1, preferredBenchmark) ? cpu1 : cpu2;
  });
  const [secondaryCpu, setSecondaryCpu] = useState(() => {
    if (
      !productBenchmarkValue(cpu1, preferredBenchmark) != null ||
      !productBenchmarkValue(cpu2, preferredBenchmark) != null
    ) {
      return null;
    } else {
      return cpu2;
    }
  });

  const cpus = relativePerformanceCpus;

  useEffect(() => {
    setBaselineCpu(
      productBenchmarkValue(cpu1, preferredBenchmark) != null ? cpu1 : cpu2,
    );

    if (
      cpu1.id === cpu2.id ||
      productBenchmarkValue(cpu1, preferredBenchmark) == null ||
      productBenchmarkValue(cpu2, preferredBenchmark) == null
    ) {
      // Same chipset, or one performance is missing.
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
            <Th className="text-right">Performance</Th>
            <Th className="text-right">Relative Performance</Th>
          </Tr>
        </THead>
        <TBody>
          {cpus.map((relativeCpu, i) =>
            relativeCpu != null ? (
              <PerformanceTableRow
                key={relativeCpu.id}
                baselineCpu={baselineCpu}
                secondaryCpu={secondaryCpu}
                relativeCpu={relativeCpu}
              />
            ) : (
              <Tr key={`idx-${i}`}>
                <Td colSpan={3} className="text-center">
                  &#8230;
                </Td>
              </Tr>
            ),
          )}
        </TBody>
      </Table>
    </>
  );
};

interface PerformanceTableRowProps {
  relativeCpu: CpuProduct;
  baselineCpu: CpuProduct;
  secondaryCpu?: CpuProduct;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const { baselineCpu, secondaryCpu, relativeCpu } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const relativePerformancePct = useMemo(() => {
    const baseline = productBenchmarkValue(baselineCpu, preferredBenchmark);
    const relatedPerformance = productBenchmarkValue(
      relativeCpu,
      preferredBenchmark,
    );

    return Number(
      ((relatedPerformance / baseline) * 100).toFixed(0),
    ).toLocaleString();
  }, [baselineCpu, preferredBenchmark, relativeCpu]);

  const rating = useMemo(
    () =>
      productBenchmarkValue(relativeCpu, preferredBenchmark).toLocaleString(
        'en-US',
      ),
    [relativeCpu, preferredBenchmark],
  );

  const rank = useMemo(
    () =>
      getProductPerformanceRank(
        relativeCpu,
        preferredBenchmark,
      ).toLocaleString(),
    [preferredBenchmark, relativeCpu],
  );

  const href = useMemo(() => getViewCpuPath(relativeCpu), [relativeCpu]);
  const cpuName = useMemo(
    () => formatProductName(relativeCpu, { company: false }),
    [relativeCpu],
  );

  return (
    <Tr
      className={classNames(
        baselineCpu.id === relativeCpu.id ? 'font-bold !bg-indigo-100' : '',
        secondaryCpu?.id === relativeCpu.id ? 'font-bold !bg-fuchsia-100' : '',
      )}
    >
      <Td className="text-center">{rank}</Td>
      <Td className="text-left">
        <a href={href}>{cpuName}</a>
      </Td>
      <Td className="text-right">{rating}</Td>
      <Td className="text-right">{relativePerformancePct}%</Td>
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
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const { cpu, active, onClick } = props;

  const cpuName = useMemo(
    () => formatProductName(cpu, { company: false }),
    [cpu],
  );

  if (productBenchmarkValue(cpu, preferredBenchmark) == null) {
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
