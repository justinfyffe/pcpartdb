import {
  formatGpuField,
  formatGpuName,
  getGpuChipset,
  getViewGpuPath,
  Gpu,
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

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { gpu, contentData } = useContext(ViewPageContext);
  const { relativeValueGpus } = contentData;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th className="text-right">Performance Per Dollar</Th>
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
  baselineGpu: Gpu;
  relativeGpu: Gpu;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineGpu, relativeGpu } = props;

  const relativeValuePct = useMemo(() => {
    const baseline = baselineGpu.valueScore.value;
    const relatedValue = relativeGpu.valueScore.value;

    return ((relatedValue / baseline) * 100).toFixed(0);
  }, [baselineGpu.valueScore.value, relativeGpu.valueScore.value]);

  const rating = useMemo(
    () => formatGpuField(relativeGpu.valueScore),
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
      values={[rating, `${relativeValuePct}%`]}
      highlight={baselineGpu.id === relativeGpu.id ? 'primary' : null}
      valueClassName="text-right"
    />
  );
};
