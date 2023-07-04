import { Cpu, getViewCpuPath } from '@pcpartdb/shared';
import {
  formatCpuField,
  formatCpuName,
  ProductCustomRow,
} from 'packages/website/src/client/product';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { ViewPageContext } from '../../context';

interface ValueTableProps {
  className?: string;
}

export const ValueTable: FunctionComponent<ValueTableProps> = (props) => {
  const { className } = props;
  const { cpu, contentData } = useContext(ViewPageContext);
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
  baselineCpu: Cpu;
  relativeCpu: Cpu;
}

const ValueTableRow: FunctionComponent<ValueTableRowProps> = (props) => {
  const { baselineCpu, relativeCpu } = props;

  const relativeValuePct = useMemo(() => {
    const baseline = baselineCpu.valueScore.value;
    const relatedValue = relativeCpu.valueScore.value;

    return ((relatedValue / baseline) * 100).toFixed(0);
  }, [baselineCpu.valueScore.value, relativeCpu.valueScore.value]);

  const rating = useMemo(
    () => formatCpuField(relativeCpu.valueScore),
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
      values={[rating, `${relativeValuePct}%`]}
      highlight={baselineCpu.id === relativeCpu.id ? 'primary' : null}
      valueClassName="text-right"
    />
  );
};
