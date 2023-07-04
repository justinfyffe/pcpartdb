import { getGpuChipset, getViewGpuPath, Gpu } from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components';
import {
  formatGpuField,
  formatGpuName,
} from 'packages/website/src/client/product/utils';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { ViewPageContext } from '../../context';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu, contentData } = useContext(ViewPageContext);
  const { relativePerformanceGpus } = contentData;

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
        {relativePerformanceGpus.map((relativeGpu) => (
          <PerformanceTableRow
            key={relativeGpu.id}
            baselineGpu={getGpuChipset(gpu)}
            relativeGpu={relativeGpu}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface PerformanceTableRowProps {
  baselineGpu: Gpu;
  relativeGpu: Gpu;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const { baselineGpu, relativeGpu } = props;

  const relativePerformancePct = useMemo(() => {
    const baseline = baselineGpu.performanceScore.value;
    const relatedPerformance = relativeGpu.performanceScore.value;

    return ((relatedPerformance / baseline) * 100).toFixed(0);
  }, [baselineGpu.performanceScore.value, relativeGpu.performanceScore.value]);

  const rating = useMemo(
    () => formatGpuField(relativeGpu.performanceScore),
    [relativeGpu],
  );

  const href = useMemo(() => getViewGpuPath(relativeGpu), [relativeGpu]);
  const gpuName = useMemo(
    () => formatGpuName(relativeGpu, { company: false }),
    [relativeGpu],
  );

  return (
    <ProductCustomRow
      label={<a href={href}>{gpuName}</a>}
      values={[rating, `${relativePerformancePct}%`]}
      highlight={baselineGpu.id === relativeGpu.id ? 'primary' : null}
      valueClassName="text-right"
    />
  );
};
