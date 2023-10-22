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
import { ViewPageContext } from '../../../context/ViewPageContext';

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { gpu, additionalData } = useContext(ViewPageContext);
  const { relativeValueGpus } = additionalData;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>GPU</Th>
          <Th className="text-right">Value Rating</Th>
          <Th className="text-right">Relative Value</Th>
        </Tr>
      </THead>
      <TBody>
        {relativeValueGpus.map((relativeGpu) => (
          <ValueTableRow
            key={relativeGpu.id}
            baselineGpu={getGpuChipset(gpu)}
            relativeGpu={relativeGpu}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface ValueTableRowProps {
  baselineGpu: GpuProduct;
  relativeGpu: GpuProduct;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineGpu, relativeGpu } = props;

  const relativeValuePct = useMemo(() => {
    const baseline = productFieldRawValue(
      baselineGpu.fields?.performancePerMsrp,
    );
    const relatedValue = productFieldRawValue(
      relativeGpu.fields?.performancePerMsrp,
    );

    return ((relatedValue / baseline) * 100).toFixed(0);
  }, [
    baselineGpu.fields?.performancePerMsrp,
    relativeGpu.fields?.performancePerMsrp,
  ]);

  const rating = useMemo(
    () => productFieldFormattedValue(relativeGpu.fields?.performancePerMsrp),
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
      values={[rating, `${relativeValuePct}%`]}
      highlight={baselineGpu.id === relativeGpu.id ? 'primary' : null}
      valueClassName="text-right"
    />
  );
};
