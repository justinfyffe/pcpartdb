import {
  CpuProduct,
  formatProductName,
  getViewCpuPath,
  hasProductFieldValue,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components/ProductCustomRow/ProductCustomRow';
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
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { comparison, additionalData: contentData } =
    useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;
  const { relativePerformanceCpus } = contentData;

  const [baselineCpu, setBaselineCpu] = useState(() => {
    return hasProductFieldValue(cpu1.fields?.performanceRating) ? cpu1 : cpu2;
  });
  const [secondaryCpu, setSecondaryCpu] = useState(() => {
    if (
      !hasProductFieldValue(cpu1.fields?.performanceRating) ||
      !hasProductFieldValue(cpu2.fields?.performanceRating)
    ) {
      return null;
    } else {
      return cpu2;
    }
  });

  const cpus = relativePerformanceCpus;

  useEffect(() => {
    setBaselineCpu(
      hasProductFieldValue(cpu1.fields?.performanceRating) ? cpu1 : cpu2,
    );

    if (
      cpu1.id === cpu2.id ||
      !hasProductFieldValue(cpu1.fields?.performanceRating) ||
      !hasProductFieldValue(cpu2.fields?.performanceRating)
    ) {
      // Same cpu, or one performance is missing.
      setSecondaryCpu(null);
    } else {
      setSecondaryCpu(cpu2);
    }
  }, [cpu1, cpu2]);

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
            <Th></Th>
            <Th className="text-right">Performance Rating</Th>
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

  const relativePerformancePct = useMemo(() => {
    const baseline = productFieldRawValue(
      baselineCpu.fields?.performanceRating,
    );
    const relatedPerformance = productFieldRawValue(
      relativeCpu?.fields?.performanceRating,
    );

    return ((relatedPerformance / baseline) * 100).toFixed(0);
  }, [
    baselineCpu.fields?.performanceRating,
    relativeCpu?.fields?.performanceRating,
  ]);

  const rating = useMemo(
    () => productFieldFormattedValue(relativeCpu.fields?.performanceRating),
    [relativeCpu],
  );

  const href = useMemo(() => getViewCpuPath(relativeCpu), [relativeCpu]);
  const cpuName = useMemo(
    () => formatProductName(relativeCpu, { company: false }),
    [relativeCpu],
  );

  const highlight = useMemo(() => {
    if (baselineCpu.id === relativeCpu.id) {
      return 'primary';
    } else if (secondaryCpu?.id === relativeCpu.id) {
      return 'secondary';
    } else {
      return null;
    }
  }, [baselineCpu.id, relativeCpu.id, secondaryCpu?.id]);

  return (
    <ProductCustomRow
      label={<a href={href}>{cpuName}</a>}
      values={[rating, `${relativePerformancePct}%`]}
      highlight={highlight}
      valueClassName="text-right"
    />
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

  const cpuName = useMemo(
    () => formatProductName(cpu, { company: false }),
    [cpu],
  );

  if (!hasProductFieldValue(cpu.fields?.performanceRating)) {
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
