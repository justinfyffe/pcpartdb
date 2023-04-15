import { getViewGpuPath, Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { Table, TBody, Th, THead, Tr } from '../../../../../shared/components';
import { formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';
import { CustomRow, CustomRowLabel, CustomRowValue } from '../CustomRow';

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
            baselineGpu={gpu}
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
    () => getGpuName(relativeGpu, { company: false }),
    [relativeGpu],
  );

  return (
    <CustomRow
      key={relativeGpu.id}
      highlight={relativeGpu.id === baselineGpu.id}
    >
      <CustomRowLabel>
        <a href={href}>{gpuName}</a>
      </CustomRowLabel>
      <CustomRowValue className="text-right">{rating}</CustomRowValue>
      <CustomRowValue className="text-right">
        {relativeValuePct}%
      </CustomRowValue>
    </CustomRow>
  );
};
