import {
  Cpu,
  formatCpuField,
  formatCpuName,
  getViewCpuPath,
} from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components/ProductCustomRow/ProductCustomRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { cpu, contentData } = useContext(ViewPageContext);
  const { relativePerformanceCpus } = contentData;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th className="text-right">Performance Rating</Th>
          <Th className="text-right">Relative Performance</Th>
        </Tr>
      </THead>
      <TBody>
        {relativePerformanceCpus.map((relativeCpu) => (
          <PerformanceTableRow
            key={relativeCpu.id}
            baselineCpu={cpu}
            relativeCpu={relativeCpu}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface PerformanceTableRowProps {
  baselineCpu: Cpu;
  relativeCpu: Cpu;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const { baselineCpu, relativeCpu } = props;

  const relativePerformancePct = useMemo(() => {
    const baseline = baselineCpu.performanceScore.value;
    const relatedPerformance = relativeCpu.performanceScore.value;

    return ((relatedPerformance / baseline) * 100).toFixed(0);
  }, [baselineCpu.performanceScore.value, relativeCpu.performanceScore.value]);

  const rating = useMemo(
    () => formatCpuField(relativeCpu.performanceScore),
    [relativeCpu],
  );

  const href = useMemo(() => getViewCpuPath(relativeCpu), [relativeCpu]);
  const cpuName = useMemo(
    () => formatCpuName(relativeCpu, { company: false }),
    [relativeCpu],
  );

  return (
    <ProductCustomRow
      label={<a href={href}>{cpuName}</a>}
      values={[rating, `${relativePerformancePct}%`]}
      highlight={baselineCpu.id === relativeCpu.id ? 'primary' : null}
      valueClassName="text-right"
    />
  );
};
