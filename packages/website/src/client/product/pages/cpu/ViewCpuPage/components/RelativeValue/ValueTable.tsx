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

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { cpu, additionalData: contentData } = useContext(ViewPageContext);
  const { relativeValueCpus } = contentData;

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
        {relativeValueCpus.map((relativeCpu) => (
          <ValueTableRow
            key={relativeCpu.id}
            baselineCpu={cpu}
            relativeCpu={relativeCpu}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface ValueTableRowProps {
  baselineCpu: CpuProduct;
  relativeCpu: CpuProduct;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineCpu, relativeCpu } = props;

  const relativeValuePct = useMemo(() => {
    const baseline = productFieldRawValue(
      baselineCpu.fields?.performancePerMsrp,
    );
    const relatedValue = productFieldRawValue(
      relativeCpu.fields?.performancePerMsrp,
    );

    return ((relatedValue / baseline) * 100).toFixed(0);
  }, [
    baselineCpu.fields?.performancePerMsrp,
    relativeCpu.fields?.performancePerMsrp,
  ]);

  const rating = useMemo(
    () => productFieldFormattedValue(relativeCpu.fields?.performancePerMsrp),
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
      values={[rating, `${relativeValuePct}%`]}
      highlight={baselineCpu.id === relativeCpu.id ? 'primary' : null}
      valueClassName="text-right"
    />
  );
};
