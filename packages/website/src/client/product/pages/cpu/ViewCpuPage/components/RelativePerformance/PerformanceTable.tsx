import {
  CpuProduct,
  formatProductName,
  getViewCpuPath,
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
  const { cpu, additionalData: contentData } = useContext(ViewPageContext);
  const { relativePerformanceCpus } = contentData;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>CPU</Th>
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
  baselineCpu: CpuProduct;
  relativeCpu: CpuProduct;
}

const PerformanceTableRow: FunctionComponent<PerformanceTableRowProps> = (
  props,
) => {
  const { baselineCpu, relativeCpu } = props;

  const relativePerformancePct = useMemo(() => {
    const baseline = productFieldRawValue(
      baselineCpu.fields?.performanceRating,
    );
    const relatedPerformance = productFieldRawValue(
      relativeCpu.fields?.performanceRating,
    );

    return Number(
      ((relatedPerformance / baseline) * 100).toFixed(0),
    ).toLocaleString();
  }, [
    baselineCpu.fields?.performanceRating,
    relativeCpu.fields?.performanceRating,
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

  return (
    <ProductCustomRow
      label={<a href={href}>{cpuName}</a>}
      values={[rating, `${relativePerformancePct}%`]}
      highlight={baselineCpu.id === relativeCpu.id ? 'primary' : null}
      valueClassName="text-right"
    />
  );
};
