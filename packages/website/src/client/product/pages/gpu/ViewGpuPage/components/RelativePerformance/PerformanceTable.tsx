import {
  formatProductName,
  getGpuChipset,
  getViewGpuPath,
  GpuProduct,
  productFieldFormattedValue,
  productFieldRawValue,
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
import { ViewPageContext } from '../../context/ViewPageContext';

interface PerformanceTableProps {
  className?: string;
}

export const PerformanceTable: FunctionComponent<PerformanceTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu, additionalData: contentData } = useContext(ViewPageContext);
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
  baselineGpu: GpuProduct;
  relativeGpu: GpuProduct;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const { baselineGpu, relativeGpu } = props;

  const relativePerformancePct = useMemo(() => {
    const baseline = productFieldRawValue(
      baselineGpu.fields?.performanceRating,
    );
    const relatedPerformance = productFieldRawValue(
      relativeGpu.fields?.performanceRating,
    );

    return ((relatedPerformance / baseline) * 100).toFixed(0);
  }, [
    baselineGpu.fields?.performanceRating,
    relativeGpu.fields?.performanceRating,
  ]);

  const rating = useMemo(
    () => productFieldFormattedValue(relativeGpu.fields?.performanceRating),
    [relativeGpu],
  );

  const href = useMemo(() => getViewGpuPath(relativeGpu), [relativeGpu]);
  const gpuName = useMemo(
    () => formatProductName(relativeGpu, { company: false }),
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
